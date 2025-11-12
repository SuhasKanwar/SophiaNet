import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { createToolConversationSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User | null = session?.user || null;
  if (!session || !session.user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createToolConversationSchema.parse(body);

    const conversation = await prisma.conversation.create({
      data: {
        userId: (user as any).id,
        title: validated.title,
        variant: validated.variant,
        startedAt: new Date(),
        lastUpdated: new Date(),
        isArchived: false
      }
    });

    return Response.json({ success: true, data: conversation });
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