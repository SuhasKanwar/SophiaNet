"use client";

import { useState } from "react";
import { FileUpload } from "../ui/file-upload";
import ToolsHeading from "./ToolsHeading";
import axios from "axios";
import { useToast } from "@/providers/ToastProvider";

export default function NotesTool() {
	const [files, setFiles] = useState<File[]>([]);
	const [extracting, setExtracting] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [conversationId, setConversationId] = useState<string | null>(null);
	const { showToast } = useToast();

	const handleFileUpload = (files: File[]) => {
		setFiles(files);
		setResult(null);
	}

	const handleExtract = async () => {
		if (!files.length || extracting) return;
		setExtracting(true);

		try {
			let convId = conversationId;
			if (!convId) {
				const convRes = await axios.post("/api/tool-conversation", {
					title: "Notes OCR",
					variant: "notes_tool",
				});
				if (!convRes.data?.success) {
					throw new Error(convRes.data?.message || "Failed to start conversation");
				}
				convId = convRes.data.data.id;
				setConversationId(convId);
			}

			const fd = new FormData();
			fd.append("conversationId", convId!);
			fd.append("content", "Extract text from the uploaded document(s).");
			files.forEach((f) => fd.append("files", f));

			const res = await axios.post("/api/tool-chat", fd, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (!res.data?.success) {
				throw new Error(res.data?.message || "Failed to extract");
			}
			const reply: string = res.data.data?.botMessage?.content || "No response.";
			setResult(reply);
			showToast({ type: "success", title: "OCR Complete", message: "Text extracted successfully." });
		} catch (e: any) {
			const msg = e?.response?.data?.message || e?.message || "Extraction failed";
			showToast({ type: "error", title: "OCR Error", message: msg });
		} finally {
			setExtracting(false);
		}
	}

	return (
		<section className="flex flex-col w-full px-3 pt-4 items-center min-h-full mt-[var(--navbar-height,64px)]">
			<ToolsHeading firstPart="Notes" secondPart="Tool (OCR)" />
			<FileUpload onChange={handleFileUpload}>
				<>
					<button
						onClick={handleExtract}
						disabled={!files.length || extracting}
						className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
							!files.length || extracting
								? "bg-indigo-500/20 border-indigo-400/20 text-indigo-200/50 cursor-not-allowed"
								: "bg-indigo-500/20 border-indigo-400/40 text-indigo-100 hover:bg-indigo-500/30"
						}`}
						aria-busy={extracting}
					>
						{extracting ? "Extracting..." : "Extract Text"}
					</button>

					{result && (
						<div className="mt-3 w-[min(80vw,640px)] max-w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-neutral-200">
							{result}
						</div>
					)}
				</>
			</FileUpload>
		</section>
	);
}