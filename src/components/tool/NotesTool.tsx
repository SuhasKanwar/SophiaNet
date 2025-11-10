"use client";

import { useState } from "react";
import { FileUpload } from "../ui/file-upload";
import ToolsHeading from "./ToolsHeading";

export default function NotesTool() {
	const [files, setFiles] = useState<File[]>([]);

	const handleFileUpload = (files: File[]) => {
		setFiles(files);
		console.log("Uploaded files:", files);
	}

	return (
		<section className="flex flex-col w-full px-3 pt-4 items-center min-h-full mt-[var(--navbar-height,64px)]">
			<ToolsHeading firstPart="Notes" secondPart="Tool (OCR)" />
			<FileUpload onChange={handleFileUpload} />
		</section>
	);
}