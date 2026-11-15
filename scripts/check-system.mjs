// Run from web: node --env-file=.env scripts/check-system.mjs
// Uses the configured database/provider; creates and removes only its own test user.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { encode } from 'next-auth/jwt';
import { PrismaClient } from '../src/generated/prisma/client.js';
const db = new PrismaClient();
const base = process.env.TEST_BASE_URL || 'http://localhost:3001';
const id = `sophianet-check-${randomUUID()}`;
let created = false;

async function main() {
  assert.ok(process.env.NEXTAUTH_SECRET, 'NEXTAUTH_SECRET is required');
  await db.user.create({ data: { id, name: 'System verification fixture' } });
  created = true;
  const token = await encode({ token: { id, sub: id, name: 'System verification fixture' }, secret: process.env.NEXTAUTH_SECRET, maxAge: 600 });
  const cookieName = base.startsWith('https:') ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
  const headers = { 'Content-Type': 'application/json', Cookie: `${cookieName}=${token}` };
  async function call(path, body) {
    const response = await fetch(base + path, { method: body ? 'POST' : 'GET', headers, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(240000) });
    assert.equal(response.status, 200, `${path} returned ${response.status}`);
    return response.json();
  }
  assert.equal((await call('/api/auth/session')).user.id, id);
  const conversation = await call('/api/conversation', { title: 'System check', variant: 'chat' });
  const conversationId = conversation.data.id;
  const chat = await call('/api/chat', { conversationId, content: 'Explain photosynthesis in one sentence.' });
  assert.ok(chat.data.botMessage.content);
  console.log('PASS authenticated chat and database write');
  const stream = await fetch(base + '/api/debate', { method: 'POST', headers, body: JSON.stringify({ conversationId, content: 'Check whether (12+8)/4 equals 5.' }), signal: AbortSignal.timeout(320000) });
  assert.equal(stream.status, 200);
  const events = (await stream.text()).trim().split('\n').map(JSON.parse);
  assert.equal(events.at(-1).type, 'saved');
  assert.equal(events.filter(event => event.type === 'contribution').length, 3);
  assert.equal((await call('/api/chat?conversationId=' + conversationId)).data.length, 4);
  console.log('PASS debate stream and database reload');
  const denied = await fetch(base + '/api/debate', { method: 'POST', headers, body: JSON.stringify({ conversationId: randomUUID(), content: 'test' }) });
  assert.equal(denied.status, 404);
  const quiz = await call('/api/studio', { mode: 'quiz', prompt: 'Basic addition for beginners' });
  assert.equal(quiz.quiz.questions.length, 3);
  for (const question of quiz.quiz.questions) { assert.equal(question.options.length, 4); assert.ok(question.answer >= 0 && question.answer < 4); }
  for (const mode of ['narration', 'code']) {
    const result = await call('/api/studio', { mode, prompt: mode === 'code' ? 'Python addition function with example' : 'A 20-second educational script about rain' });
    assert.ok(result.response.trim());
  }
  assert.ok((await call('/api/diagram', { prompt: 'A flowchart from rain to river to ocean', code: '' })).response.trim());
  console.log('PASS quiz, scripts and diagram through live upstream');
  for (const path of ['/api/studio', '/api/diagram', '/api/debate']) {
    const response = await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(response.status, 401);
  }
  const invalid = await fetch(base + '/api/studio', { method: 'POST', headers, body: JSON.stringify({ mode: 'unknown', prompt: 'test' }) });
  assert.equal(invalid.status, 400);
  console.log('PASS access controls and input validation');
}

main().catch(error => { console.error('FAIL', error.message); process.exitCode = 1; }).finally(async () => {
  try {
    if (created) { await db.user.deleteMany({ where: { id } }); console.log('Removed temporary test account and its conversations'); }
  } catch { console.error('Fixture cleanup failed; remove test user:', id); process.exitCode = 1; }
  finally { await db.$disconnect(); }
});
