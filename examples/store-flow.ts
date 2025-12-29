import "dotenv/config";

import { extractMemories, mergeMemories, InMemoryStore } from "../index";

const apiKey = process.env.DEEPSEEK_API_KEY;

if (!apiKey) {
  throw new Error("Missing DEEPSEEK_API_KEY in environment");
}

const store = new InMemoryStore();
const userId = "user-123";

const conversation = [
  { role: "user", message: "Hi, my name is Steve" },
  { role: "assistant", message: "Nice to meet you" },
  { role: "user", message: "I prefer TypeScript" },
];

const candidates = await extractMemories(conversation, { apiKey });
if (!candidates) {
  throw new Error("No memories extracted");
}

const existing = await store.get(userId);
const merged = mergeMemories(existing, candidates, { maxMemories: 200 });
await store.put(userId, merged);

const stored = await store.get(userId);
console.log(stored);
