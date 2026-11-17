"use client";
import { useRef, useCallback } from "react";

import { usePathname } from "next/navigation";
import { toolForPath } from "@/lib/tool-session";
import { useToolState } from "@/providers/ToolSessionProvider";

export function useFileSelection(accept?: string) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const tool = toolForPath(usePathname()) || "composer";
    const [files, setFiles] = useToolState<File[]>(tool, "attachments", [], true);

    const trigger = useCallback(() => fileInputRef.current?.click(), []);
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFiles(Array.from(e.target.files));
        }
    }, [setFiles]);
    const clearAll = useCallback(() => setFiles([]), [setFiles]);
    const removeAt = useCallback((idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
    }, [setFiles]);

    const inputProps = {
        ref: fileInputRef,
        type: "file",
        className: "hidden",
        accept,
        multiple: true,
        onChange,
    };

    return { files, trigger, clearAll, removeAt, inputProps };
}