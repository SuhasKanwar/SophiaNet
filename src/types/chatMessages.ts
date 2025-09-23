export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  createdAt?: string;
  attachments?: string[];
}

export interface UserMessageProps {
  message: ChatMessage;
}

export interface BotMessageProps {
  variant: "chat" | "image";
  message: ChatMessage;
  onCopy?: (text: string, messageId: string) => void;
  copiedMessageId?: string | null;
}