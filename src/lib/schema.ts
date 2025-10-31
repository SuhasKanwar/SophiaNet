import z from 'zod';

export const createConversationSchema = z.object({
    title: z.string().optional(),
    variant: z.enum(['chat', 'notes_tool', 'youtube_tool', 'diagram_tool', 'image_filter_tool']).default('chat')
});

export const renameConversationSchema = z.object({
    conversationId: z.string().uuid(),
    title: z.string().min(1).max(100)
});

export const deleteConversationSchema = z.object({
    conversationId: z.string().uuid()
});

export const sendMessageSchema = z.object({
    conversationId: z.string().uuid(),
    content: z.string().min(1).max(10000)
});

export const getMessagesSchema = z.object({
    conversationId: z.string().uuid()
});

export const deleteMessageSchema = z.object({
    messageId: z.string().uuid()
});