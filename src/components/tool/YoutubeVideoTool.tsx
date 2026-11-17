"use client";

import ToolsHeading from "./ToolsHeading";
import { useState } from "react";
import { Youtube } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function YoutubeVideoTool() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const router = useRouter();

  const validate = () => {
    if (!value.trim()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Input cannot be empty.",
      });
      return "Input cannot be empty.";
    }
    const v = value.trim();
    const isYT =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(v);
    if (!isYT) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Invalid YouTube video URL.",
      });
      return "Please enter a valid YouTube video URL.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      let convId = conversationId;
      if (!convId) {
        const convRes = await axios.post("/api/tool-conversation", {
          title: "YouTube Video",
          variant: "youtube_tool",
        });
        if (!convRes.data?.success) {
          throw new Error(convRes.data?.message || "Failed to start conversation");
        }
        convId = convRes.data.data.id;
        setConversationId(convId);
      }

      const v = value.trim();
      const content = `Analyze this YouTube video: ${v}`;

      const chatRes = await axios.post("/api/tool-chat", {
        conversationId: convId,
        content,
        history: [],
      });
      if (!chatRes.data?.success) {
        throw new Error(chatRes.data?.message || "Failed to process input");
      }

      showToast({
        type: "success",
        title: "YouTube Analysis Ready",
        message: "Opening chat for follow-up questions...",
      });

      router.push(`/chatbot/c/${convId}`);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Request failed";
      setError(msg);
      showToast({ type: "error", title: "YouTube Tool Error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center px-4 py-40 sm:px-6">
      <ToolsHeading firstPart="YouTube Video" secondPart="Tool" />

      <form
        onSubmit={handleSubmit}
        className="surface-enter w-full max-w-2xl rounded-3xl border border-white/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.04] to-indigo-500/[0.04] p-5 shadow-2xl sm:p-8"
      >
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10"><Youtube className="h-7 w-7 text-red-400" /></div>
          <h2 className="text-xl font-semibold tracking-tight">From video to understanding</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-400">Paste a YouTube link to explore its transcript and get a focused summary.</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex-1">
            <label htmlFor="youtube-url" className="block text-xs text-neutral-400 mb-2">
              Video URL
            </label>
            <input
              id="youtube-url"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
              className="w-full rounded-lg bg-black/30 border border-white/10 text-neutral-200 px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-neutral-500"
            />
            <div className="text-[11px] text-neutral-500 mt-1">
              Paste a full YouTube video URL.
            </div>
          </div>
        </div>

        {error && <div role="alert" className="mt-3 text-xs text-red-400">{error}</div>}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              loading || !value.trim()
                ? "bg-indigo-500/20 border-indigo-400/20 text-indigo-200/50 cursor-not-allowed"
                : "bg-indigo-500/20 border-indigo-400/40 text-indigo-100 hover:bg-indigo-500/30"
            }`}
            aria-busy={loading}
          >
            {loading ? "Processing…" : "Explore video"}
          </button>
        </div>
      </form>
    </section>
  );
}