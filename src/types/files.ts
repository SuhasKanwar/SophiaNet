export type FileType = "pdf" | "txt" | "md" | "png" | "jpg" | "jpeg";

export const SUPPORTED_FILE_TYPES: FileType[] = ["pdf","txt","md","png","jpg","jpeg"];
export const ACCEPT_FILE_TYPES = SUPPORTED_FILE_TYPES.map(t => `.${t}`).join(",");