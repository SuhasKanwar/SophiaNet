import ChatbotClient from "@/components/ChatbotClient";

export default function ChatPage({ params }: { params: { chatID: string } }) {
  return <ChatbotClient chatID={params.chatID} />;
}