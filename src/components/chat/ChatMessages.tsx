import { Bot, Copy, Check, Download, Image as ImageIcon, Volume2, VolumeX, Info } from "lucide-react";
import { renderMarkdownWithCodeBlocks } from "@/lib/utils";
import FileIconTag from "@/components/FileIconTag";
import { BotMessageProps, UserMessageProps, PerformanceMetrics } from "@/types/chatMessages";
import { Skeleton } from "@/components/ui/skeleton";

const METRIC_LABELS: Record<string, string> = {
  latency_ms: "Latency",
  bleu_score: "BLEU Score",
  rouge_l_score: "ROUGE-L Score",
  retrieval_rouge_l: "Retrieval ROUGE-L",
  chunks_retrieved: "Chunks Retrieved",
  response_length: "Response Length",
  clip_score: "CLIP Score",
  image_size_bytes: "Image Size",
};

function formatMetricValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return "N/A";
  if (key === "latency_ms") return `${(value as number).toFixed(0)} ms`;
  if (key === "image_size_bytes") {
    const bytes = value as number;
    return bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (key === "chunks_retrieved" || key === "response_length") return String(value);
  if (typeof value === "number") return value.toFixed(4);
  return String(value);
}

import { useState } from "react";

function MetricsTooltip({ metrics }: { metrics: PerformanceMetrics }) {
  const [isHovered, setIsHovered] = useState(false);

  const entries = Object.entries(metrics).filter(
    ([, v]) => v !== undefined && v !== null
  );
  if (entries.length === 0) return null;

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className="flex items-center gap-1 p-1 px-2 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200 border border-white/10 transition-colors text-[10px] font-medium"
        title="Performance Metrics"
      >
        <Info className="w-3 h-3" />
        <span>Metrics</span>
      </button>

      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
          <div className="rounded-xl px-4 py-3 text-xs shadow-xl backdrop-blur-xl border bg-neutral-900 border-white/20 min-w-[220px]">
            <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              Evaluation Metrics
            </div>
            <div className="space-y-1.5 whitespace-nowrap">
              {entries.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-6">
                  <span className="text-neutral-400">{METRIC_LABELS[key] || key}</span>
                  <span className="text-neutral-100 font-mono text-[11px]">
                    {formatMetricValue(key, value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-neutral-900 border-r border-b border-white/20" />
        </div>
      )}
    </div>
  );
}

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
  imgRef,
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
          imgRef={imgRef}
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
          {message?.performanceMetrics && (
            <MetricsTooltip metrics={message.performanceMetrics} />
          )}
        </div>
      </div>
    </>
  );
}

function BotImageMessage({
  imageUrl,
  onCopy,
  imgRef,
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
                  ref={imgRef}
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
          {message?.performanceMetrics && (
            <MetricsTooltip metrics={message.performanceMetrics} />
          )}
        </div>
      </div>
    </>
  );
}