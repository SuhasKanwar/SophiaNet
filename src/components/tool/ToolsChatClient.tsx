interface ToolsChatClientProps {
    tool: string;
    chatId: string;
}

export default function ToolsChatClient({ tool, chatId }: ToolsChatClientProps) {
    return (
        <section className="flex flex-col w-full px-3 pt-4 items-center h-full mt-[var(--navbar-height,64px)]">
            ToolsChatClient
            <p>Tool: {tool}</p>
            <p>Chat ID: {chatId}</p>
        </section>
    );
}