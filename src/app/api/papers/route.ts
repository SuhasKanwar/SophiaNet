import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/options';
import { MICROSERVICE_BASE_URL } from '@/lib/config';

const search = z.object({
  query: z.string().trim().min(2).max(500),
  since: z.number().int().min(1900).max(new Date().getFullYear()).nullable().optional(),
  limit: z.number().int().min(1).max(20).default(10),
});

export async function POST(request: Request) {
  if (!(await getServerSession(authOptions))?.user) return Response.json({ message: 'Sign in to search papers.' }, { status: 401 });
  const parsed = search.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: 'Enter a topic of 2–500 characters and a valid publication year.' }, { status: 400 });
  try {
    const response = await fetch(`${MICROSERVICE_BASE_URL}/search-papers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(240000)]), cache: 'no-store',
    });
    if (!response.ok) return Response.json({ message: 'Scholarly search is unavailable. Please retry.' }, { status: 502 });
    return Response.json(await response.json());
  } catch {
    return Response.json({ message: 'Search timed out or is unavailable. Please retry.' }, { status: 502 });
  }
}
