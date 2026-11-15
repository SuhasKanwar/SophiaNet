"use client";

import { useEffect, useRef, useState } from 'react';

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
    <section className="mx-auto w-full max-w-5xl px-4 pb-12 pt-24">
      <h1 className="text-2xl font-semibold">Research Paper Studio</h1>
      <p className="mt-2 text-sm text-neutral-400">Find relevant scholarly papers across Crossref and arXiv. Explore the original research and export your reading list.</p>
      <form onSubmit={search} className="mt-6 space-y-4 rounded-2xl border border-indigo-400/20 bg-white/5 p-5">
        <label className="block text-sm">Research topic
          <input value={query} onChange={event => setQuery(event.target.value)} minLength={2} maxLength={500} required disabled={loading} placeholder="For example: retrieval augmented generation" className="mt-2 block w-full rounded-lg border border-white/20 bg-black/30 p-3" />
        </label>
        <label className="block text-sm">Published since (optional)
          <input type="number" min={1900} max={new Date().getFullYear()} value={since} onChange={event => setSince(event.target.value)} disabled={loading} placeholder="2020" className="mt-2 block w-full rounded-lg border border-white/20 bg-black/30 p-3 sm:max-w-48" />
        </label>
        <button disabled={loading || query.trim().length < 2} className="rounded-lg bg-indigo-500 px-5 py-3 text-sm disabled:opacity-40">{loading ? 'Searching…' : 'Find papers'}</button>
        {loading && <p role="status" className="text-sm text-indigo-200">Searching scholarly indexes and merging results…</p>}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      </form>
      {results && <div className="mt-6 space-y-4">
        <h2 className="text-xl font-medium">{results.papers.length} papers for “{results.query}”</h2>
        <p className="text-xs text-neutral-400">Sources searched: {results.sources_searched.join(', ')}. {results.ranking}</p>
        {results.warnings.map(warning => <p role="alert" key={warning} className="rounded-lg border border-amber-400/30 p-3 text-sm text-amber-200">{warning}</p>)}
        {results.papers.length > 0 ? <button onClick={download} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Export reading list</button> : <p role="status">No matching papers found. Try broader terms or an earlier year.</p>}
        {results.papers.map(paper => <article key={paper.url} className="min-w-0 space-y-3 break-words rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-medium">{paper.rank}. <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-indigo-200 underline decoration-indigo-400/40">{paper.title}</a></h3>
          <p className="text-sm text-neutral-300">{paper.authors.length ? paper.authors.join(', ') : 'Authors unavailable'} · {paper.year || 'Year unknown'}</p>
          <p className="text-xs text-neutral-400">{paper.venue || 'Venue unavailable'} · {paper.sources.join(', ')}{paper.doi ? ` · DOI: ${paper.doi}` : ''}</p>
          {paper.abstract ? <details><summary className="cursor-pointer text-sm text-indigo-200">Read abstract</summary><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-300">{paper.abstract}</p></details> : <p className="text-sm text-neutral-500">Abstract not supplied by the source.</p>}
          <div className="flex flex-wrap gap-4 text-sm"><a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-indigo-200 underline">Open paper</a>{paper.pdf_url && <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="text-indigo-200 underline">Open PDF</a>}</div>
        </article>)}
        <p className="text-xs text-neutral-500">Ranked matches are a starting point, not an exhaustive literature review or an assessment of research quality. arXiv entries may be unreviewed preprints. Publisher access restrictions may apply. Export results before leaving this page.</p>
      </div>}
    </section>
  );
}
