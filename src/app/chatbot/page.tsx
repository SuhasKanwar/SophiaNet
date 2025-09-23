"use client";

import { useState } from "react";
import SuggestionCard from "@/components/SuggestionCard";
import { useRouter } from "next/navigation";
import axios from "axios";
import ChatInputComponent from "@/components/chat/ChatInputComponent";
import { SUGGESTIONS } from "@/data/suggestion";

export default function DashboardPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

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
      setSelectedFiles([]);
    }
  };

  const handleSuggestion = (q: string) => setInput(q);

  return (
    <section className="flex flex-col w-full px-3 pt-4 pb-3 items-center min-h-screen overflow-hidden">
      <div className="w-full max-w-6xl h-full flex flex-col mx-auto pb-[130px]">
        <div className="flex flex-col items-center justify-center mt-2 mb-4 w-full mx-auto flex-1 overflow-y-auto hide-scrollbar min-h-[calc(100vh-200px)]">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-white">Sophia</span>
            <span className="text-indigo-400">Net Assistant</span>
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
            Upload a document and ask contextual questions for tailored answers.
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-xs mb-4 text-center">{error}</div>
        )}
      </div>

      <ChatInputComponent
        input={input}
        setInput={setInput}
        onSend={handleSend}
        loading={loading}
        placeholder="Ask anything..."
        onError={setError}
        onFilesChange={setSelectedFiles}
        bottomText="This assistant can summarize, explain concepts, and turn material into study aids."
      />
    </section>
  );
}
