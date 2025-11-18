"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Bot } from "lucide-react";
import axios from "axios";
import { useToast } from "@/providers/ToastProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMessage, BotMessage } from "@/components/chat/ChatMessages";
import { ChatMessage } from "@/types/chatMessages";
import ChatInputComponent from "@/components/chat/ChatInputComponent";
import ImageModal from "@/components/ui/image-modal";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import ToolsHeading from "@/components/tool/ToolsHeading";
import { ToolVariant } from "@/types/tools";

interface ChatbotClientProps {
  chatID: string;
}

type ConversationVariant = "chat" | ToolVariant;

export default function ChatbotClient({ chatID }: ChatbotClientProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [conversationVariant, setConversationVariant] = useState<ConversationVariant>("chat");
  const [conversationTitle, setConversationTitle] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const { showToast } = useToast();
  const { toggle: toggleSpeak, currentMessageId: speakingMessageId } = useTextToSpeech({
    rate: 1,
    pitch: 1,
    volume: 1,
    onError: (error) => {
      showToast({
        type: "error",
        title: "Speech Error",
        message: error,
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    const scrollToBottom = () => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, loading]);

  const fetchMessages = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const convRes = await axios.get("/api/conversation", {
        params: { conversationId: chatID },
      }).catch(() => null);

      if (convRes?.data?.success && Array.isArray(convRes.data.data)) {
        const conv = convRes.data.data.find((c: any) => c.id === chatID);
        if (conv) {
          setConversationVariant(conv.variant as ConversationVariant);
          setConversationTitle(conv.title || null);
        }
      }

      const res = await axios.get("/api/chat", {
        params: { conversationId: chatID },
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed");
      const mapped: ChatMessage[] = res.data.data.map((m: any) => ({
        id: m.id,
        sender: m.sender,
        text: m.content,
        createdAt: m.createdAt,
        type: m.type || "text",
        imageUrl: m.imageUrl,
      }));
      setMessages(mapped);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e.message || "Failed to load messages"
      );
    } finally {
      setInitialLoading(false);
    }
  }, [chatID]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const getToolHeading = () => {
    if (conversationVariant === "notes_tool") {
      return { first: "Notes", second: "Tool (OCR)" };
    }
    if (conversationVariant === "youtube_tool") {
      return { first: "YouTube Video", second: "Tool" };
    }
    if (conversationVariant === "diagram_tool") {
      return { first: "Diagrams", second: "Tool" };
    }
    if (conversationVariant === "image_filter_tool") {
      return { first: "Image Filter", second: "Tool" };
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);

    const sessionHistory = messages.map((m) => ({
      id: m.id,
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
      createdAt: m.createdAt,
    }));

    const content = input;
    const attachments = selectedFiles.map((f) => f.name);
    const optimistic: ChatMessage = {
      id: "temp-" + Date.now(),
      sender: "user",
      text: content,
      attachments: attachments.length ? attachments : undefined,
    };

    setInput("");
    setMessages((p) => [...p, optimistic]);

    try {
      let res;
      if (selectedFiles.length > 0) {
        const fd = new FormData();
        fd.append("conversationId", chatID);
        fd.append("content", content);
        fd.append("history", JSON.stringify(sessionHistory));
        selectedFiles.forEach((f) => fd.append("files", f));
        res = await axios.post("/api/chat", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/api/chat", {
          conversationId: chatID,
          content: content,
          history: sessionHistory,
        });
      }
      if (!res.data.success)
        throw new Error(res.data.message || "Failed to send");
      setMessages((prev) => {
        const without = prev.filter((m) => m.id !== optimistic.id);
        return [
          ...without,
          {
            id: res.data.data.userMessage.id,
            sender: res.data.data.userMessage.sender,
            text: res.data.data.userMessage.content,
            attachments: attachments.length ? attachments : undefined,
          },
          {
            id: res.data.data.botMessage.id,
            sender: res.data.data.botMessage.sender,
            text: res.data.data.botMessage.content,
            type: res.data.data.botMessage.type || "text",
            imageUrl: res.data.data.botMessage.imageUrl,
          },
        ];
      });
    } catch (e: any) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(content);
      setError(
        e?.response?.data?.message || e.message || "Failed to send message"
      );
    } finally {
      setLoading(false);
      setSelectedFiles([]);
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      showToast({
        type: "info",
        title: "Copied to clipboard",
        message: "Copied successfully",
        duration: 2000,
      });
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadImage = async (imgRef: React.RefObject<HTMLImageElement | null>, messageId: string) => {
    try {
      if (!imgRef.current) throw new Error("Image not found");
      
      const imageUrl = imgRef.current.src;

      showToast({
        type: "info",
        title: "Downloading",
        message: "Image is being downloaded",
        duration: 2000,
      });
      
      const response = await axios.get('/api/download-image', {
        params: { url: imageUrl },
        responseType: 'blob',
      });
      
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `sophia-image-${messageId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast({
        type: "success",
        title: "Image downloaded",
        message: "Image downloaded successfully",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to download image: ", err);
      showToast({
        type: "error",
        title: "Download failed",
        message: "Failed to download the image",
        duration: 3000,
      });
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
  };

  const closeModal = () => {
    setModalImageUrl(null);
  };

  return (
    <section className="flex flex-col w-full px-3 pt-4 items-center h-full mt-[var(--navbar-height,64px)]">
      {conversationVariant !== "chat" && (
        <div className="w-full flex flex-col items-center mb-2">
          {(() => {
            const h = getToolHeading();
            if (!h) return null;
            return <ToolsHeading firstPart={h.first} secondPart={h.second} />;
          })()}
        </div>
      )}

      <div className="w-full max-w-6xl h-full flex flex-col mx-auto pb-[100px]">
        <div
          ref={chatContainerRef}
          className="flex-1 w-full mx-auto mb-2 overflow-y-auto hide-scrollbar space-y-6 px-1"
          style={{ minHeight: 0 }}
        >
          {initialLoading && (
            <div className="space-y-6">
              <div className="flex gap-3 justify-end">
                <div className="flex flex-col items-end max-w-[70%]">
                  <div className="rounded-2xl px-4 py-3 bg-indigo-500/20 border border-indigo-400/30">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
              <div className="flex gap-3 justify-start">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex flex-col items-start max-w-[70%]">
                  <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
                    <Skeleton className="h-4 w-80 mb-2" />
                    <Skeleton className="h-4 w-60 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="flex flex-col items-end max-w-[70%]">
                  <div className="rounded-2xl px-4 py-3 bg-indigo-500/20 border border-indigo-400/30">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
              <div className="flex gap-3 justify-start">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex flex-col items-start max-w-[70%]">
                  <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
                    <Skeleton className="h-4 w-80 mb-2" />
                    <Skeleton className="h-4 w-60 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {!initialLoading && messages.length === 0 && (
            <div className="text-neutral-500 text-sm">
              No messages yet. Start the conversation.
            </div>
          )}
          {messages.map((m, index) => (
            <div
              key={m.id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`flex gap-3 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.sender === "user" ? (
                <UserMessage 
                  message={m} 
                  onCopy={copyToClipboard}
                  copiedMessageId={copiedMessageId}
                  onSpeak={toggleSpeak}
                  speakingMessageId={speakingMessageId}
                />
              ) : (
                <BotMessage
                  variant={m.type === "image" ? "image" : "chat"}
                  message={m}
                  imageUrl={m.imageUrl}
                  onCopy={copyToClipboard}
                  imgRef={imgRef}
                  onDownloadImage={() => m.imageUrl && downloadImage(imgRef, m.id)}
                  copiedMessageId={copiedMessageId}
                  onImageClick={handleImageClick}
                  onSpeak={toggleSpeak}
                  speakingMessageId={speakingMessageId}
                />
              )}
            </div>
          ))}
          {loading && (
            <div ref={lastMessageRef} className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
                <Bot className="w-4 h-4 text-indigo-300" />
              </div>
              <div className="flex flex-col items-start max-w-[70%]">
                <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          )}
          {error && <div className="text-red-400 text-xs">{error}</div>}
        </div>
      </div>

      <ChatInputComponent
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        loading={loading}
        onError={setError}
        onFilesChange={setSelectedFiles}
        bottomText={`Conversation ID: ${chatID}`}
      />

      <ImageModal
        isOpen={!!modalImageUrl}
        imageUrl={modalImageUrl || ""}
        alt="Generated image"
        onClose={closeModal}
      />
    </section>
  );
}