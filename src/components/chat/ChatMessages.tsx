import { Bot, Copy, Check } from "lucide-react";
import { renderMarkdownWithCodeBlocks } from "@/lib/utils";
import FileIconTag from "@/components/chat/FileIconTag";
import { BotMessageProps, UserMessageProps } from "@/types/chatMessages";

export function UserMessage({ message }: UserMessageProps) {
  return (
    <>
      <div className="flex flex-col items-end max-w-[70%]">
        <div className="relative group">
          <div className="rounded-2xl px-4 py-3 text-sm leading-loose shadow backdrop-blur border bg-indigo-500/20 border-indigo-400/30 text-indigo-50">
            {renderMarkdownWithCodeBlocks(message.text || "")}
          </div>
        </div>
        {message.attachments?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((name, i) => (
              <FileIconTag key={i} name={name} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
        <span className="text-[11px] font-medium text-indigo-200">You</span>
      </div>
    </>
  );
}

export function BotMessage({
  variant,
  message,
  onCopy,
  copiedMessageId,
}: BotMessageProps) {
  switch (variant) {
    case "chat":
      return (
        <BotChatMessage
          message={message}
          onCopy={onCopy}
          copiedMessageId={copiedMessageId}
        />
      );
    case "image":
      return <BotImageMessage />;
    default:
      return null;
  }
}

function BotChatMessage({
  message,
  onCopy,
  copiedMessageId,
}: Omit<BotMessageProps, "variant">) {
  return (
    <>
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
        <Bot className="w-4 h-4 text-indigo-300" />
      </div>
      <div className="flex flex-col items-start max-w-[70%]">
        <div className="relative group">
          <div className="rounded-2xl px-4 py-3 text-sm leading-loose shadow backdrop-blur border bg-white/5 border-white/10 text-neutral-200">
            {renderMarkdownWithCodeBlocks(message.text || "")}
          </div>
          {onCopy && (
            <button
              onClick={() => onCopy(message.text, message.id)}
              className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10"
              title="Copy message"
            >
              {copiedMessageId === message.id ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
        {message.attachments?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((name, i) => (
              <FileIconTag key={i} name={name} />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}

function BotImageMessage() {
  return <div>Bot Image Message</div>;
}