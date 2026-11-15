"use client";

import { useEffect, useRef, useState } from "react";

interface Quiz {
  title: string;
  questions: { question: string; options: string[]; answer: number; explanation: string }[];
}

export default function StudioTool() {
  const [mode, setMode] = useState('quiz');
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  const generate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || !prompt.trim()) return;
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/studio', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({mode,prompt}), signal:controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Generation failed.');
      setScript(data.response || ''); setQuiz(data.quiz || null); setAnswers({}); setRevealed(false);
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Generation failed.');
    } finally { setLoading(false); }
  };

  const download = () => {
    const content = quiz ? `# ${quiz.title}\n\n` + quiz.questions.map((question,index) => `${index+1}. ${question.question}\n${question.options.map((option,i)=>`   ${String.fromCharCode(65+i)}. ${option}`).join('\n')}\n\nAnswer: ${String.fromCharCode(65+question.answer)}. ${question.explanation}`).join('\n\n') : script;
    const url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=`sophianet-${mode}.md`;link.click();URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-12 pt-24">
      <h1 className="text-2xl font-semibold">Learning & writing studio</h1>
      <p className="mt-2 text-sm text-neutral-400">Practice a topic or turn an idea into a reviewed script.</p>
      <form onSubmit={generate} className="mt-6 space-y-4 rounded-2xl border border-indigo-400/20 bg-white/5 p-5">
        <label className="block text-sm">Create
          <select aria-label="Studio mode" value={mode} disabled={loading} onChange={event=>{setMode(event.target.value);setQuiz(null);setScript('');setError('');}} className="mt-2 block w-full rounded-lg border border-white/20 bg-slate-950 p-3">
            <option value="quiz">Practice quiz</option><option value="narration">Narration script</option><option value="code">Code script</option>
          </select>
        </label>
        <label className="block text-sm">{mode==='quiz'?'Topic or study notes':'Script brief'}
          <textarea aria-label="Topic or brief" value={prompt} onChange={event=>setPrompt(event.target.value)} disabled={loading} maxLength={10000} rows={5} placeholder={mode==='quiz'?'For example: photosynthesis for a middle school student':'Describe the audience, subject, length and style…'} className="mt-2 block w-full rounded-lg border border-white/20 bg-black/30 p-3" />
        </label>
        <button disabled={loading || !prompt.trim()} className="rounded-lg bg-indigo-500 px-5 py-3 text-sm disabled:opacity-40">{loading?'Creating…':'Generate'}</button>
        {loading && <p role="status" className="text-sm text-indigo-200">{mode==='quiz'?'Preparing three practice questions…':'Writer and editor are preparing your script…'}</p>}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      </form>
      {(quiz || script) && <div className="mt-6 space-y-4">
        <button onClick={download} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Download Markdown{quiz?' with answer key':''}</button>
        {script && <pre className="whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7">{script}</pre>}
        {quiz && <>
          <h2 className="text-xl font-medium">{quiz.title}</h2>
          {quiz.questions.map((question,index)=><fieldset key={index} className="space-y-3 rounded-xl border border-white/10 p-5">
            <legend className="px-2 text-sm font-medium">{index+1}. {question.question}</legend>
            {question.options.map((option,choice)=><label key={choice} className="flex items-start gap-3 rounded-lg bg-white/5 p-3 text-sm"><input type="radio" name={`question-${index}`} checked={answers[index]===choice} disabled={revealed} onChange={()=>setAnswers(current=>({...current,[index]:choice}))} className="mt-1" />{option}</label>)}
            {revealed && <p className="text-sm text-indigo-200">{answers[index]===question.answer?'Correct.':'Review this answer.'} {question.options[question.answer]} — {question.explanation}</p>}
          </fieldset>)}
          {!revealed?<button disabled={Object.keys(answers).length!==quiz.questions.length} onClick={()=>setRevealed(true)} className="rounded-lg bg-indigo-500 px-5 py-3 disabled:opacity-40">Check answers</button>:<div role="status" className="flex flex-wrap items-center gap-4"><p>Score: {quiz.questions.filter((q,i)=>answers[i]===q.answer).length} / {quiz.questions.length}</p><button onClick={()=>{setAnswers({});setRevealed(false);}} className="rounded-lg border border-white/20 px-4 py-2">Try again</button></div>}
        </>}
        <p className="text-xs text-neutral-500">AI-generated practice material may contain mistakes. Review before sharing. Studio results remain in this page until you leave or generate another result.</p>
      </div>}
    </section>
  );
}
