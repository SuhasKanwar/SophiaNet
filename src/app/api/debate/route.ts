import { aiErrorResponse } from "@/lib/ai-error";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { MICROSERVICE_BASE_URL } from "@/lib/config";

const input = z.object({ conversationId: z.string().min(1), content: z.string().trim().min(1).max(4000), command: z.literal("agent-battleground").optional() });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: "Invalid debate request" }, { status: 400 });
  const { conversationId, content } = parsed.data;
  const conversation = await prisma.conversation.findFirst({ where: { id: conversationId, userId: session.user.id } });
  if (!conversation || conversation.variant !== "chat") return Response.json({ message: "Chat not found" }, { status: 404 });
  const history = await prisma.chat.findMany({ where: { conversationId, type: 'text' }, orderBy: { createdAt: 'desc' }, take: 20 });
  const upstream = await fetch(`${MICROSERVICE_BASE_URL}/generate-debate`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: content, command: "agent-battleground", session_history: history.reverse().map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.content || "" })) }),
    signal: AbortSignal.any([request.signal, AbortSignal.timeout(310000)]),
  }).catch(() => null);
  if (upstream && !upstream.ok) return aiErrorResponse(upstream, "Debate service unavailable");
  if (!upstream?.ok || !upstream.body) return Response.json({ message: "Debate service unavailable" }, { status: 502 });
  const reader = upstream.body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;
  let cancelled = false;
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: unknown) => { if (!cancelled) controller.enqueue(encoder.encode(JSON.stringify(event) + "\n")); };
      try {
        while (!cancelled) {
          const chunk = await reader.read();
          buffer += decoder.decode(chunk.value, { stream: !chunk.done });
          if (buffer.length > 1000000) throw new Error('Stream exceeded limit');
          let end;
          while ((end = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
            if (!line.trim()) continue;
            const event = JSON.parse(line);
            if (event.type === 'error') throw new Error('Panel failed');
            if (event.type === 'done') {
              if (typeof event.text !== 'string' || !event.text.trim() || done) throw new Error('Invalid final answer');
              const result = await prisma.$transaction(async tx => {
                const userMessage = await tx.chat.create({ data: { conversationId, sender: 'user', content } });
                const botMessage = await tx.chat.create({ data: { conversationId, sender: 'bot', content: event.text, model: 'nvidia-debate', type: 'text' } });
                await tx.conversation.update({ where: { id: conversationId }, data: { lastUpdated: new Date() } });
                return { userMessage, botMessage };
              });
              done = true;
              emit({ type: 'saved', ...result });
            } else if (!done && ['start', 'contribution'].includes(event.type)) emit(event);
          }
          if (chunk.done) break;
        }
        if (!done && !cancelled) throw new Error('Stream interrupted');
      } catch {
        emit({ type: 'error', message: 'The debate could not finish or be saved. Please retry.' });
      } finally {
        await reader.cancel().catch(() => {});
        if (!cancelled) controller.close();
      }
    },
    cancel() { cancelled = true; return reader.cancel(); },
  });
  return new Response(stream, { headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no' } });
}
