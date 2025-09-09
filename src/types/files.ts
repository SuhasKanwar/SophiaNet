import type { ComponentType, SVGProps } from "react";
import { DocumentTextIcon, PhotoIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

export type FileType = "pdf" | "txt" | "md" | "png" | "jpg" | "jpeg";

export const SUPPORTED_FILE_TYPES: FileType[] = ["pdf", "txt", "md", "png", "jpg", "jpeg"];
export const ACCEPT_FILE_TYPES = SUPPORTED_FILE_TYPES.map(t => `.${t}`).join(",");

export const FILE_TYPE_ICONS: Record<FileType, ComponentType<SVGProps<SVGSVGElement>>> = {
  pdf: DocumentTextIcon,
  txt: DocumentTextIcon,
  md: CodeBracketIcon,
  png: PhotoIcon,
  jpg: PhotoIcon,
  jpeg: PhotoIcon,
};