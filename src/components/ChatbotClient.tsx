"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Mic, Send, UploadCloud, Bot, Copy, Check } from "lucide-react";
import axios from "axios";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useFileSelection } from "@/hooks/useFileSelection";
import { ACCEPT_FILE_TYPES } from "@/types/files";
import FileIconTag from "@/components/FileIconTag";
import { renderMarkdownWithCodeBlocks } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  createdAt?: string;
  attachments?: string[];
}

interface ChatbotClientProps {
  chatID: string;
}

export default function ChatbotClient({ chatID }: ChatbotClientProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { showToast } = useToast();

  const { files: selectedFiles, trigger: triggerFile, clearAll: clearFiles, removeAt, inputProps } =
    useFileSelection(ACCEPT_FILE_TYPES);

  const { start: startVoice, active: voiceActive } = useSpeechRecognition({
    onResult: (t) => setInput(t),
    onError: (m) => setError(m),
  });

  useEffect(() => {
    const scrollToBottom = () => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "start"
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
      const res = await axios.get("/api/chat", { params: { conversationId: chatID } });
      if (!res.data.success) throw new Error(res.data.message || "Failed");
      const mapped: ChatMessage[] = res.data.data.map((m: any) => ({
        id: m.id,
        sender: m.sender,
        text: m.content,
        createdAt: m.createdAt
      }));
      setMessages(mapped);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to load messages");
    } finally {
      setInitialLoading(false);
    }
  }, [chatID]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

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
      if (!res.data.success) throw new Error(res.data.message || "Failed to send");
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
          },
        ];
      });
    } catch (e: any) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(content);
      setError(e?.response?.data?.message || e.message || "Failed to send message");
    } finally {
      setLoading(false);
      clearFiles();
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      showToast({
        type: "info",
        title: "Copied to clipboard",
        message: "Message copied successfully",
        duration: 2000
      });
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className="flex flex-col w-full px-3 pt-4 items-center h-full mt-[var(--navbar-height,64px)]">
      <div className="w-full max-w-6xl h-full flex flex-col mx-auto pb-[100px]">
        <div ref={chatContainerRef} className="flex-1 w-full mx-auto mb-2 overflow-y-auto hide-scrollbar space-y-6 px-1" style={{ minHeight: 0 }}>
          {initialLoading && (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading conversation...
            </div>
          )}
          {!initialLoading && messages.length === 0 && (
            <div className="text-neutral-500 text-sm">No messages yet. Start the conversation.</div>
          )}
          {messages.map((m, index) => (
            <div 
              key={m.id} 
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
                  <Bot className="w-4 h-4 text-indigo-300" />
                </div>
              )}
              <div className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} max-w-[70%]`}>
                <div className="relative group">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow backdrop-blur border ${
                      m.sender === "user"
                        ? "bg-indigo-500/20 border-indigo-400/30 text-indigo-50"
                        : "bg-white/5 border-white/10 text-neutral-200"
                    }`}
                  >
                    {renderMarkdownWithCodeBlocks(m.text || "")}
                  </div>
                  {m.sender === "bot" && (
                    <button
                      onClick={() => copyToClipboard(m.text, m.id)}
                      className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10"
                      title="Copy message"
                    >
                      {copiedMessageId === m.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
                {m.attachments?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.attachments.map((name, i) => (
                      <FileIconTag key={i} name={name} />
                    ))}
                  </div>
                ) : null}
              </div>
              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
                  <span className="text-[11px] font-medium text-indigo-200">You</span>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div ref={lastMessageRef} className="flex items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating response...
            </div>
          )}
          {error && <div className="text-red-400 text-xs">{error}</div>}
        </div>
      </div>

      <div className="fixed z-10 bottom-0 left-[calc(var(--sidebar-width,60px))] right-0 p-2">
        <div className="w-full max-w-3xl mx-auto">
          {selectedFiles.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-2 space-y-2 max-h-36 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((f, i) => (
                  <FileIconTag key={i} name={f.name} onRemove={() => removeAt(i)} />
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={clearFiles} className="text-[10px] text-red-400 hover:underline">Clear all</button>
              </div>
            </div>
          )}
          <div className="rounded-2xl border border-indigo-400/40 bg-white/5 backdrop-blur-xl flex items-center px-4 py-3 gap-2 shadow-lg">
            <button
              onClick={triggerFile}
              className="p-2 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
              disabled={loading}
              title="Upload file"
            >
              <UploadCloud className="w-5 h-5" />
            </button>
            <input {...inputProps} />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm px-2 py-1 placeholder:text-neutral-500"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !loading) sendMessage(); }}
              disabled={loading}
              maxLength={4000}
            />
            <button
              onClick={startVoice}
              disabled={loading || voiceActive}
              className={`p-2 rounded-md border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 ${
                voiceActive ? "animate-pulse bg-indigo-500/20 border-indigo-400/40 text-indigo-200" : ""
              }`}
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-2 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium hover:from-indigo-400 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed shadow border border-indigo-400/40"
              title="Send"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-[11px] text-neutral-500 text-center mt-1">
            Conversation ID: {chatID}
          </div>
        </div>
      </div>
    </section>
  );
}