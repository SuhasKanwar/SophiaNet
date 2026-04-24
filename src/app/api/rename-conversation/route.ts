import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { renameConversationSchema } from "@/lib/schema";

export async function PUT(request: Request) {
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
        const validatedData = renameConversationSchema.parse(body);

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

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: validatedData.conversationId
            },
            data: {
                title: validatedData.title
            }
        });

        return Response.json({
            success: true,
            data: updatedConversation
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