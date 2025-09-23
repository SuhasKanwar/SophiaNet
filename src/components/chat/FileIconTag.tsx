import React from "react";
import { X } from "lucide-react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { FILE_TYPE_ICONS, type FileType } from "@/types/files";

function getFileTypeFromName(name: string): FileType | null {
  const ext = name.split(".").pop()?.toLowerCase();
  const supported: FileType[] = ["pdf", "txt", "md", "png", "jpg", "jpeg"];
  return supported.includes(ext as FileType) ? (ext as FileType) : null;
}

export default function FileIconTag({
  name,
  onRemove,
  className,
}: {
  name: string;
  onRemove?: () => void;
  className?: string;
}) {
  const type = getFileTypeFromName(name);
  const Icon = type ? FILE_TYPE_ICONS[type] : DocumentTextIcon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-md border text-xs bg-white/5 border-white/10 text-neutral-300 ${
        className || ""
      }`}
      title={name}
    >
      <Icon className="w-4 h-4" />
      <span className="max-w-[180px] truncate">{name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
          aria-label="Remove file"
          title="Remove file"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}