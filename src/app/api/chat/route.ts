import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { sendMessageSchema, getMessagesSchema, deleteMessageSchema } from "@/lib/schema";
import { SUPPORTED_FILE_TYPES, FileType } from "@/types/files";

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

        const messages = await prisma.message.findMany({
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
        if (contentType.includes("multipart/form-data")) {
            const form = await request.formData();
            const conversationId = form.get("conversationId");
            const content = form.get("content");
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
        }

        const validatedData = sendMessageSchema.parse(body);

        const conversation = await prisma.conversation.findFirst({
            where: { id: validatedData.conversationId, userId: (user as any).id }
        });

        if (!conversation) {
            return Response.json({ success: false, message: "Conversation not found" }, { status: 404 });
        }

        const userMessage = await prisma.message.create({
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

        const fileNote = files.length
            ? ` (Received files: ${files.map(f => f.name).join(", ")})`
            : "";

        // TODO: Implement bot response generation
        const botResponse = `This is a bot response to: "${validatedData.content}"${fileNote}`;

        const botMessage = await prisma.message.create({
            data: {
                conversationId: validatedData.conversationId,
                sender: 'bot',
                content: botResponse
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

        const message = await prisma.message.findFirst({
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

        await prisma.message.delete({
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