import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { sendMessageSchema, getMessagesSchema, deleteMessageSchema } from "@/lib/schema";
import { SUPPORTED_FILE_TYPES, FileType } from "@/types/files";
// removed axios; using fetch with FormData to call microservice
import { MICROSERVICE_BASE_URL } from "@/lib/config";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const user: User | null = session?.user || null;
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return Response.json(
                {
                    success: false,
                    message: "conversationId is required"
                },
                {
                    status: 400
                }
            );
        }

        const validatedData = getMessagesSchema.parse({ conversationId });

        const conversation = await prisma.conversation.findFirst({
            where: {
                id: validatedData.conversationId,
                userId: (user as any).id
            }
        });

        if (!conversation) {
            return Response.json(
                {
                    success: false,
                    message: "Conversation not found"
                },
                {
                    status: 404
                }
            );
        }

        const messages = await prisma.chat.findMany({
            where: {
                conversationId: validatedData.conversationId
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return Response.json({
            success: true,
            message: "Messages retrieved successfully",
            data: messages
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return Response.json(
                {
                    success: false,
                    message: "Invalid request data",
                    error: (error as any).issues || error.message
                },
                { status: 400 }
            );
        }
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

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
            body = { conversationId, content };
        } else {
            body = await request.json();
            sessionHistory = body?.history ?? [];
        }

        const validatedData = sendMessageSchema.parse(body);

        const conversation = await prisma.conversation.findFirst({
            where: { id: validatedData.conversationId, userId: (user as any).id }
        });

        if (!conversation) {
            return Response.json({ success: false, message: "Conversation not found" }, { status: 404 });
        }

        const userMessage = await prisma.chat.create({
            data: {
                conversationId: validatedData.conversationId,
                sender: 'user',
                content: validatedData.content
            }
        });

        await prisma.conversation.update({
            where: { id: validatedData.conversationId },
            data: { lastUpdated: new Date() }
        });

        const history = Array.isArray(sessionHistory)
            ? sessionHistory.map((m: any) => ({
                id: m?.id ?? undefined,
                role: m?.role ?? (m?.sender === 'user' ? 'user' : 'assistant'),
                content: m?.content ?? m?.text ?? '',
                createdAt: m?.createdAt ?? undefined
            })).filter((m: any) => typeof m.content === 'string' && m.content.length > 0)
            : [];

        const msForm = new FormData();
        msForm.append("conversationId", validatedData.conversationId);
        msForm.append("prompt", validatedData.content);
        msForm.append("session_history", JSON.stringify(history));
        for (const f of files) {
            msForm.append("files", f, f.name);
        }

        let msRes: Response;
        if (files.length > 0) {
            msRes = await fetch(`${MICROSERVICE_BASE_URL}/generate`, {
                method: "POST",
                body: msForm
            });
        } else {
            msRes = await fetch(`${MICROSERVICE_BASE_URL}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: validatedData.content,
                    session_history: history,
                    files: []
                })
            });
        }

        if (!msRes.ok) {
            const errText = await msRes.text().catch(() => "");
            throw new Error(`Upstream error ${msRes.status}: ${msRes.statusText}${errText ? ` - ${errText}` : ""}`);
        }

        let replyText = (await msRes.json()).response;
        if (!replyText) {
            replyText = "I'm sorry, I couldn't generate a response.";
        }

        const botMessage = await prisma.chat.create({
            data: {
                conversationId: validatedData.conversationId,
                sender: 'bot',
                content: replyText
            }
        });

        return Response.json({
            success: true,
            message: "Response generated successfully",
            data: { userMessage, botMessage, attachments: files.map(f => f.name) }
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return Response.json(
                { success: false, message: "Invalid request data", error: (error as any).issues || error.message },
                { status: 400 }
            );
        }
        return Response.json(
            { success: false, message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    const user: User | null = session?.user || null;
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        );
    }

    try {
        const body = await request.json();
        const validatedData = deleteMessageSchema.parse(body);

        const message = await prisma.chat.findFirst({
            where: {
                id: validatedData.messageId
            },
            include: {
                conversation: true
            }
        });

        if (!message) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found"
                },
                {
                    status: 404
                }
            );
        }

        if (message.conversation.userId !== (user as any).id) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized to delete this message"
                },
                {
                    status: 403
                }
            );
        }

        await prisma.chat.delete({
            where: {
                id: validatedData.messageId
            }
        });

        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            {
                status: 200
            }
        );
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return Response.json(
                {
                    success: false,
                    message: "Invalid request data",
                    error: (error as any).issues || error.message
                },
                { status: 400 }
            );
        }
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}