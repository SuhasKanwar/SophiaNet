import React from "react";
import { X } from "lucide-react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { FILE_TYPE_ICONS, type FileType } from "@/types/files";
import { motion } from "framer-motion";

function getFileTypeFromName(name: string): FileType | null {
  const ext = name.split(".").pop()?.toLowerCase();
  const supported: FileType[] = ["pdf", "txt", "md", "png", "jpg", "jpeg"];
  return supported.includes(ext as FileType) ? (ext as FileType) : null;
}

type FileIconTagProps = {
  name: string;
  onRemove?: () => void;
  className?: string;
  sizeBytes?: number;
  mimeType?: string;
  lastModified?: number | Date;
  variant?: "tag" | "card";
  // New: allow stopping click bubbling (useful when parent container opens file dialog on click)
  stopClickPropagation?: boolean;
};

function formatFileSize(bytes?: number) {
  if (bytes === undefined) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

export default function FileIconTag({
  name,
  onRemove,
  className,
  sizeBytes,
  mimeType,
  lastModified,
  variant = "tag",
  stopClickPropagation = false,
}: FileIconTagProps) {
  const type = getFileTypeFromName(name);
  const Icon = type ? FILE_TYPE_ICONS[type] : DocumentTextIcon;
  const modifiedStr =
    lastModified !== undefined
      ? new Date(lastModified).toLocaleDateString()
      : "";

  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.6 }}
        onClick={stopClickPropagation ? (e) => e.stopPropagation() : undefined}
        className={`relative overflow-hidden z-40 bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 w-full mx-auto rounded-md shadow-sm border border-white/10 pr-8 ${
          className || ""
        }`}
        title={name}
      >
        <div className="flex justify-between w-full items-center gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className="w-5 h-5 text-neutral-300 shrink-0" />
            <p className="text-base text-neutral-300 truncate">{name}</p>
          </div>
          <p className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm bg-neutral-800 text-white shadow-input">
            {formatFileSize(sizeBytes)}
          </p>
        </div>

        <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-400">
          <p className="px-1 py-0.5 rounded-md bg-neutral-800">
            {mimeType || (type ? type.toUpperCase() : "File")}
          </p>
          {modifiedStr ? <p>modified {modifiedStr}</p> : <div />}
        </div>

        {onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 p-1 rounded-md bg-neutral-800/60 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10"
            aria-label="Remove file"
            title="Remove file"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      onClick={stopClickPropagation ? (e) => e.stopPropagation() : undefined}
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-md border text-xs bg-white/5 border-white/10 text-neutral-300 ${
        className || ""
      }`}
      title={name}
    >
      <Icon className="w-4 h-4" />
      <span className="max-w-[180px] truncate">{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
          aria-label="Remove file"
          title="Remove file"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
}