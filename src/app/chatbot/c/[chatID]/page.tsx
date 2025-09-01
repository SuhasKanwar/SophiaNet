"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Mic, Send, UploadCloud, Bot, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  createdAt?: string;
}

export default function ChatPage({ params }: { params: { chatID: string } }) {
  const chatID = params.chatID;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
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
      const msg =
        (e)?.response?.data?.message ||
        (e as Error).message ||
        "Failed to load messages";
      setError(msg);
    } finally {
      setInitialLoading(false);
    }
  }, [chatID]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // If redirected with ?q= initial prompt but message already sent server-side, ignore.
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && messages.length === 0 && !initialLoading) {
      // Messages should already include this; if not, just set input.
      setInput("");
    }
  }, [searchParams, messages, initialLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };
  const removeFile = () => setSelectedFile(null);

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Speech recognition not supported");
      return;
    }
    setVoiceActive(true);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setVoiceActive(false);
    };
    recognition.onerror = () => {
      setError("Voice input failed");
      setVoiceActive(false);
    };
    recognition.onend = () => setVoiceActive(false);
    recognition.start();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    const optimisticUser: ChatMessage = {
      id: "temp-user-" + Date.now(),
      sender: "user",
      text: input
    };
    setMessages((prev) => [...prev, optimisticUser]);
    const content = input;
    setInput("");
    try {
      const res = await axios.post("/api/chat", {
        conversationId: chatID,
        content
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed to send");
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== optimisticUser.id);
        return [
          ...withoutTemp,
          {
            id: res.data.data.userMessage.id,
            sender: res.data.data.userMessage.sender,
            text: res.data.data.userMessage.content
          },
          {
            id: res.data.data.botMessage.id,
            sender: res.data.data.botMessage.sender,
            text: res.data.data.botMessage.content
          }
        ];
      });
    } catch (e: any) {
      const msg =
        (e)?.response?.data?.message ||
        (e as Error).message ||
        "Failed to send message";
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id));
      setInput(content);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <section
      className="flex flex-col w-full px-3 pt-4 pb-3 items-center"
      style={{ height: "calc(99vh - var(--navbar-height,64px))" }}
    >
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{scrollbar-width:none;-ms-overflow-style:none}`}</style>
      <div className="w-full max-w-6xl h-full flex flex-col mx-auto">
        <div
          ref={chatContainerRef}
            className="flex-1 w-full mx-auto mb-4 overflow-y-auto hide-scrollbar space-y-6 px-1"
          style={{ minHeight: 0 }}
        >
          {initialLoading && (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading conversation...
            </div>
          )}
          {!initialLoading && messages.length === 0 && (
            <div className="text-neutral-500 text-sm">No messages yet. Start the conversation.</div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
                  <Bot className="w-4 h-4 text-indigo-300" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow backdrop-blur border ${
                  m.sender === "user"
                    ? "bg-indigo-500/20 border-indigo-400/30 text-indigo-50"
                    : "bg-white/5 border-white/10 text-neutral-200"
                }`}
              >
                {m.text}
              </div>
              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
                  <span className="text-[11px] font-medium text-indigo-200">You</span>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating response...
            </div>
          )}
          {error && <div className="text-red-400 text-xs">{error}</div>}
        </div>

        <div className="w-full max-w-3xl mx-auto shrink-0">
          {selectedFile && (
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-2 text-xs">
              <span className="truncate max-w-[80%] text-neutral-300">{selectedFile.name}</span>
              <button onClick={removeFile} className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>
          )}
          <div className="rounded-2xl border border-indigo-400/40 bg-white/5 backdrop-blur-xl flex items-center px-4 py-3 gap-2 shadow-lg">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
              disabled={loading}
              title="Upload file"
            >
              <UploadCloud className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.txt,.md,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
            />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm px-2 py-1 placeholder:text-neutral-500"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) sendMessage();
              }}
              disabled={loading}
            />
            <button
              onClick={handleVoice}
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
          <div className="text-[11px] text-neutral-500 text-center mt-2">
            Conversation ID: {chatID}
          </div>
        </div>
      </div>
    </section>
  );
}