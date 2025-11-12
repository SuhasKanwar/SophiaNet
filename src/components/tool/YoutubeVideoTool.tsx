"use client";

import ToolsHeading from "./ToolsHeading";
import { useMemo, useState } from "react";
import { Youtube, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/providers/ToastProvider";

type SourceMode = "url" | "channel";

export default function YoutubeVideoTool() {
  const [mode, setMode] = useState<SourceMode>("url");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const meta = useMemo(
    () => ({
      url: {
        label: "Video URL",
        placeholder:
          "https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID",
        hint: "Paste a full YouTube video URL.",
      },
      channel: {
        label: "Channel",
        placeholder: "@channelHandle or UCxxxxxxxxxxxxxxxxxx",
        hint:
          "Provide a channel handle (e.g., @veritasium) or channel ID (starts with UC...).",
      },
    }),
    []
  );

  const validate = () => {
    if (!value.trim()) {
        showToast({
            type: "error",
            title: "Validation Error",
            message: "Input cannot be empty."
        });
        return "Input cannot be empty.";
    }
    const v = value.trim();
    if (mode === "url") {
      const isYT =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(v);
      if (!isYT) {
        showToast({
            type: "error",
            title: "Validation Error",
            message: "Invalid YouTube video URL."
        });
        return "Please enter a valid YouTube video URL.";
      }
    }
    if (mode === "channel") {
      const looksLikeHandle = v.startsWith("@");
      const looksLikeId = /^UC[a-zA-Z0-9_-]{22}$/.test(v);
      if (!looksLikeHandle && !looksLikeId)
        showToast({
            type: "error",
            title: "Validation Error",
            message: "Invalid channel handle or ID."
        });
        return "Enter a channel handle (e.g., @channel) or a channel ID (starts with UC...).";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);

    const payload = { sourceType: mode, input: value.trim() };
    console.log("YoutubeVideoTool submit:", payload);

    setLoading(true);
  };

  return (
    <section className="flex flex-col w-full px-3 pt-4 items-center justify-center min-h-[calc(100vh-var(--navbar-height,64px))]">
      <ToolsHeading firstPart="YouTube Video" secondPart="Tool" />

      <div className="mt-4">
        <Youtube className="w-20 h-20 text-red-400" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur"
      >
        <div className="flex flex-col md:flex-row gap-3">
          <div className="md:w-44">
            <label className="block text-xs text-neutral-400 mb-1">
              Source Type
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-full rounded-lg bg-black/30 border border-white/10 text-neutral-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40 flex items-center justify-between">
                <span>{mode === "url" ? "Video URL" : "Channel"}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/80 backdrop-blur-lg border-white/10 text-neutral-200 min-w-[12rem]">
                <DropdownMenuRadioGroup
                  value={mode}
                  onValueChange={(v) => setMode(v as SourceMode)}
                >
                  <DropdownMenuRadioItem value="url">
                    Video URL
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="channel">
                    Channel
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1">
            <label className="block text-xs text-neutral-400 mb-1">
              {meta[mode].label}
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={meta[mode].placeholder}
              className="w-full rounded-lg bg-black/30 border border-white/10 text-neutral-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-neutral-500"
            />
            <div className="text-[11px] text-neutral-500 mt-1">
              {meta[mode].hint}
            </div>
          </div>
        </div>

        {error && <div className="mt-3 text-xs text-red-400">{error}</div>}

        <div className="mt-4 flex justify-end">
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
            {loading ? "Processing..." : "Proceed"}
          </button>
        </div>
      </form>
    </section>
  );
}