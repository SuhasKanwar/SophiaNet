"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Network, Send } from "lucide-react";
import MermaidChart from "@/components/MermaidChart";

const examples = [
  "A flowchart of the water cycle",
  "A sequence diagram of a user signing in",
  "A mind map of renewable energy sources",
];

export default function DiagramsTool() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    } catch (error: unknown) {
      setError(axios.isAxiosError(error)
        ? error.response?.data?.message || "Diagram generation failed. Please try again."
        : error instanceof Error ? error.message : "Diagram generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5 px-4 pb-6 pt-24 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold"><Network className="text-indigo-400" />Diagram studio</h1>
          <p className="mt-2 text-sm text-neutral-400">Turn an idea into a diagram. Edit the code or describe what to change.</p>
        </div>
        {code && <button type="button" disabled={loading} onClick={() => { setCode(""); setPreview(""); setError(null); }} className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50">New diagram</button>}
      </header>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
          {preview ? <MermaidChart code={preview} /> : (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-5 p-6 text-center">
              <Network size={44} className="text-indigo-400" />
              <div><h2 className="text-lg font-medium">Start with an idea</h2><p className="mt-2 max-w-sm text-sm text-neutral-400">Describe a process, relationship, or system. Try one of these examples.</p></div>
              <div className="flex flex-col gap-2">{examples.map(example => <button type="button" key={example} disabled={loading} onClick={() => setInput(example)} className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-400/15">{example}</button>)}</div>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <label htmlFor="diagram-code" className="text-sm font-medium">Mermaid code</label>
          <textarea id="diagram-code" value={code} disabled={loading} maxLength={100000} onChange={event => setCode(event.target.value)} spellCheck={false} placeholder={'flowchart TD\n  A[Start] --> B[Finish]'} className="min-h-64 flex-1 resize-y rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-xs leading-6 text-neutral-200 outline-none focus:border-indigo-400" />
          <button type="button" disabled={!code.trim() || loading} onClick={() => setPreview(code)} className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-500/20 disabled:opacity-40">Update preview</button>
          <p className="text-xs text-neutral-500">Your edits are included when you ask for a refinement.</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="rounded-2xl border border-indigo-400/30 bg-white/[0.03] p-4">
        <label htmlFor="diagram-description" className="mb-2 block text-sm font-medium">{code ? "Describe your changes" : "Describe your diagram"}</label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <textarea id="diagram-description" value={input} onChange={event => setInput(event.target.value)} disabled={loading} maxLength={4000} rows={2} placeholder="For example, show how a library loan works, from finding a book to returning it…" className="min-w-0 flex-1 resize-y rounded-lg border border-white/10 bg-black/30 p-3 text-sm outline-none focus:border-indigo-400" />
          <button type="submit" disabled={loading || !input.trim()} className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40">{loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}{loading ? "Generating…" : code ? "Refine diagram" : "Generate diagram"}</button>
        </div>
        {loading && <p role="status" className="mt-3 text-sm text-indigo-300">Creating your diagram. This may take a moment.</p>}
        {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
      </form>
    </section>
  );
}
