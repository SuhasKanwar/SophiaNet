import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/options";
import { MICROSERVICE_BASE_URL } from "@/lib/config";

const input = z.object({ mode: z.enum(['quiz', 'flashcards', 'narration', 'code']), prompt: z.string().trim().min(1).max(10000) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ message: 'Sign in to use the studio.' }, { status: 401 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: 'Choose a mode and enter up to 10,000 characters.' }, { status: 400 });
  const { mode, prompt } = parsed.data;
  try {
    const response = await fetch(`${MICROSERVICE_BASE_URL}/${mode === 'quiz' ? 'generate-quiz' : mode === 'flashcards' ? 'generate-flashcards' : 'generate-script'}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify((mode === 'quiz' || mode === 'flashcards') ? { topic: prompt } : { prompt, kind: mode }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(180000)]), cache: 'no-store',
    });
    if (!response.ok) return Response.json({ message: 'Generation failed. Please try again.' }, { status: 502 });
    return Response.json(await response.json());
  } catch {
    return Response.json({ message: 'The studio service is unavailable. Please retry.' }, { status: 502 });
  }
}
