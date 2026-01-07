import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { vectorStore } from "./prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("You: ");

    if (question === "bye") {
      break;
    }

    // 🔍 Retrieval
    const relevantChunks = await vectorStore.similaritySearch(question, 3);

    if (!relevantChunks || relevantChunks.length === 0) {
      console.log("I don't know based on the provided information.");
      continue;
    }

    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");

    // ✅ SAFE SYSTEM PROMPT (NO JSON / NO COMMA ISSUE)
    const SYSTEM_PROMPT =
      "You are a company internal assistant. Answer only from the given context. Do not use external knowledge. Do not guess or assume anything. If the answer is not clearly present in the context, reply exactly: I don't know based on the provided information. Keep the answer short and factual.";

    const userQuery = `Context:
${context}

Question:
${question}`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
    });

    console.log("\nAssistant:", completion.choices[0].message.content, "\n");
  }

  rl.close();
}

chat();
