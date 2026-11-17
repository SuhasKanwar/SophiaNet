"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { RotateCcw, Trash2 } from "lucide-react";
import { useToolSession } from "@/providers/ToolSessionProvider";
import { toolForPath } from "@/lib/tool-session";
import ConfirmationModal from "./ConfirmationModal";

export default function ToolSessionControls({
  expanded,
}: {
  expanded: boolean;
}) {
  const store = useToolSession();
  const tool = toolForPath(usePathname());
  const [action, setAction] = useState<"current" | "all" | null>(null);
  const volatile = useSyncExternalStore(
    store.subscribe,
    store.isVolatile,
    () => false,
  );
  return (
    <div
      className="border-t border-white/10 p-2"
      onClick={(event) => event.stopPropagation()}
    >
      {expanded && (
        <p className="mb-2 px-1 text-[10px] leading-4 text-neutral-500">
          {volatile
            ? "Memory only · browser snapshot unavailable"
            : "Tab session · clears after 2h inactive"}
        </p>
      )}
      <div className={`flex gap-1 ${expanded ? "" : "flex-col"}`}>
        <button
          disabled={!tool}
          title="Reset current tool"
          aria-label="Reset current tool"
          onClick={() => setAction("current")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2 text-xs text-neutral-400 hover:bg-white/5 disabled:opacity-30"
        >
          <RotateCcw size={14} />
          {expanded && "Reset tool"}
        </button>
        <button
          title="Clear all tool state"
          aria-label="Clear all tool state"
          onClick={() => setAction("all")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2 text-xs text-neutral-400 hover:bg-white/5"
        >
          <Trash2 size={14} />
          {expanded && "Clear all"}
        </button>
      </div>
      <ConfirmationModal
        open={action !== null}
        title={action === "all" ? "Clear all tool state?" : "Reset this tool?"}
        description="This clears retained drafts, generated tool results and selected files in this tab. Saved chat history will remain. Export anything you want to keep first."
        confirmLabel="Clear state"
        variant="danger"
        onCancel={() => setAction(null)}
        onConfirm={() => {
          store.reset(action === "current" && tool ? tool : undefined);
          setAction(null);
        }}
      />
    </div>
  );
}
