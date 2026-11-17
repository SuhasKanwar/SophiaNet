import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/options";
import { SUPPORTED_FILE_TYPES, FileType } from "@/types/files";
import { MICROSERVICE_BASE_URL } from "@/lib/config";

const diagramRequest = z.object({
  prompt: z.string().trim().min(1).max(4000),
  code: z.string().max(100000).default(""),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ message: "Sign in to generate a diagram." }, { status: 401 });
  }
  let body: unknown;
  let files: File[] = [];
  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      body = { prompt: form.get("prompt"), code: form.get("code") || "" };
      const uploads = form.getAll("files");
      if (uploads.some(file => !(file instanceof File))) return Response.json({ message: "Invalid file upload." }, { status: 400 });
      files = uploads as File[];
      if (files.length > 10 || files.some(file => file.size > 10 * 1024 * 1024 || !SUPPORTED_FILE_TYPES.includes(file.name.split('.').pop()?.toLowerCase() as FileType))) {
        return Response.json({ message: "Attach up to 10 supported files, each at most 10 MB." }, { status: 400 });
      }
    } else body = await request.json();
  } catch { return Response.json({ message: "Invalid diagram request." }, { status: 400 }); }
  const parsed = diagramRequest.safeParse(body);
  if (!parsed.success) {
    return Response.json({ message: "Enter a description of up to 4,000 characters and code of up to 100,000 characters." }, { status: 400 });
  }
  try {
    const upstream = new FormData();
    upstream.append("prompt", parsed.data.prompt);
    upstream.append("code", parsed.data.code);
    files.forEach(file => upstream.append("files", file));
    const response = await fetch(`${MICROSERVICE_BASE_URL}/generate-diagram`, {
      method: "POST",
      body: upstream,
      signal: AbortSignal.timeout(120000),
      cache: "no-store",
    });
    if (!response.ok) {
      return Response.json({ message: "Diagram generation failed. Please try again." }, { status: 502 });
    }
    const data = await response.json();
    if (typeof data.response !== "string" || !data.response.trim()) {
      return Response.json({ message: "No diagram was returned. Please try again." }, { status: 502 });
    }
    return Response.json({ status: 200, response: data.response });
  } catch {
    return Response.json({ message: "Diagram service is unavailable. Please try again." }, { status: 502 });
  }
}
