"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Send, UploadCloud, Bot, X } from "lucide-react";
import SuggestionCard from "@/components/SuggestionCard";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useFileSelection } from "@/hooks/useFileSelection";
import { ACCEPT_FILE_TYPES } from "@/types/files";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
}

const SUGGESTIONS = [
  {
    title: "General Question",
    desc: "Ask anything about your documents or data.",
    question: "Summarize my last uploaded document",
    color: "from-blue-400 via-cyan-400 to-teal-400",
  },
  {
    title: "Study Notes",
    desc: "Generate concise study notes.",
    question: "Create study notes for chapter 5 optics",
    color: "from-green-400 via-emerald-400 to-lime-400",
  },
  {
    title: "Explain Concept",
    desc: "Break down a complex concept simply.",
    question: "Explain convolutional neural networks simply",
    color: "from-yellow-400 via-orange-400 to-red-500",
  },
  {
    title: "Next Steps",
    desc: "What should I learn next?",
    question: "What should I learn after linear algebra for ML?",
    color: "from-pink-400 via-rose-500 to-red-500",
  },
  {
    title: "Compare Topics",
    desc: "Contrast two related ideas.",
    question: "Compare supervised vs unsupervised learning",
    color: "from-purple-400 via-fuchsia-500 to-blue-500",
  },
  {
    title: "Flashcards",
    desc: "Turn material into Q&A.",
    question: "Create 5 flashcards about the Krebs cycle",
    color: "from-cyan-400 via-sky-400 to-blue-500",
  },
  {
    title: "Code Help",
    desc: "Ask about implementation details.",
    question: "Explain how backpropagation works step-by-step",
    color: "from-indigo-400 via-violet-500 to-purple-500",
  },
  {
    title: "Simplify Text",
    desc: "Rewrite in simpler terms.",
    question: "Simplify the definition of gradient descent",
    color: "from-green-400 via-teal-400 to-blue-500",
  },
];

export default function DashboardPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    files: selectedFiles,
    trigger: triggerFile,
    clearAll: clearFiles,
    removeAt,
    inputProps,
  } = useFileSelection(ACCEPT_FILE_TYPES);

  const { start: startVoice, active: voiceActive } = useSpeechRecognition({
    onResult: (t) => setInput(t),
    onError: (m) => setError(m),
  });

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [messages, loading]);

  const createConversation = async (title: string) => {
    const res = await axios.post("/api/conversation", { title });
    if (!res.data.success)
      throw new Error(res.data.message || "Failed to create conversation");
    return res.data.data;
  };
  const sendFirstMessage = async (conversationId: string, content: string) => {
    if (selectedFiles.length > 0) {
      const fd = new FormData();
      fd.append("conversationId", conversationId);
      fd.append("content", content);
      selectedFiles.forEach((f) => fd.append("files", f));
      return axios
        .post("/api/chat", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => {
          if (!r.data.success)
            throw new Error(r.data.message || "Failed to send message");
          return r.data.data;
        });
    } else {
      const res = await axios.post("/api/chat", { conversationId, content });
      if (!res.data.success)
        throw new Error(res.data.message || "Failed to send message");
      return res.data.data;
    }
  };
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    const ask = input.trim();
    setInput("");
    try {
      const conversation = await createConversation(ask || "New Chat");
      await sendFirstMessage(conversation.id, ask);
      router.push(`/chatbot/c/${conversation.id}`);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e.message ||
        "Failed to start conversation";
      setError(msg);
      setInput(ask);
    } finally {
      setLoading(false);
      clearFiles();
    }
  };
  const handleSuggestion = (q: string) => setInput(q);

  return (
    <section
      className="flex flex-col w-full px-3 pt-4 pb-3 items-center"
      style={{ height: "calc(99vh - var(--navbar-height,64px))" }}
    >
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{scrollbar-width:none;-ms-overflow-style:none}`}</style>
      <div className="w-full max-w-6xl h-full flex flex-col mx-auto pb-[130px]">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center mt-2 mb-4 w-full mx-auto flex-1 overflow-y-auto hide-scrollbar">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-white">Sophia</span>
              <span className="text-indigo-400">Net Assistant</span>
              <span className="ml-2">
                <Bot className="inline w-9 h-9 text-indigo-400 align-middle" />
              </span>
            </h1>
            <p className="text-sm md:text-base text-neutral-400 text-center mb-8 max-w-2xl">
              Ask questions about your learning materials, request summaries,
              generate study notes, or explore concepts.
            </p>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full p-1">
              {SUGGESTIONS.map((s) => (
                <SuggestionCard
                  key={s.question}
                  title={s.title}
                  desc={s.desc}
                  question={s.question}
                  color={s.color}
                  onSelect={handleSuggestion}
                />
              ))}
            </div>
            <div className="text-[11px] text-neutral-500 text-center mt-6">
              Upload a document and ask contextual questions for tailored
              answers.
            </div>
          </div>
        )}

        <div
          ref={chatContainerRef}
          className={`flex-1 w-full mx-auto mb-4 overflow-y-auto hide-scrollbar space-y-6 px-1 ${
            messages.length === 0 ? "hidden" : "block"
          }`}
          style={{ minHeight: 0 }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
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
                  <span className="text-[11px] font-medium text-indigo-200">
                    You
                  </span>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating
              response...
            </div>
          )}
          {error && <div className="text-red-400 text-xs">{error}</div>}
        </div>
      </div>
      <div className="fixed z-10 bottom-0 left-[calc(var(--sidebar-width,60px))] right-0">
        <div className="w-full max-w-3xl mx-auto px-3 pb-3">
          {selectedFiles.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-2 space-y-1 max-h-36 overflow-y-auto">
              {selectedFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="truncate max-w-[80%] text-neutral-300">
                    {f.name}
                  </span>
                  <button
                    onClick={() => removeAt(i)}
                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  onClick={clearFiles}
                  className="text-[10px] text-red-400 hover:underline"
                >
                  Clear all
                </button>
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
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) handleSend();
              }}
              disabled={loading}
            />
            <button
              onClick={startVoice}
              disabled={loading || voiceActive}
              className={`p-2 rounded-md border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 ${
                voiceActive
                  ? "animate-pulse bg-indigo-500/20 border-indigo-400/40 text-indigo-200"
                  : ""
              }`}
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium hover:from-indigo-400 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed shadow border border-indigo-400/40"
              title="Send"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="text-[11px] text-neutral-500 text-center mt-2">
            This assistant can summarize, explain concepts, and turn material
            into study aids.
          </div>
        </div>
      </div>
    </section>
  );
}