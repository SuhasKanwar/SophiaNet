"use client";

import ToolsHeading from "./ToolsHeading";

import { useEffect, useRef, useState } from 'react';
import { Search, Download, ArrowUpRight, FileText, Library, Loader2 } from 'lucide-react';

interface Paper {
  title: string; authors: string[]; year: number | null; abstract: string;
  doi: string | null; url: string; pdf_url: string | null; venue: string; sources: string[]; rank: number;
}
interface Results { query: string; papers: Paper[]; warnings: string[]; sources_searched: string[]; ranking: string }

export default function ResearchStudio() {
  const [query, setQuery] = useState('');
  const [since, setSince] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || query.trim().length < 2) return;
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setError(''); setResults(null);
    try {
      const response = await fetch('/api/papers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, since: since ? Number(since) : null }), signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Search failed.');
      setResults(data);
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Search failed.');
    } finally { setLoading(false); }
  };

  const download = () => {
    if (!results) return;
    const markdown = `# Papers: ${results.query}\n\n${results.ranking}\n\n` + results.warnings.join('\n') + '\n\n' + results.papers.map(paper => `## ${paper.rank}. ${paper.title}\n\n${paper.authors.join(', ')} (${paper.year || 'Year unknown'})\n\n${paper.venue}\n\nSource: ${paper.sources.join(', ')}\nPaper: ${paper.url}\n${paper.pdf_url ? `PDF: ${paper.pdf_url}\n` : ''}\n${paper.abstract || 'Abstract unavailable.'}`).join('\n\n');
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'sophianet-research-papers.md'; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 sm:px-6">
      <ToolsHeading firstPart="Research Paper" secondPart="Studio" />
      <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">A clearer starting point for your next discovery. Search scholarly literature, explore the evidence, and build a reading list.</p>
      <form onSubmit={search} className="mt-7 rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-indigo-500/10 to-white/[0.02] p-4 sm:p-6">
        <label htmlFor="research-topic" className="mb-2 block text-sm font-medium">What are you researching?</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search size={19} aria-hidden="true" className="absolute left-4 top-4 text-neutral-500" />
            <input id="research-topic" value={query} onChange={event => setQuery(event.target.value)} minLength={2} maxLength={500} required disabled={loading} placeholder="Search a topic, question, or paper title…" className="w-full rounded-xl border border-white/15 bg-black/40 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/15" />
          </div>
          <button disabled={loading || query.trim().length < 2} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium transition hover:bg-indigo-400 disabled:opacity-40">{loading ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />}{loading ? 'Searching…' : 'Find papers'}</button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-3 text-xs text-neutral-400">Published since
            <input aria-label="Published since (optional)" type="number" min={1900} max={new Date().getFullYear()} value={since} onChange={event => setSince(event.target.value)} disabled={loading} placeholder="Any year" className="w-28 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-neutral-200 outline-none focus:border-indigo-400" />
          </label>
          <p className="flex flex-wrap gap-2 text-xs text-neutral-400"><span className="rounded-full border border-white/10 px-2.5 py-1">Crossref</span><span className="rounded-full border border-white/10 px-2.5 py-1">arXiv</span><span className="py-1">Ranked by relevance</span></p>
        </div>
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">{error}</p>}
      </form>

      {loading && <div role="status" className="mt-8 space-y-4"><p className="text-sm text-indigo-200">Searching scholarly indexes and merging results…</p>{[0,1,2].map(index => <div key={index} aria-hidden="true" className="h-36 animate-pulse rounded-xl border border-white/10 bg-white/5" />)}</div>}

      {!loading && !results && <div className="mt-8 rounded-2xl border border-dashed border-white/15 px-5 py-12 text-center">
        <Library size={32} aria-hidden="true" className="mx-auto text-indigo-400" />
        <h2 className="mt-4 text-lg font-medium">Follow your next question</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-400">Start broad, then narrow by publication year. We bring the source details and original paper links together.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">{['Retrieval augmented generation','CRISPR gene editing','Renewable energy storage'].map(topic => <button type="button" key={topic} onClick={() => setQuery(topic)} className="rounded-full border border-white/15 px-3 py-2 text-xs text-neutral-300 transition hover:border-indigo-400/60 hover:bg-indigo-400/10">{topic}</button>)}</div>
      </div>}

      {results && !loading && <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div><p className="text-xs font-medium uppercase tracking-widest text-indigo-300">Search results</p><h2 className="mt-2 text-lg font-medium">{results.papers.length} papers <span className="font-normal text-neutral-400">for “{results.query}”</span></h2></div>
          {results.papers.length > 0 && <button onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm transition hover:bg-white/5"><Download size={16} />Export reading list</button>}
        </div>
        <p className="my-4 text-xs leading-5 text-neutral-500">Sources searched: {results.sources_searched.join(', ')}. {results.ranking}</p>
        {results.warnings.map(warning => <p role="alert" key={warning} className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 text-sm text-amber-200">{warning}</p>)}
        {!results.papers.length && <div role="status" className="rounded-xl border border-white/10 p-10 text-center text-sm text-neutral-400">No matching papers found. Try broader terms or an earlier year.</div>}
        <div className="space-y-4">{results.papers.map(paper => <article key={paper.url} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-indigo-400/30 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-400/10 font-mono text-xs text-indigo-300">{String(paper.rank).padStart(2,'0')}</span>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400"><span>{paper.year || 'Year unknown'}</span><span aria-hidden="true">·</span>{paper.sources.map(source => <span key={source} className="rounded-full border border-white/10 px-2 py-0.5">{source}</span>)}{paper.pdf_url && <span className="text-emerald-300">PDF available</span>}</div>
              <h3 className="break-words text-base font-semibold leading-7 sm:text-lg"><a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-neutral-100 hover:text-indigo-300">{paper.title}</a></h3>
              <p className="mt-2 break-words text-sm leading-6 text-neutral-400">{paper.authors.length ? paper.authors.join(', ') : 'Authors unavailable'}</p>
              <p className="mt-1 break-words text-xs leading-5 text-neutral-500">{paper.venue || 'Venue unavailable'}</p>
              {paper.abstract ? <details className="group mt-4 rounded-lg border border-white/5 bg-black/15 p-3"><summary className="cursor-pointer text-xs font-medium text-indigo-200">Read abstract</summary><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-300">{paper.abstract}</p></details> : <p className="mt-4 text-xs text-neutral-500">Abstract not supplied by the source.</p>}
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/5 pt-4 text-xs"><a href={paper.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-indigo-200 hover:text-white">Open paper<ArrowUpRight size={14} /></a>{paper.pdf_url && <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-indigo-200 hover:text-white"><FileText size={14} />Open PDF</a>}{paper.doi && <span className="min-w-0 break-all text-neutral-500 sm:ml-auto">DOI: {paper.doi}</span>}</div>
            </div>
          </div>
        </article>)}</div>
        <p className="mt-6 text-xs leading-6 text-neutral-500">Ranked matches are a starting point, not an exhaustive literature review or an assessment of research quality. arXiv entries may be unreviewed preprints. Publisher access restrictions may apply. Export results before leaving this page.</p>
      </div>}
    </section>
  );
}
