import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { createConversationSchema, deleteConversationSchema } from "@/lib/schema";

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
        const conversations = await prisma.conversation.findMany({
            where: {
                userId: (user as any).id,
                isArchived: false
            },
            select: {
                id: true,
                title: true,
                startedAt: true,
                variant: true,
                lastUpdated: true,
                _count: {
                    select: {
                        chats: true
                    }
                }
            },
            orderBy: {
                lastUpdated: 'desc'
            }
        });

        return Response.json({
            success: true,
            data: conversations
        });
    }
    catch (error) {
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
        const validatedData = createConversationSchema.parse(body);

        const conversation = await prisma.conversation.create({
            data: {
                userId: (user as any).id,
                title: validatedData.title,
                variant: validatedData.variant,
                startedAt: new Date(),
                lastUpdated: new Date(),
                isArchived: false
            }
        });

        return Response.json({
            success: true,
            data: conversation
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
        const validatedData = deleteConversationSchema.parse(body);

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

        await prisma.conversation.delete({
            where: {
                id: validatedData.conversationId
            }
        });

        return Response.json({
            success: true,
            message: "Conversation deleted successfully"
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