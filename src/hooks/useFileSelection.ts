"use client";
import { useRef, useState, useCallback } from "react";

export function useFileSelection(accept?: string) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const trigger = useCallback(() => fileInputRef.current?.click(), []);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  }, []);
  const clear = useCallback(() => setFile(null), []);

  const inputProps = { ref: fileInputRef, type: "file", className: "hidden", accept, onChange };

  return { file, trigger, clear, inputProps };
}