"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Send, UploadCloud } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useFileSelection } from "@/hooks/useFileSelection";
import { ACCEPT_FILE_TYPES } from "@/types/files";
import FileIconTag from "@/components/FileIconTag";

import { BATTLEGROUND_COMMAND, parseChatCommand } from "@/lib/chat-command";

interface ChatInputComponentProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  enableCommands?: boolean;
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
  enableCommands = false,
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const menuOpen = enableCommands && !dismissed && input.startsWith('/') && !/\s/.test(input) && BATTLEGROUND_COMMAND.startsWith(input);
  const selectCommand = () => { setInput(BATTLEGROUND_COMMAND + ' '); setDismissed(false); inputRef.current?.focus(); };
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

    if (enableCommands) {
      try {
        const parsed = parseChatCommand(input);
        if (parsed.command && selectedFiles.length) throw new Error('Agent battleground supports text only. Remove attachments first.');
      } catch (error) { onError?.(error instanceof Error ? error.message : 'Invalid command'); return; }
    }
    onSend();
    clearFiles();
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (menuOpen && ["Enter", "Tab", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      if (e.key === "Enter" || e.key === "Tab") selectCommand();
      return;
    }
    if (e.key === "Escape") { setDismissed(true); return; }
    if (e.key === "Enter" && !loading && !disabled) {
      handleSend();
    }
  };

  return (
    <div
      className={`max-w-3xl mx-auto fixed z-10 bottom-0 left-[calc(var(--sidebar-width,60px))] right-0 px-3 pb-3 ${className}`}
    >
      {menuOpen && <div id="chat-commands" role="listbox" aria-label="Chat commands" className="mb-2 rounded-xl border border-white/15 bg-slate-950 p-2 shadow-xl">
        <button type="button" role="option" aria-selected="true" onMouseDown={event => event.preventDefault()} onClick={selectCommand} className="w-full rounded-lg bg-indigo-500/15 p-3 text-left hover:bg-indigo-500/25">
          <span className="block text-sm font-medium text-indigo-200">/agent-battleground</span>
          <span className="mt-1 block text-xs text-neutral-400">Advocate, Critic and Judge review your question. Text only.</span>
        </button>
      </div>}
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
          ref={inputRef}
          role={enableCommands ? "combobox" : undefined}
          aria-label="Message"
          aria-expanded={enableCommands ? menuOpen : undefined}
          aria-controls={menuOpen ? "chat-commands" : undefined}
          aria-autocomplete={enableCommands ? "list" : undefined}
          type="text"
          className="min-w-0 flex-1 bg-transparent outline-none text-sm px-2 py-1 placeholder:text-neutral-500"
          placeholder={placeholder}
          value={input}
          onChange={(e) => { setInput(e.target.value); setDismissed(false); }}
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