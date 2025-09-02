"use client";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm mx-auto rounded-xl border border-white/10 bg-neutral-900/95 p-5 shadow-xl">
        <button
          className="absolute top-2 right-2 p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10"
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <h2 className="text-sm font-semibold text-white mb-2">{title}</h2>
        {description && (
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-1.5 text-xs rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-3 py-1.5 text-xs rounded-md font-medium disabled:opacity-50 ${
              variant === "danger"
                ? "bg-red-600/80 hover:bg-red-600 text-white"
                : "bg-indigo-600/80 hover:bg-indigo-600 text-white"
            }`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}