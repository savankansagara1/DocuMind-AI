import Groq from "groq-sdk";
import { vectorStore } from "../prepare.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory chat memory
const chatMemory = new Map();
const MAX_HISTORY = 10;

export async function askQuestion({ question, pdfId, sessionId }) {
  const sessionKey = sessionId || "default";

  if (!chatMemory.has(sessionKey)) {
    chatMemory.set(sessionKey, []);
  }

  const history = chatMemory.get(sessionKey);

  console.log("SESSION:", sessionKey);
console.log("HISTORY LENGTH:", history.length);


  let context = "";
  let isPdfChat = false;

  // 🔍 PDF-based retrieval (namespace-based)
  if (pdfId) {
    const relevantChunks = await vectorStore.similaritySearch(
      question,
      3,
      { namespace: pdfId }
    );

    if (relevantChunks.length > 0) {
      context = relevantChunks
        .map((chunk) => chunk.pageContent)
        .join("\n\n");
      isPdfChat = true;
    }
  }

  // 🧠 System prompt
  const SYSTEM_PROMPT = isPdfChat
    ? "You are a PDF assistant. Answer only from the provided context. If not found, say you cannot find it in the document."
    : "You are a helpful AI assistant. Answer clearly and concisely.";

  // 🧱 Build messages array
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
  ];

  if (isPdfChat) {
    messages.push({
      role: "user",
      content: `Context:\n${context}\n\nQuestion:\n${question}`,
    });
  } else {
    messages.push({
      role: "user",
      content: question,
    });
  }

  // 🤖 LLM call
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages,
  });

  const answer = completion.choices[0].message.content;

  // 🧠 Update memory
  history.push({ role: "user", content: question });
  history.push({ role: "assistant", content: answer });

  // Keep memory small
  if (history.length > MAX_HISTORY * 2) {
    history.splice(0, history.length - MAX_HISTORY * 2);
  }

  return {
    answer,
    mode: isPdfChat ? "pdf" : "general",
  };
}
