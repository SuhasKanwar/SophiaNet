export type variants = "chat" | "image";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  createdAt?: string;
  attachments?: string[];
  type?: variants;
  imageUrl?: string;
}

export interface UserMessageProps {
  message: ChatMessage;
}

export interface BotMessageProps {
  variant: variants;
  message: ChatMessage;
  imageUrl?: string;
  isRendering?: boolean;
  onDownloadImage?: () => void;
  onCopy?: (text: string, messageId: string) => void;
  copiedMessageId?: string | null;
}