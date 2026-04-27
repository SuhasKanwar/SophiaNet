export type variants = "chat" | "image";

export interface PerformanceMetrics {
  latency_ms?: number;
  bleu_score?: number | null;
  rouge_l_score?: number | null;
  retrieval_rouge_l?: number | null;
  chunks_retrieved?: number;
  response_length?: number;
  clip_score?: number | null;
  image_size_bytes?: number;
  [key: string]: unknown;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  createdAt?: string;
  attachments?: string[];
  type?: variants;
  imageUrl?: string;
  performanceMetrics?: PerformanceMetrics;
}

export interface UserMessageProps {
  message: ChatMessage;
  onCopy?: (text: string, messageId: string) => void;
  copiedMessageId?: string | null;
  onSpeak?: (text: string, messageId: string) => void;
  speakingMessageId?: string | null;
}

export interface BotMessageProps {
  variant: variants;
  message: ChatMessage;
  imgRef?: React.RefObject<HTMLImageElement | null>;
  imageUrl?: string;
  isRendering?: boolean;
  onDownloadImage?: () => void;
  onCopy?: (text: string, messageId: string) => void;
  copiedMessageId?: string | null;
  onImageClick?: (imageUrl: string) => void;
  onSpeak?: (text: string, messageId: string) => void;
  speakingMessageId?: string | null;
}