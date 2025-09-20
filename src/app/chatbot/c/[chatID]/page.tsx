import ChatbotClient from "@/components/ChatbotClient";

export default async function ChatPage({ params } : { params: { chatID: string } }) {
  const chatID = (await params).chatID;
  return <ChatbotClient chatID={chatID} />;
}