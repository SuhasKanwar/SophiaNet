"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Code2, Download, Layers, Loader2, RotateCcw, Sparkles, Video } from "lucide-react";
import ToolsHeading from "./ToolsHeading";

interface Quiz {
  title: string;
  questions: { question: string; options: string[]; answer: number; explanation: string }[];
}
interface Deck { title: string; cards: { front: string; back: string }[] }
const modes = [
  { id: "quiz", title: "Practice quiz", detail: "Check your understanding", icon: BookOpen },
  { id: "flashcards", title: "Flashcards", detail: "Build recall, one card at a time", icon: Layers },
  { id: "narration", title: "Narration", detail: "Turn an idea into a script", icon: Video },
  { id: "code", title: "Code script", detail: "Learn through working examples", icon: Code2 },
] as const;
type Mode = typeof modes[number]["id"];

export default function StudioTool() {
  const [mode, setMode] = useState<Mode>("quiz");
  const [prompt, setPrompt] = useState("");
  const [audience, setAudience] = useState("General learner");
  const [difficulty, setDifficulty] = useState("Foundational");
  const [script, setScript] = useState("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultTopic, setResultTopic] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const active = modes.find(item => item.id === mode)!;
  const hasResult = !!(quiz || script || deck);
  const score = quiz?.questions.filter((question, index) => answers[index] === question.answer).length || 0;

  const generate = async (focus = "") => {
    if (loading || !prompt.trim()) return;
    const controller = new AbortController(); request.current = controller;
    setLoading(true); setError("");
    try {
      const brief = `Audience: ${audience}\nDifficulty: ${difficulty}\nTopic or brief:\n${prompt.trim()}${focus ? `\nPractice focus:\n${focus}` : ""}`;
      const response = await fetch("/api/studio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, prompt: brief }), signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Generation failed.");
      if ((mode === "quiz" && !data.quiz?.questions?.length) || (mode === "flashcards" && !data.deck?.cards?.length) || ((mode === "code" || mode === "narration") && !data.response?.trim())) throw new Error("No learning material was returned. Please try again.");
      setScript(data.response || ""); setQuiz(data.quiz || null); setDeck(data.deck || null);
      setAnswers({}); setRevealed(false); setCard(0); setFlipped(false); setResultTopic(prompt.trim());
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Generation failed.");
    } finally { setLoading(false); }
  };

  const download = () => {
    const content = quiz ? `# ${quiz.title}\n\n` + quiz.questions.map((question,index) => `${index+1}. ${question.question}\n${question.options.map((option,i)=>`   ${String.fromCharCode(65+i)}. ${option}`).join("\n")}\n\nAnswer: ${String.fromCharCode(65+question.answer)}. ${question.explanation}`).join("\n\n")
      : deck ? `# ${deck.title}\n\n` + deck.cards.map((item,index) => `## ${index+1}. ${item.front}\n\n${item.back}`).join("\n\n") : script;
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `sophianet-${mode}.md`; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-40 sm:px-6">
      <ToolsHeading firstPart="Learning & Writing" secondPart="Studio" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="max-w-xl text-sm leading-6 text-neutral-400">A topic becomes a practice session. Choose how you want to learn, then let AI prepare the material.</p><span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-3 py-1.5 text-xs text-indigo-200"><Sparkles size={13} />Powered by NVIDIA AI</span></div>
      <div role="group" aria-label="Learning format" className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">{modes.map(item => <button key={item.id} type="button" aria-pressed={mode === item.id} disabled={loading} onClick={() => { setMode(item.id); setQuiz(null); setDeck(null); setScript(""); setError(""); }} className={`rounded-xl border p-4 text-left transition disabled:opacity-50 ${mode === item.id ? "border-indigo-400/60 bg-indigo-500/10" : "border-white/10 bg-white/[0.025] hover:border-white/25"}`}><item.icon size={20} className={mode === item.id ? "text-indigo-300" : "text-neutral-500"} /><span className="mt-3 block text-sm font-medium">{item.title}</span><span className="mt-1 block text-xs leading-5 text-neutral-500">{item.detail}</span></button>)}</div>
      <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <form onSubmit={event => { event.preventDefault(); void generate(); }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-5 flex items-center gap-2 text-sm font-medium"><Sparkles size={16} className="text-indigo-300" />Create your session</div>
          <label htmlFor="studio-brief" className="text-xs font-medium text-neutral-300">Topic or study notes</label>
          <textarea id="studio-brief" value={prompt} onChange={event => setPrompt(event.target.value)} disabled={loading} maxLength={7000} rows={7} placeholder={mode === "quiz" || mode === "flashcards" ? "What do you want to understand? Enter a topic or paste your notes…" : "Describe the subject, goal, length and style…"} className="mt-2 block w-full resize-y rounded-xl border border-white/10 bg-black/25 p-3 text-sm leading-6 outline-none focus:border-indigo-400" />
          <label className="mt-4 block text-xs text-neutral-400">Audience<select value={audience} disabled={loading} onChange={event => setAudience(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#11121a] p-2.5 text-sm text-neutral-200">{["General learner", "Middle school", "University student", "Professional"].map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="mt-4 block text-xs text-neutral-400">Difficulty<select value={difficulty} disabled={loading} onChange={event => setDifficulty(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#11121a] p-2.5 text-sm text-neutral-200">{["Foundational", "Intermediate", "Advanced"].map(value => <option key={value}>{value}</option>)}</select></label>
          <button disabled={loading || !prompt.trim()} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium hover:bg-indigo-400 disabled:opacity-40">{loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}{loading ? "Creating…" : `Generate ${active.title.toLowerCase()}`}</button>
          {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
          <p className="mt-4 text-xs leading-5 text-neutral-500">{mode === "quiz" ? "3 questions with explanations" : mode === "flashcards" ? "5 question-and-answer cards" : "Drafted and reviewed by AI agents"}. Results stay here until you leave. Export to keep a copy.</p>
        </form>
        <div className="min-w-0">
          {loading && <div role="status" className="mb-4 flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4 text-sm text-indigo-200"><Loader2 size={18} className="animate-spin" />{mode === "quiz" || mode === "flashcards" ? "Building your practice material…" : "Writer and editor are preparing your script…"}</div>}
          {!hasResult && !loading && <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center"><div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-4"><active.icon size={30} className="text-indigo-300" /></div><h2 className="mt-5 text-xl font-medium">Your next learning session starts here</h2><p className="mt-3 max-w-md text-sm leading-7 text-neutral-400">{mode === "quiz" ? "Test what you know, uncover gaps, and get an explanation for every answer." : mode === "flashcards" ? "Turn a topic into focused questions. Reveal an answer when you are ready, then move at your own pace." : "Create a script shaped around your audience and goals. AI writes a draft and reviews it for clarity."}</p><div className="mt-6 flex flex-wrap justify-center gap-2">{["The water cycle", "Python basics", "Renewable energy"].map(topic => <button key={topic} onClick={() => setPrompt(topic)} className="rounded-full border border-white/15 px-3 py-2 text-xs text-neutral-300 hover:bg-white/5">{topic}</button>)}</div></div>}
          {hasResult && <div className="surface-enter space-y-4">
            <header className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4"><div className="min-w-0"><p className="text-[10px] uppercase tracking-widest text-indigo-300">{active.title} · AI generated</p><h2 className="mt-2 break-words text-lg font-medium">{quiz?.title || deck?.title || resultTopic}</h2></div><button disabled={loading} onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/5 disabled:opacity-40"><Download size={14} />Download Markdown</button></header>
            {script && <pre className="whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm leading-7">{script}</pre>}
            {deck && <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-white/[0.025] p-5 sm:p-7"><p className="text-center text-xs text-neutral-400">Card {card+1} of {deck.cards.length} · {flipped ? "Answer" : "Question"}</p><button aria-label={flipped ? "Show question" : "Reveal answer"} onClick={() => setFlipped(!flipped)} className="my-5 flex min-h-64 w-full items-center justify-center rounded-xl border border-white/10 bg-black/20 p-6 text-center text-lg leading-8"><span>{flipped ? deck.cards[card].back : deck.cards[card].front}</span></button><div className="flex items-center justify-between gap-3"><button aria-label="Previous card" disabled={card===0} onClick={() => { setCard(card-1); setFlipped(false); }} className="rounded-lg border border-white/15 p-2 disabled:opacity-30"><ChevronLeft size={18} /></button><p className="text-xs text-neutral-500">Click the card to flip</p><button aria-label="Next card" disabled={card===deck.cards.length-1} onClick={() => { setCard(card+1); setFlipped(false); }} className="rounded-lg border border-white/15 p-2 disabled:opacity-30"><ChevronRight size={18} /></button></div></div>}
            {quiz && <>
              <div className="flex items-center justify-between text-xs text-neutral-400"><span>{revealed ? `Score: ${score} / ${quiz.questions.length}` : `${Object.keys(answers).length} of ${quiz.questions.length} answered`}</span><span>{revealed ? "Review your explanations below" : "Choose one answer per question"}</span></div>
              {quiz.questions.map((question,index) => <fieldset key={index} className="rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5"><legend className="max-w-full break-words px-2 text-sm font-medium leading-6">{index+1}. {question.question}</legend><div className="mt-2 space-y-2">{question.options.map((option,choice) => <label key={choice} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-6 ${revealed && choice===question.answer ? "border-emerald-400/40 bg-emerald-400/5" : answers[index]===choice ? "border-indigo-400/40 bg-indigo-400/10" : "border-white/5 hover:bg-white/5"}`}><input type="radio" name={`question-${index}`} checked={answers[index]===choice} disabled={revealed || loading} onChange={() => setAnswers(current => ({...current,[index]:choice}))} className="mt-1.5 accent-indigo-400" /><span className="min-w-0 break-words">{option}</span></label>)}</div>{revealed && <div className="mt-4 border-t border-white/10 pt-3 text-sm leading-6"><p className={answers[index]===question.answer ? "text-emerald-300" : "text-amber-300"}>{answers[index]===question.answer ? "Correct" : "Review this answer"}</p><p className="mt-1 text-neutral-400">{question.explanation}</p></div>}</fieldset>)}
              {!revealed ? <button disabled={loading || Object.keys(answers).length!==quiz.questions.length} onClick={() => setRevealed(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm disabled:opacity-40"><Check size={16} />Check answers</button> : <div className="flex flex-wrap gap-3"><button disabled={loading} onClick={() => { setAnswers({}); setRevealed(false); }} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm"><RotateCcw size={14} />Try again</button><button disabled={loading} onClick={() => void generate(quiz.questions.filter((q,i) => answers[i]!==q.answer).map(q => q.question).join("\n").slice(0,2000) || "Create a new set of questions on this topic.")} className="inline-flex items-center gap-2 rounded-lg border border-indigo-400/30 px-4 py-2.5 text-sm text-indigo-200"><Sparkles size={14} />Generate follow-up practice</button></div>}
            </>}
            <p className="text-xs leading-6 text-neutral-500">AI-generated material can contain mistakes. Check important facts before sharing. Scores reflect this practice session, not a proficiency assessment.</p>
          </div>}
        </div>
      </div>
    </section>
  );
}
