import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/options";
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
  const body = await request.json().catch(() => null);
  const parsed = diagramRequest.safeParse(body);
  if (!parsed.success) {
    return Response.json({ message: "Enter a description of up to 4,000 characters and code of up to 100,000 characters." }, { status: 400 });
  }
  try {
    const response = await fetch(`${MICROSERVICE_BASE_URL}/generate-diagram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
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
