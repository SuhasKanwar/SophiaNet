"use client";

import { useEffect } from "react";
import { Loader2, Mic, Send, UploadCloud } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useFileSelection } from "@/hooks/useFileSelection";
import { ACCEPT_FILE_TYPES } from "@/types/files";
import FileIconTag from "@/components/FileIconTag";

interface ChatInputComponentProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading?: boolean;
  placeholder?: string;
  maxLength?: number;
  showFileUpload?: boolean;
  showVoiceInput?: boolean;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  bottomText?: string;
  onFilesChange?: (files: File[]) => void;
}

export default function ChatInputComponent({
  input,
  setInput,
  onSend,
  loading = false,
  placeholder = "Message...",
  maxLength = 4000,
  showFileUpload = true,
  showVoiceInput = true,
  onError,
  disabled = false,
  className = "",
  bottomText,
  onFilesChange,
}: ChatInputComponentProps) {
  const {
    files: selectedFiles,
    trigger: triggerFile,
    clearAll: clearFiles,
    removeAt,
    inputProps,
  } = useFileSelection(ACCEPT_FILE_TYPES);

  const { start: startVoice, active: voiceActive } = useSpeechRecognition({
    onResult: (t) => setInput(t),
    onError: (m) => onError?.(m),
  });

  useEffect(() => {
    onFilesChange?.(selectedFiles);
  }, [selectedFiles, onFilesChange]);

  const handleSend = () => {
    if (loading || disabled) return;
    if (!input.trim() && selectedFiles.length === 0) return;

    onSend();
    clearFiles();
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && !disabled) {
      handleSend();
    }
  };

  return (
    <div
      className={`w-full max-w-3xl mx-auto fixed z-10 bottom-0 left-[calc(var(--sidebar-width,60px))] right-0 px-3 pb-3 ${className}`}
    >
      {selectedFiles.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-2 space-y-2 max-h-36 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((f, i) => (
              <FileIconTag key={i} name={f.name} onRemove={() => removeAt(i)} />
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={clearFiles}
              className="text-[10px] text-red-400 hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-indigo-400/40 bg-white/5 backdrop-blur-xl flex items-center px-4 py-3 gap-2 shadow-lg">
        {showFileUpload && (
          <button
            onClick={triggerFile}
            className="p-2 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
            disabled={loading || disabled}
            title="Upload file"
          >
            <UploadCloud className="w-5 h-5" />
          </button>
        )}

        <input {...inputProps} key={`file-input-${selectedFiles.length}`} />

        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm px-2 py-1 placeholder:text-neutral-500"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || disabled}
          maxLength={maxLength}
        />

        {showVoiceInput && (
          <button
            onClick={startVoice}
            disabled={loading || voiceActive || disabled}
            className={`p-2 rounded-md border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 ${
              voiceActive
                ? "animate-pulse bg-indigo-500/20 border-indigo-400/40 text-indigo-200"
                : ""
            }`}
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={handleSend}
          disabled={loading || (!input.trim() && selectedFiles.length === 0) || disabled}
          className="p-2 rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium hover:from-indigo-400 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed shadow border border-indigo-400/40"
          title="Send"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {bottomText && (
        <div className="text-[11px] text-neutral-500 text-center mt-1">
          {bottomText}
        </div>
      )}
    </div>
  );
}