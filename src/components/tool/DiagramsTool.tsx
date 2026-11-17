"use client";

import ToolsHeading from "./ToolsHeading";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Send, RotateCcw } from "lucide-react";
import MermaidChart from "@/components/MermaidChart";

const samples = {
  Flowchart: 'flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Continue]\n    B -->|No| D[Review]\n    D --> B',
  Sequence: 'sequenceDiagram\n    participant User\n    participant Service\n    User->>Service: Send request\n    Service-->>User: Return response',
  Mindmap: 'mindmap\n  root((Project))\n    Research\n    Design\n    Build\n    Review',
};

export default function DiagramsTool() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(samples.Flowchart);
  const [preview, setPreview] = useState(samples.Flowchart);
  const [mobilePanel, setMobilePanel] = useState<"code" | "preview">("preview");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPreview(code), 450);
    return () => clearTimeout(timer);
  }, [code]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("/api/diagram", { prompt: input.trim(), code });
      if (typeof data.response !== "string" || !data.response.trim()) {
        throw new Error("No diagram was returned. Please try again.");
      }
      const nextCode = data.response.trim().replace(/^```(?:mermaid)?\s*\n?/i, "").replace(/\s*```$/, "");
      setCode(nextCode);
      setPreview(nextCode);
      setInput("");
      setMobilePanel("preview");
    } catch (error: unknown) {
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || "Diagram generation failed. Please try again."
        : error instanceof Error ? error.message : "Diagram generation failed.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="flex min-w-0 flex-col px-3 pb-4 pt-36 sm:px-4">
      <ToolsHeading firstPart="Diagrams" secondPart="Tool" />
      <div className="overflow-hidden rounded-xl border border-white/15 bg-[#101118] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3"><span className="text-sm font-semibold">Live editor</span><span className="hidden text-xs text-neutral-500 sm:inline">Mermaid · changes preview automatically</span></div>
          <div className="flex items-center gap-3">
            <a href="https://mermaid.js.org/intro/syntax-reference.html" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-white">Syntax guide ↗</a>
            <button type="button" disabled={loading} onClick={() => { setCode(''); setError(null); }} className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-xs hover:bg-white/5 disabled:opacity-40"><RotateCcw size={13} />Clear</button>
          </div>
        </div>
        <div role="tablist" aria-label="Editor panels" className="flex border-b border-white/10 lg:hidden">
          {(['code', 'preview'] as const).map(panel => <button key={panel} role="tab" aria-selected={mobilePanel === panel} aria-controls={`diagram-${panel}-panel`} id={`diagram-${panel}-tab`} onClick={() => setMobilePanel(panel)} className={`flex-1 border-b-2 px-4 py-3 text-sm capitalize ${mobilePanel === panel ? 'border-indigo-400 text-indigo-200' : 'border-transparent text-neutral-500'}`}>{panel === 'code' ? 'Edit code' : 'Preview'}</button>)}
        </div>
        <div className="grid min-w-0 lg:grid-cols-[minmax(280px,38%)_minmax(0,1fr)]">
          <div id="diagram-code-panel" className={`${mobilePanel === 'code' ? 'flex' : 'hidden'} h-[min(65dvh,640px)] min-h-80 min-w-0 flex-col border-white/10 lg:flex lg:border-r`}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><label htmlFor="diagram-code" className="font-mono text-xs text-neutral-300">Code</label><span className="text-[10px] text-neutral-500">Auto preview</span></div>
            <textarea id="diagram-code" aria-label="Mermaid code" value={code} disabled={loading} maxLength={100000} onChange={event => setCode(event.target.value)} spellCheck={false} placeholder="Write Mermaid code here…" className="min-h-0 flex-1 resize-none bg-[#0c0d12] p-4 font-mono text-sm leading-7 text-indigo-100 outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-400/40" />
            <div className="border-t border-white/10 px-4 py-3"><p className="mb-2 text-[10px] uppercase tracking-widest text-neutral-500">Sample diagrams</p><div className="flex flex-wrap gap-2">{Object.entries(samples).map(([name, sample]) => <button type="button" key={name} disabled={loading} onClick={() => setCode(sample)} className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-white/10 disabled:opacity-40">{name}</button>)}</div></div>
          </div>
          <div id="diagram-preview-panel" className={`${mobilePanel === 'preview' ? 'block' : 'hidden'} h-[min(65dvh,640px)] min-h-80 min-w-0 bg-[#080b12] lg:block`}>
            <MermaidChart code={preview} className="flex h-full flex-col" />
          </div>
        </div>
        <form onSubmit={handleSend} className="border-t border-white/10 bg-white/[0.025] p-4">
          <label htmlFor="diagram-description" className="mb-2 block text-xs font-medium text-neutral-300">Create or refine with AI</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <textarea id="diagram-description" value={input} onChange={event => setInput(event.target.value)} disabled={loading} maxLength={4000} rows={2} placeholder="Describe a diagram, or ask for a change to the current code…" className="min-w-0 flex-1 resize-y rounded-lg border border-white/15 bg-black/20 p-3 text-sm outline-none focus:border-indigo-400" />
            <button type="submit" disabled={loading || !input.trim()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-3 text-sm hover:bg-indigo-400 disabled:opacity-40">{loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}{loading ? 'Generating…' : 'Generate diagram'}</button>
          </div>
          {loading && <p role="status" className="mt-2 text-xs text-indigo-300">Generating a diagram from your description…</p>}
          {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
        </form>
      </div>
    </section>
  );
}
