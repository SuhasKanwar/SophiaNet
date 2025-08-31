"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Send, UploadCloud, Bot, X } from "lucide-react";

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
  },
  {
    title: "Study Notes",
    desc: "Generate concise study notes.",
    question: "Create study notes for chapter 5 optics",
  },
  {
    title: "Explain Concept",
    desc: "Break down a complex concept simply.",
    question: "Explain convolutional neural networks simply",
  },
  {
    title: "Next Steps",
    desc: "What should I learn next?",
    question: "What should I learn after linear algebra for ML?",
  },
];

export default function DashboardPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const simulateBot = async (userText: string) => {
    await new Promise(r => setTimeout(r, 900));
    return `You said: "${userText}". (Simulated AI response${selectedFile ? ` with file ${selectedFile.name}` : ""})`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    const userMsg: ChatMessage = { id: Date.now(), sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const ask = input;
    setInput("");
    try {
      const reply = await simulateBot(ask);
      const botMsg: ChatMessage = { id: Date.now() + 1, sender: "bot", text: reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setError("Failed to get a response.");
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
  };

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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

  return (
    <section className="min-h-screen w-full px-3 pt-6 pb-14 flex flex-col items-center">
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{scrollbar-width:none;-ms-overflow-style:none}`}</style>
      <div className="w-full max-w-6xl flex-1 flex flex-col mx-auto">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center mt-4 mb-8 w-full mx-auto" style={{ minHeight: "calc(70vh - 100px)" }}>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-white">Sophia</span>
              <span className="text-indigo-400">Net Assistant</span>
              <span className="ml-2"><Bot className="inline w-9 h-9 text-indigo-400 align-middle" /></span>
            </h1>
            <p className="text-sm md:text-base text-neutral-400 text-center mb-8 max-w-2xl">
              Ask questions about your learning materials, request summaries, generate study notes, or explore concepts.
            </p>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
              {SUGGESTIONS.map(s => (
                <button
                  key={s.question}
                  onClick={() => handleSuggestion(s.question)}
                  className="group relative rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-4 text-left transition flex flex-col gap-2"
                >
                  <span className="font-medium text-sm text-white/90">{s.title}</span>
                  <span className="text-[11px] leading-snug text-neutral-400 line-clamp-3">{s.desc}</span>
                  <span className="text-[10px] text-indigo-300/70 mt-auto opacity-0 group-hover:opacity-100 transition">Click to use</span>
                </button>
              ))}
            </div>
            <div className="text-[11px] text-neutral-500 text-center mt-6">
              Upload a document and ask contextual questions for tailored answers.
            </div>
          </div>
        )}

        <div
          ref={chatContainerRef}
          className={`flex-1 w-full mx-auto mb-4 overflow-y-auto transition-all hide-scrollbar space-y-6 px-1 ${messages.length === 0 ? "hidden" : "block"}`}
          style={{ minHeight: 300, maxHeight: 650 }}
        >
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
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
      </div>

      <div className="w-full max-w-3xl mx-auto mb-4">
        {selectedFile && (
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-2 text-xs">
            <span className="truncate max-w-[80%] text-neutral-300">{selectedFile.name}</span>
            <button onClick={removeFile} className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
              <span className="sr-only">Remove file</span>
            </button>
          </div>
        )}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center px-4 py-3 gap-2 shadow-lg">
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
            placeholder="Ask anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !loading) handleSend(); }}
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
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium hover:from-indigo-400 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed shadow border border-indigo-400/40"
            title="Send"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-[11px] text-neutral-500 text-center mt-2">
          This assistant can summarize, explain concepts, and turn material into study aids.
        </div>
      </div>
    </section>
  );
}