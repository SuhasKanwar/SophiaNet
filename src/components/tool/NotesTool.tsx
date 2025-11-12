"use client";

import { useState } from "react";
import { FileUpload } from "../ui/file-upload";
import ToolsHeading from "./ToolsHeading";

export default function NotesTool() {
	const [files, setFiles] = useState<File[]>([]);
	const [extracting, setExtracting] = useState(false);

	const handleFileUpload = (files: File[]) => {
		setFiles(files);
	}

	const handleExtract = () => {
		if (!files.length || extracting) return;
		setExtracting(true);
		console.log("Extracting text from files:", files);
		setTimeout(() => setExtracting(false), 400);
	}

	return (
		<section className="flex flex-col w-full px-3 pt-4 items-center min-h-full mt-[var(--navbar-height,64px)]">
			<ToolsHeading firstPart="Notes" secondPart="Tool (OCR)" />
			<FileUpload onChange={handleFileUpload}>
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
			</FileUpload>
		</section>
	);
}