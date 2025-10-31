import ToolsChatClient from "@/components/tool/ToolsChatClient";

export default async function ToolChatPage({ params }: { params: { tool: string, chatId: string} }) {
    const { tool, chatId } = await params;
    return  (
        <ToolsChatClient tool={tool} chatId={chatId} />
    );
}