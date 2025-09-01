import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { sendMessageSchema, getMessagesSchema, deleteMessageSchema } from "@/lib/schema";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const user: User | null = session?.user || null;
    if(!session || !session.user) {
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
            data: messages
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return Response.json(
                {
                    success: false,
                    message: "Invalid request data"
                },
                {
                    status: 400
                }
            );
        }
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const user: User | null = session?.user || null;
    if(!session || !session.user) {
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
        const validatedData = sendMessageSchema.parse(body);

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

        const userMessage = await prisma.message.create({
            data: {
                conversationId: validatedData.conversationId,
                sender: 'user',
                content: validatedData.content
            }
        });

        // Update conversation's lastUpdated and unarchive if archived
        await prisma.conversation.update({
            where: {
                id: validatedData.conversationId
            },
            data: {
                isArchived: false,
                lastUpdated: new Date()
            }
        });

        // Here you would typically integrate with your AI service
        // For now, creating a simple bot response
        const botMessage = await prisma.message.create({
            data: {
                conversationId: validatedData.conversationId,
                sender: 'bot',
                content: `This is a bot response to: "${validatedData.content}"`
            }
        });

        return Response.json({
            success: true,
            data: {
                userMessage,
                botMessage
            }
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return Response.json(
                {
                    success: false,
                    message: "Invalid request data"
                },
                {
                    status: 400
                }
            );
        }
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    const user: User | null = session?.user || null;
    if(!session || !session.user) {
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

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return Response.json(
                {
                    success: false,
                    message: "Invalid request data"
                },
                {
                    status: 400
                }
            );
        }
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}