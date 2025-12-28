import "dotenv/config";

import { extractMemories, type ConversationMessage } from "../index";

const apiKey = process.env.DEEPSEEK_API_KEY;

if (!apiKey) {
  throw new Error("Missing DEEPSEEK_API_KEY in environment");
}

const messages: ConversationMessage[] = [
  { role: "user", message: "Hi, my name is Steve" },
  { role: "assistant", message: "Nice to meet you" },
  { role: "user", message: "I prefer TypeScript" },
];

const memories = await extractMemories(messages, { apiKey });
console.log(memories);
