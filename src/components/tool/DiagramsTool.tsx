"use client";

import { useState } from "react";
import axios from "axios";
import ToolsHeading from "./ToolsHeading";
import MermaidChart from "@/components/MermaidChart";
import ChatInputComponent from "@/components/chat/ChatInputComponent";
import DottedPattern from "@/components/ui/dotted-pattern";

export default function DiagramsTool() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const prompt = input.trim();
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("/api/diagram", { prompt, code });
      if (typeof data.response !== "string" || !data.response.trim()) {
        throw new Error("No diagram was returned. Please try again.");
      }
      setCode(data.response.trim().replace(/^```(?:mermaid)?\s*\n?/i, "").replace(/\s*```$/, ""));
    } catch (error: unknown) {
      setInput(prompt);
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || "Diagram generation failed. Please try again."
        : error instanceof Error ? error.message : "Diagram generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-dvh min-w-0 flex-col px-3 pb-32 pt-36 sm:px-4">
      <DottedPattern className="pointer-events-none fixed inset-0 z-0" />
      <ToolsHeading firstPart="Diagrams" secondPart="Tool" />
      <div className="relative z-[1] min-w-0 flex-1">
        <MermaidChart code={code} className="flex h-[calc(100dvh-280px)] min-h-72 flex-col" showGrid={false} />
        {code && <button type="button" disabled={loading} onClick={() => { setCode(''); setError(null); }} className="mt-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/5 disabled:opacity-40">New diagram</button>}
        {loading && <p role="status" className="mt-3 text-center text-sm text-indigo-300">Creating your diagram…</p>}
        {error && <p role="alert" className="mt-3 text-center text-sm text-red-300">{error}</p>}
      </div>
      <ChatInputComponent input={input} setInput={setInput} onSend={handleSend} loading={loading}
        showFileUpload={false} showVoiceInput={false} onError={setError}
        placeholder={code ? "Describe a change to your diagram…" : "Describe the diagram you want to create…"}
        bottomText="Describe an idea to create a diagram, then ask for changes." />
    </section>
  );
}
