// node --experimental-strip-types scripts/check-tool-session.mjs
import assert from "node:assert/strict";
import {
  createToolSession,
  TOOL_SESSION_PREFIX,
  TOOL_SESSION_TTL,
  toolForPath,
} from "../src/lib/tool-session.ts";
class StorageFixture {
  map = new Map();
  get length() {
    return this.map.size;
  }
  key(index) {
    return [...this.map.keys()][index] ?? null;
  }
  getItem(key) {
    return this.map.get(key) ?? null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
}
const storage = new StorageFixture();
let time = 1000;
const store = createToolSession("alice", storage, () => time);
const set = (tool, field, value, memory = false) =>
  store.set(tool, field, null, value, store.epoch(tool), memory);
set("studio", "quiz.answers", { 0: 2 });
set("studio", "flashcards.card", 3);
set("research-studio", "query", "retrieval");
set("notes-tool", "files", [{ name: "private.txt", content: "secret" }], true);
assert.equal(store.get("notes-tool", "files", [])[0].name, "private.txt");
const reload = createToolSession("alice", storage, () => time);
assert.deepEqual(reload.get("studio", "quiz.answers", {}), { 0: 2 });
assert.equal(reload.get("studio", "flashcards.card", 0), 3);
assert.deepEqual(reload.get("notes-tool", "files", []), []);
assert.ok(![...storage.map.values()].join("").includes("secret"));
const oldEpoch = store.epoch("studio");
store.reset("studio");
store.set("studio", "quiz.answers", {}, { 0: 1 }, oldEpoch);
assert.deepEqual(store.get("studio", "quiz.answers", {}), {});
assert.equal(store.get("research-studio", "query", ""), "retrieval");
store.deactivate();
set("research-studio", "query", "stale");
assert.equal(store.get("research-studio", "query", ""), "retrieval");
store.activate();
store.reset();
assert.equal(store.get("research-studio", "query", ""), "");
set("research-studio", "query", "expiring");
time += TOOL_SESSION_TTL;
store.expire();
assert.equal(store.get("research-studio", "query", ""), "");
set("studio", "quiz.answers", { 1: 1 });
time += TOOL_SESSION_TTL;
assert.deepEqual(
  createToolSession("alice", storage, () => time).get(
    "studio",
    "quiz.answers",
    {},
  ),
  {},
);
set("research-studio", "query", "alice data");
const bob = createToolSession("bob", storage, () => time);
assert.equal(bob.get("research-studio", "query", ""), "");
assert.equal(storage.getItem(TOOL_SESSION_PREFIX + "alice"), null);
storage.setItem(TOOL_SESSION_PREFIX + "bad", "{broken");
assert.equal(
  createToolSession("bad", storage, () => time).get("studio", "prompt", ""),
  "",
);
const blocked = {
  getItem() {
    throw Error("blocked");
  },
  setItem() {
    throw Error("quota");
  },
  removeItem() {},
  length: 0,
  key() {
    return null;
  },
};
const fallback = createToolSession("u", blocked, () => time);
fallback.set("studio", "prompt", "", "kept", fallback.epoch("studio"));
assert.equal(fallback.get("studio", "prompt", ""), "kept");
assert.equal(fallback.isVolatile(), true);
assert.equal(toolForPath("/chatbot/t/studio"), "studio");
assert.equal(toolForPath("/chatbot/c/123"), "chat:123");
assert.equal(toolForPath("/"), null);
console.log(
  "PASS tool state: reload, per-mode state, memory-only files, scoped/all resets, stale writes, expiry, user isolation, corrupted/blocked storage",
);
