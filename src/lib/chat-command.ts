export const BATTLEGROUND_COMMAND = '/agent-battleground';

export function parseChatCommand(input: string) {
  const text = input.trim();
  if (!text.startsWith('/')) return { content: text, command: null };
  const [name, ...rest] = text.split(/\s+/);
  if (name !== BATTLEGROUND_COMMAND) throw new Error('Unknown command. Use /agent-battleground.');
  const content = rest.join(' ').trim();
  if (!content) throw new Error('Add a question after /agent-battleground.');
  return { content, command: 'agent-battleground' as const };
}
