export const CHAT_COMMANDS = [
  { id: 'agent-battleground', description: 'Advocate, Critic and Judge review your question.' },
  { id: 'summarize', description: 'Summarize source text with the Google ADK editor.' },
  { id: 'research', description: 'Find relevant scholarly papers with source links.' },
  { id: 'quiz', description: 'Create three practice questions with explained answers.' },
  { id: 'flashcards', description: 'Create five question and answer cards.' },
] as const;
export type ChatCommand = typeof CHAT_COMMANDS[number]["id"];
export const CHAT_COMMAND_IDS = CHAT_COMMANDS.map(item => item.id) as [ChatCommand, ...ChatCommand[]];

export function parseChatCommand(input: string): { content: string; command: ChatCommand | null } {
  const text = input.trim();
  if (!text.startsWith('/')) return { content: text, command: null };
  const boundary = text.search(/\s/);
  const name = boundary === -1 ? text : text.slice(0, boundary);
  const command = CHAT_COMMANDS.find(item => `/${item.id}` === name)?.id;
  if (!command) throw new Error('Unknown command. Type / to see available commands.');
  const content = boundary === -1 ? '' : text.slice(boundary).trim();
  if (!content) throw new Error(`Add a question or source text after /${command}.`);
  if (command === 'research' && content.length > 500) throw new Error('Keep research questions within 500 characters.');
  return { content, command };
}
