"use client";

import { useToolState } from "@/providers/ToolSessionProvider";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  Code2,
  Download,
  Layers,
  Loader2,
  RotateCcw,
  Sparkles,
  Video,
} from "lucide-react";
import ToolsHeading from "./ToolsHeading";
import StudyCarousel from "./StudyCarousel";
import { renderMarkdownWithCodeBlocks } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

interface Quiz {
  title: string;
  questions: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}
interface Deck {
  title: string;
  cards: { front: string; back: string }[];
}
const modes = [
  {
    id: "quiz",
    title: "Practice quiz",
    detail: "Check your understanding",
    icon: BookOpen,
  },
  {
    id: "flashcards",
    title: "Flashcards",
    detail: "Build recall, one card at a time",
    icon: Layers,
  },
  {
    id: "narration",
    title: "Narration",
    detail: "Turn an idea into a script",
    icon: Video,
  },
  {
    id: "code",
    title: "Code script",
    detail: "Learn through working examples",
    icon: Code2,
  },
] as const;
type Mode = (typeof modes)[number]["id"];

export default function StudioTool() {
  const [mode, setMode] = useToolState<Mode>("studio", "mode", "quiz");
  const [prompt, setPrompt] = useToolState("studio", `${mode}.prompt`, "");
  const [audience, setAudience] = useToolState("studio", "audience", "General learner");
  const [difficulty, setDifficulty] = useToolState("studio", "difficulty", "Foundational");
  const [script, setScript] = useToolState("studio", `${mode}.script`, "");
  const [quiz, setQuiz] = useToolState<Quiz | null>("studio", `${mode}.quiz`, null);
  const [deck, setDeck] = useToolState<Deck | null>("studio", `${mode}.deck`, null);
  const reducedMotion = useReducedMotion();
  const [questionIndex, setQuestionIndex] = useToolState("studio", `${mode}.questionIndex`, 0);
  const [card, setCard] = useToolState("studio", `${mode}.card`, 0);
  const [flipped, setFlipped] = useToolState("studio", `${mode}.flipped`, false);
  const [answers, setAnswers] = useToolState<Record<number, number>>("studio", `${mode}.answers`, {});
  const [revealed, setRevealed] = useToolState("studio", `${mode}.revealed`, false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultTopic, setResultTopic] = useToolState("studio", `${mode}.resultTopic`, "");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const active = modes.find((item) => item.id === mode)!;
  const hasResult = !!(quiz || script || deck);
  const score =
    quiz?.questions.filter(
      (question, index) => answers[index] === question.answer,
    ).length || 0;

  const generate = async (focus = "") => {
    if (loading || !prompt.trim()) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError("");
    try {
      const brief = `Audience: ${audience}\nDifficulty: ${difficulty}\nTopic or brief:\n${focus ? resultTopic : prompt.trim()}${focus ? `\nPractice focus:\n${focus}` : ""}`;
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, prompt: brief }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Generation failed.");
      if (
        (mode === "quiz" && !data.quiz?.questions?.length) ||
        (mode === "flashcards" && !data.deck?.cards?.length) ||
        ((mode === "code" || mode === "narration") && !data.response?.trim())
      )
        throw new Error("No learning material was returned. Please try again.");
      setScript(data.response || "");
      setQuiz(data.quiz || null);
      setDeck(data.deck || null);
      setQuestionIndex(0);
      setAnswers({});
      setRevealed(false);
      setCard(0);
      setFlipped(false);
      setResultTopic(prompt.trim());
    } catch (error) {
      if (!controller.signal.aborted)
        setError(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const content = quiz
      ? `# ${quiz.title}\n\n` +
        quiz.questions
          .map(
            (question, index) =>
              `${index + 1}. ${question.question}\n${question.options.map((option, i) => `   ${String.fromCharCode(65 + i)}. ${option}`).join("\n")}\n\nAnswer: ${String.fromCharCode(65 + question.answer)}. ${question.explanation}`,
          )
          .join("\n\n")
      : deck
        ? `# ${deck.title}\n\n` +
          deck.cards
            .map(
              (item, index) => `## ${index + 1}. ${item.front}\n\n${item.back}`,
            )
            .join("\n\n")
        : script;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/markdown;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `sophianet-${mode}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex h-dvh min-h-0 w-full min-w-0 flex-col overflow-hidden px-4 pb-4 pt-40 sm:px-6">
      <ToolsHeading firstPart="Learning & Writing" secondPart="Studio" />
      <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm leading-6 text-neutral-400">
          A topic becomes a practice session. Choose how you want to learn, then
          let AI prepare the material.
        </p>
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-3 py-1.5 text-xs text-indigo-200">
          <Sparkles size={13} />
          Powered by NVIDIA AI
        </span>
      </div>
      <div
        role="group"
        aria-label="Learning format"
        className="mb-4 grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4"
      >
        {modes.map((item) => (
          <motion.button
            whileHover={reducedMotion ? undefined : { y: -2 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            key={item.id}
            type="button"
            aria-pressed={mode === item.id}
            disabled={loading}
            onClick={() => {
              setMode(item.id);
              setError("");
            }}
            className={`rounded-xl border p-4 text-left transition disabled:opacity-50 ${mode === item.id ? "border-indigo-400/60 bg-indigo-500/10" : "border-white/10 bg-white/[0.025] hover:border-white/25"}`}
          >
            <item.icon
              size={20}
              className={
                mode === item.id ? "text-indigo-300" : "text-neutral-500"
              }
            />
            <span className="mt-3 block text-sm font-medium">{item.title}</span>
            <span className="mt-1 block text-xs leading-5 text-neutral-500">
              {item.detail}
            </span>
          </motion.button>
        ))}
      </div>
      <div className="grid min-h-0 min-w-0 flex-1 items-start gap-5 overflow-y-auto overscroll-contain lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:overflow-hidden">
        <motion.form
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          onSubmit={(event) => {
            event.preventDefault();
            void generate();
          }}
          className="min-w-0 rounded-2xl border border-indigo-400/15 bg-gradient-to-b from-indigo-500/[0.07] to-white/[0.02] p-5 lg:max-h-full lg:overflow-y-auto"
        >
          <div className="mb-5 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-2.5">
                <Sparkles size={18} className="text-indigo-300" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">Create your session</h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Make it work for the way you learn.
                </p>
              </div>
            </div>
          </div>
          <label
            htmlFor="studio-brief"
            className="text-xs font-medium text-neutral-300"
          >
            Topic or study notes
          </label>
          <textarea
            id="studio-brief"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            disabled={loading}
            maxLength={7000}
            rows={5}
            placeholder={
              mode === "quiz" || mode === "flashcards"
                ? "What do you want to understand? Enter a topic or paste your notes…"
                : "Describe the subject, goal, length and style…"
            }
            className="mt-2 block w-full resize-y rounded-xl border border-white/10 bg-black/25 p-3 text-sm leading-6 outline-none focus:border-indigo-400"
          />
          <div className="mt-2 text-right text-[10px] text-neutral-500">
            {prompt.length.toLocaleString()} / 7,000 characters
          </div>
          <label className="mt-4 block text-xs text-neutral-400">
            Audience
            <select
              value={audience}
              disabled={loading}
              onChange={(event) => setAudience(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#11121a] p-2.5 text-sm text-neutral-200"
            >
              {[
                "General learner",
                "Middle school",
                "University student",
                "Professional",
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <fieldset className="mt-4 min-w-0">
            <legend className="text-xs text-neutral-400">Difficulty</legend>
            <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-black/20 p-1">
              {["Foundational", "Intermediate", "Advanced"].map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={difficulty === value}
                  disabled={loading}
                  onClick={() => setDifficulty(value)}
                  className={`min-w-0 rounded-lg px-1 py-2.5 text-[10px] transition ${difficulty === value ? "bg-indigo-400/15 text-indigo-200 shadow-sm" : "text-neutral-500 hover:bg-white/5"}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            disabled={loading || !prompt.trim()}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-medium shadow-lg shadow-indigo-950/30 hover:from-indigo-400 hover:to-violet-400 disabled:opacity-40"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {loading ? "Creating…" : `Generate ${active.title.toLowerCase()}`}
          </button>
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-300">
              {error}
            </p>
          )}
          <p className="mt-4 text-xs leading-5 text-neutral-500">
            {mode === "quiz"
              ? "3 questions with explanations"
              : mode === "flashcards"
                ? "5 question-and-answer cards"
                : "Drafted and reviewed by AI agents"}
            . Results stay here until you leave. Export to keep a copy.
          </p>
        </motion.form>
        <div className="min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
          {loading && (
            <div
              role="status"
              className="mb-4 flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4 text-sm text-indigo-200"
            >
              <Loader2 size={18} className="animate-spin" />
              {mode === "quiz" || mode === "flashcards"
                ? "Building your practice material…"
                : "Writer and editor are preparing your script…"}
            </div>
          )}
          {!hasResult && !loading && (
            <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center">
              <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-4">
                <active.icon size={30} className="text-indigo-300" />
              </div>
              <h2 className="mt-5 text-xl font-medium">
                Your next learning session starts here
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-neutral-400">
                {mode === "quiz"
                  ? "Test what you know, uncover gaps, and get an explanation for every answer."
                  : mode === "flashcards"
                    ? "Turn a topic into focused questions. Reveal an answer when you are ready, then move at your own pace."
                    : "Create a script shaped around your audience and goals. AI writes a draft and reviews it for clarity."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["The water cycle", "Python basics", "Renewable energy"].map(
                  (topic) => (
                    <button
                      key={topic}
                      onClick={() => setPrompt(topic)}
                      className="rounded-full border border-white/15 px-3 py-2 text-xs text-neutral-300 hover:bg-white/5"
                    >
                      {topic}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
          {hasResult && (
            <motion.div
              initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.25 }}
              className="space-y-4"
            >
              <header className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                <div className="min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-1">
                  <p className="text-[10px] uppercase tracking-widest text-indigo-300">
                    {active.title} · AI generated
                  </p>
                  <h2 className="mt-2 break-words text-lg font-medium">
                    {quiz?.title || deck?.title || resultTopic}
                  </h2>
                </div>
                <button
                  disabled={loading}
                  onClick={download}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/5 disabled:opacity-40"
                >
                  <Download size={14} />
                  Download Markdown
                </button>
              </header>
              {script && (
                <div className="studio-markdown min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm leading-7">
                  {renderMarkdownWithCodeBlocks(script)}
                </div>
              )}
              {deck && (
                <StudyCarousel
                  label="Card"
                  index={card}
                  count={deck.cards.length}
                  disabled={loading}
                  onChange={(index) => {
                    setCard(index);
                    setFlipped(false);
                  }}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl border p-5 sm:p-7 ${flipped ? "border-emerald-400/25 bg-gradient-to-br from-emerald-500/10 to-white/[0.02]" : "border-indigo-400/25 bg-gradient-to-br from-indigo-500/15 to-white/[0.02]"}`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-widest">
                      <span
                        className={
                          flipped ? "text-emerald-300" : "text-indigo-300"
                        }
                      >
                        {flipped ? "Answer" : "Recall challenge"}
                      </span>
                      <Layers size={16} className="text-neutral-500" />
                    </div>
                    <motion.button
                      key={flipped ? "back" : "front"}
                      type="button"
                      aria-label={flipped ? "Show question" : "Reveal answer"}
                      aria-pressed={flipped}
                      onClick={() => setFlipped(!flipped)}
                      initial={{
                        opacity: reducedMotion ? 1 : 0,
                        rotateX: reducedMotion ? 0 : 12,
                      }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.22 }}
                      className="my-4 flex min-h-64 w-full min-w-0 items-center justify-center rounded-xl px-2 py-6 text-center text-xl leading-9 [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-indigo-400"
                    >
                      <span>
                        {flipped
                          ? deck.cards[card].back
                          : deck.cards[card].front}
                      </span>
                    </motion.button>
                    <p className="border-t border-white/10 pt-4 text-center text-xs text-neutral-500">
                      {flipped
                        ? "Take a moment to connect the answer to the question."
                        : "Think of your answer, then click the card to reveal."}
                    </p>
                  </div>
                </StudyCarousel>
              )}
              {quiz && (
                <>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>
                      {revealed
                        ? `Score: ${score} / ${quiz.questions.length}`
                        : `${Object.keys(answers).length} of ${quiz.questions.length} answered`}
                    </span>
                    <span>
                      {revealed
                        ? "Review each question’s explanation"
                        : "Choose one answer per question"}
                    </span>
                  </div>
                  <StudyCarousel
                    label="Question"
                    index={questionIndex}
                    count={quiz.questions.length}
                    disabled={loading}
                    onChange={setQuestionIndex}
                  >
                    {quiz.questions.map(
                      (question, index) =>
                        index === questionIndex && (
                          <fieldset
                            key={index}
                            className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5"
                          >
                            <legend className="max-w-full [overflow-wrap:anywhere] px-2 text-sm font-medium leading-6">
                              {index + 1}. {question.question}
                            </legend>
                            <div className="mt-2 space-y-2">
                              {question.options.map((option, choice) => (
                                <label
                                  key={choice}
                                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-6 ${revealed && choice === question.answer ? "border-emerald-400/40 bg-emerald-400/5" : answers[index] === choice ? "border-indigo-400/40 bg-indigo-400/10" : "border-white/5 hover:bg-white/5"}`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${index}`}
                                    checked={answers[index] === choice}
                                    disabled={revealed || loading}
                                    onChange={() =>
                                      setAnswers((current) => ({
                                        ...current,
                                        [index]: choice,
                                      }))
                                    }
                                    className="mt-1.5 accent-indigo-400"
                                  />
                                  <span className="min-w-0 [overflow-wrap:anywhere]">
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                            {revealed && (
                              <div className="mt-4 border-t border-white/10 pt-3 text-sm leading-6">
                                <p
                                  className={
                                    answers[index] === question.answer
                                      ? "text-emerald-300"
                                      : "text-amber-300"
                                  }
                                >
                                  {answers[index] === question.answer
                                    ? "Correct"
                                    : "Review this answer"}
                                </p>
                                <p className="mt-1 text-neutral-400">
                                  {question.explanation}
                                </p>
                              </div>
                            )}
                          </fieldset>
                        ),
                    )}
                  </StudyCarousel>
                  {!revealed ? (
                    <button
                      disabled={
                        loading ||
                        Object.keys(answers).length !== quiz.questions.length
                      }
                      onClick={() => {
                        setRevealed(true);
                        setQuestionIndex(0);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm disabled:opacity-40"
                    >
                      <Check size={16} />
                      Check answers
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={loading}
                        onClick={() => {
                          setAnswers({});
                          setQuestionIndex(0);
                          setRevealed(false);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm"
                      >
                        <RotateCcw size={14} />
                        Try again
                      </button>
                      <button
                        disabled={loading}
                        onClick={() =>
                          void generate(
                            quiz.questions
                              .filter((q, i) => answers[i] !== q.answer)
                              .map((q) => q.question)
                              .join("\n")
                              .slice(0, 2000) ||
                              "Create a new set of questions on this topic.",
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-400/30 px-4 py-2.5 text-sm text-indigo-200"
                      >
                        <Sparkles size={14} />
                        Generate follow-up practice
                      </button>
                    </div>
                  )}
                </>
              )}
              <p className="text-xs leading-6 text-neutral-500">
                AI-generated material can contain mistakes. Check important
                facts before sharing. Scores reflect this practice session, not
                a proficiency assessment.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
