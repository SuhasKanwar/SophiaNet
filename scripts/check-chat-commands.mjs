import assert from 'node:assert/strict';
import { CHAT_COMMAND_IDS, parseChatCommand } from '../src/lib/chat-command.ts';
for (const id of CHAT_COMMAND_IDS) {
  assert.deepEqual(parseChatCommand(`/${id}   explain gravity`), { command: id, content: 'explain gravity' });
  assert.throws(() => parseChatCommand(`/${id}`));
}
assert.deepEqual(parseChatCommand('ordinary chat'), { command: null, content: 'ordinary chat' });
assert.throws(() => parseChatCommand('/unknown hi'));
assert.throws(() => parseChatCommand(`/research ${'x'.repeat(501)}`));
assert.equal(parseChatCommand('/summarize First line\n\nSecond line').content, 'First line\n\nSecond line');
console.log('Chat command parsing checks passed');
const { aiErrorResponse } = await import('../src/lib/ai-error.ts');
for (const status of [403, 503]) {
  const response = await aiErrorResponse(Response.json({message:'Safe upstream message'}, {status}), 'Fallback');
  assert.equal(response.status, status);
  assert.equal((await response.json()).message, 'Safe upstream message');
}
const fallback = await aiErrorResponse(new Response('not JSON', {status:502}), 'Fallback');
assert.equal((await fallback.json()).message, 'Fallback');
console.log('AI error forwarding checks passed');
