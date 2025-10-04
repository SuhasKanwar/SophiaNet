import { Bot, Copy, Check, Download, Image as ImageIcon, Volume2, VolumeX } from "lucide-react";
import { renderMarkdownWithCodeBlocks } from "@/lib/utils";
import FileIconTag from "@/components/chat/FileIconTag";
import { BotMessageProps, UserMessageProps } from "@/types/chatMessages";
import { Skeleton } from "@/components/ui/skeleton";

export function UserMessage({
  message,
  onCopy,
  copiedMessageId,
  onSpeak,
  speakingMessageId,
}: UserMessageProps) {
  const isSpeaking = speakingMessageId === message.id;

  return (
    <>
      <div className="flex flex-col items-end max-w-[70%] group">
        <div className="relative">
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
        <div className="mt-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onCopy && message && (
            <button
              onClick={() => onCopy(message.text, message.id)}
              className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-indigo-100 border border-white/10"
              title="Copy message"
            >
              {copiedMessageId === message.id ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
          {onSpeak && message && (
            <button
              onClick={() => onSpeak(message.text, message.id)}
              className={`p-1 rounded-md border border-white/10 ${
                isSpeaking
                  ? "bg-indigo-500/30 text-indigo-200 animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-indigo-100"
              }`}
              title={isSpeaking ? "Stop speaking" : "Speak message"}
            >
              {isSpeaking ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
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
  onImageClick,
  onSpeak,
  speakingMessageId,
}: BotMessageProps) {
  switch (variant) {
    case "chat":
      return (
        <BotChatMessage
          message={message}
          onCopy={onCopy}
          copiedMessageId={copiedMessageId}
          onSpeak={onSpeak}
          speakingMessageId={speakingMessageId}
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
          onImageClick={onImageClick}
          onSpeak={onSpeak}
          speakingMessageId={speakingMessageId}
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
  onSpeak,
  speakingMessageId,
}: Omit<BotMessageProps, "variant">) {
  const isSpeaking = speakingMessageId === message?.id;

  return (
    <>
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
        <Bot className="w-4 h-4 text-indigo-300" />
      </div>
      <div className="flex flex-col items-start max-w-[70%] group">
        <div className="relative">
          <div className="rounded-2xl px-4 py-3 text-sm leading-loose shadow backdrop-blur border bg-white/5 border-white/10 text-neutral-200">
            {renderMarkdownWithCodeBlocks(message?.text || "")}
          </div>
        </div>
        {message?.attachments?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((name, i) => (
              <FileIconTag key={i} name={name} />
            ))}
          </div>
        ) : null}
        <div className="mt-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onCopy && message && (
            <button
              onClick={() => onCopy(message.text, message.id)}
              className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200 border border-white/10"
              title="Copy message"
            >
              {copiedMessageId === message.id ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
          {onSpeak && message && (
            <button
              onClick={() => onSpeak(message.text, message.id)}
              className={`p-1 rounded-md border border-white/10 ${
                isSpeaking
                  ? "bg-indigo-500/30 text-indigo-200 animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200"
              }`}
              title={isSpeaking ? "Stop speaking" : "Speak message"}
            >
              {isSpeaking ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
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
  copiedMessageId,
  onImageClick,
  onSpeak,
  speakingMessageId,
}: Omit<BotMessageProps, "variant"> & {
  onImageClick?: (imageUrl: string) => void;
}) {
  const isSpeaking = speakingMessageId === message?.id;

  return (
    <>
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
        <Bot className="w-4 h-4 text-indigo-300" />
      </div>
      <div className="flex flex-col items-start max-w-[70%] group">
        <div className="relative">
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
              <div>
                <img
                  src={imageUrl}
                  alt="Generated image"
                  className="max-w-full h-auto rounded-lg border border-white/20 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ maxHeight: "400px" }}
                  onClick={() => onImageClick?.(imageUrl)}
                />
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
        <div className="mt-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {imageUrl && onCopy && message && (
            <button
              onClick={() => onCopy(imageUrl, message.id)}
              className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200 border border-white/10"
              title="Copy image URL"
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
              className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200 border border-white/10"
              title="Download image"
            >
              <Download className="w-3 h-3" />
            </button>
          )}
          {onSpeak && message && message.text && (
            <button
              onClick={() => onSpeak(message.text, message.id)}
              className={`p-1 rounded-md border border-white/10 ${
                isSpeaking
                  ? "bg-indigo-500/30 text-indigo-200 animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200"
              }`}
              title={isSpeaking ? "Stop speaking" : "Speak message"}
            >
              {isSpeaking ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}