import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { sendToolMessageSchema } from "@/lib/schema";
import { MICROSERVICE_BASE_URL } from "@/lib/config";
import { SUPPORTED_FILE_TYPES, FileType } from "@/types/files";
import { ToolVariant } from "@/types/tools";

const TOOL_ENDPOINTS: Record<ToolVariant, string> = {
  notes_tool: `${MICROSERVICE_BASE_URL}/process-ocr`,
  youtube_tool: `${MICROSERVICE_BASE_URL}/tools/youtube`,
  diagram_tool: `${MICROSERVICE_BASE_URL}/tools/diagram`,
  image_filter_tool: `${MICROSERVICE_BASE_URL}/tools/image-filter`
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User | null = session?.user || null;
  if (!session || !session.user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let body: any;
    let files: File[] = [];
    let sessionHistory: unknown = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const conversationId = form.get("conversationId");
      const content = form.get("content");
      const historyRaw = form.get("history");
      if (typeof historyRaw === "string") {
        try { sessionHistory = JSON.parse(historyRaw); } catch { sessionHistory = []; }
      }
      files = form.getAll("files").filter(f => typeof f === "object") as File[];
      const allowed = new Set<FileType>(SUPPORTED_FILE_TYPES);
      const invalid = files.filter(f => {
        const ext = f.name.split(".").pop()?.toLowerCase() as FileType | undefined;
        return !ext || !allowed.has(ext);
      });
      if (invalid.length) {
        return Response.json(
          {
            success: false,
            message: `Unsupported file type(s): ${invalid.map(f => f.name).join(", ")}`,
            allowed: Array.from(allowed)
          },
          { status: 400 }
        );
      }
      body = { conversationId, content, history: sessionHistory };
    } else {
      body = await request.json();
      sessionHistory = body?.history ?? [];
    }

    const validated = sendToolMessageSchema.parse(body);

    const conversation = await prisma.conversation.findFirst({
      where: { id: validated.conversationId, userId: (user as any).id }
    });

    if (!conversation) {
      return Response.json({ success: false, message: "Conversation not found" }, { status: 404 });
    }
    if (conversation.variant === "chat") {
      return Response.json({ success: false, message: "Not a tool conversation" }, { status: 400 });
    }

    const endpoint = TOOL_ENDPOINTS[conversation.variant as ToolVariant];
    if (!endpoint) {
      return Response.json({ success: false, message: "Unsupported tool variant" }, { status: 400 });
    }

    const userMessage = await prisma.chat.create({
      data: {
        conversationId: validated.conversationId,
        sender: 'user',
        content: validated.content
      }
    });

    await prisma.conversation.update({
      where: { id: validated.conversationId },
      data: { lastUpdated: new Date() }
    });

    const history = Array.isArray(sessionHistory)
      ? sessionHistory
      : [];

    let msRes: Response;
    if (files.length > 0) {
      const msForm = new FormData();
      msForm.append("conversationId", validated.conversationId);
      msForm.append("prompt", validated.content);
      msForm.append("session_history", JSON.stringify(history));
      for (const f of files) msForm.append("files", f, f.name);
      msRes = await fetch(endpoint, { method: "POST", body: msForm });
    } else {
      msRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: validated.conversationId,
          prompt: validated.content,
          session_history: history,
          files: []
        })
      });
    }

    if (!msRes.ok) {
      const errText = await msRes.text().catch(() => "");
      throw new Error(`Upstream error ${msRes.status}: ${msRes.statusText}${errText ? ` - ${errText}` : ""}`);
    }

    const response = await msRes.json();
    const model = response.model || "unknown";
    const replyText: string = response.response || "I'm sorry, I couldn't generate a response.";

    const botMessage = await prisma.chat.create({
      data: {
        conversationId: validated.conversationId,
        type: 'text',
        sender: 'bot',
        model,
        content: replyText
      }
    });

    return Response.json({
      success: true,
      message: "Response generated successfully",
      data: { userMessage, botMessage, attachments: files.map(f => f.name) }
    });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return Response.json(
        { success: false, message: "Invalid request data", error: error.issues || error.message },
        { status: 400 }
      );
    }
    return Response.json(
      { success: false, message: "Internal Server Error", error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
