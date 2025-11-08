"use client";

import { useState } from "react";
import { FileUpload } from "../ui/file-upload";

export default function NotesTool() {
	const [files, setFiles] = useState<File[]>([]);

	const handleFileUpload = (files: File[]) => {
		setFiles(files);
		console.log("Uploaded files:", files);
	}

	return (
		<section className="flex bg-white flex-col w-full px-3 pt-4 items-center h-full mt-[var(--navbar-height,64px)]">
			<h2>
				Notes Tool (OCR)
			</h2>
			<FileUpload onChange={handleFileUpload} />
		</section>
	);
}