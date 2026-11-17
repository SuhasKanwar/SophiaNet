"use client";

import { useState } from "react";
import axios from "axios";
import MermaidChart from "@/components/MermaidChart";
import ChatInputComponent from "@/components/chat/ChatInputComponent";
import DottedPattern from "@/components/ui/dotted-pattern";

export default function DiagramsTool() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [svg, setSvg] = useState<string | null>(null);
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

  const exportDiagram = () => {
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "sophianet-diagram.svg"; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="flex min-h-dvh min-w-0 flex-col px-3 pb-32 pt-36 sm:px-4">
      <DottedPattern className="pointer-events-none fixed bottom-0 right-0 top-[var(--nav-height,64px)] left-[var(--sidebar-width,60px)] z-0 transition-[left] duration-300" />
      <header className="absolute left-[calc(var(--sidebar-width,60px)+1rem)] right-4 top-24 z-10 flex items-center justify-between gap-3 transition-[left] duration-300">
        <h1 className="text-2xl font-bold text-white">Diagrams <span className="text-indigo-400">Tool</span></h1>
        <button type="button" onClick={exportDiagram} disabled={!svg || loading} className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs text-neutral-300 hover:bg-white/5 disabled:opacity-30">Export SVG</button>
      </header>
      <div className="relative z-[1] min-w-0 flex-1">
        <MermaidChart code={code} className="flex h-[calc(100dvh-280px)] min-h-72 flex-col" onRender={setSvg} />
        {loading && <p role="status" className="mt-3 text-center text-sm text-indigo-300">Creating your diagram…</p>}
        {error && <p role="alert" className="mt-3 text-center text-sm text-red-300">{error}</p>}
      </div>
      <ChatInputComponent input={input} setInput={setInput} onSend={handleSend} loading={loading}
        showFileUpload={false} showVoiceInput={false} onError={setError}
        placeholder={code ? "Describe a change to your diagram…" : "Describe the diagram you want to create…"} />
    </section>
  );
}
