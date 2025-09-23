import { Bot, Copy, Check, Download, Image as ImageIcon } from "lucide-react";
import { renderMarkdownWithCodeBlocks } from "@/lib/utils";
import FileIconTag from "@/components/chat/FileIconTag";
import { BotMessageProps, UserMessageProps } from "@/types/chatMessages";
import { Skeleton } from "@/components/ui/skeleton";

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
  imageUrl,
  onCopy,
  onDownloadImage,
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
      return (
        <BotImageMessage
          message={message}
          onCopy={onCopy}
          isRendering={false}
          copiedMessageId={copiedMessageId}
          imageUrl={imageUrl}
          onDownloadImage={onDownloadImage}
        />
      );
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
            {renderMarkdownWithCodeBlocks(message?.text || "")}
          </div>
          {onCopy && message && (
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
        {message?.attachments?.length ? (
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

function BotImageMessage({
  imageUrl,
  onCopy,
  onDownloadImage,
  isRendering,
  message,
  copiedMessageId
}: Omit<BotMessageProps, "variant">) {
  return (
    <>
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
        <Bot className="w-4 h-4 text-indigo-300" />
      </div>
      <div className="flex flex-col items-start max-w-[70%]">
        <div className="relative group">
          <div className="rounded-2xl p-4 text-sm shadow backdrop-blur border bg-white/5 border-white/10 text-neutral-200">
            {message?.text && (
              <div className="mb-3">
                {renderMarkdownWithCodeBlocks(message.text)}
              </div>
            )}

            {isRendering ? (
              <div className="flex flex-col items-center space-y-3 p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-400/30">
                  <ImageIcon className="w-8 h-8 text-indigo-300 animate-pulse" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ) : imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Generated image"
                  className="max-w-full h-auto rounded-lg border border-white/20 shadow-lg"
                  style={{ maxHeight: "400px" }}
                />
                {onCopy && message && (
                  <button
                    onClick={() => onCopy(imageUrl, message.id)}
                    className="absolute top-2 right-10 p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10"
                    title="Copy message"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
                {onDownloadImage && (
                  <button
                    onClick={onDownloadImage}
                    className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10"
                    title="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3 p-6 text-neutral-400">
                <ImageIcon className="w-12 h-12" />
                <span className="text-sm">Image not available</span>
              </div>
            )}
          </div>
        </div>
        {message?.attachments?.length ? (
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