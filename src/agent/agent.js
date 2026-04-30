import { ChatOpenAI } from "@langchain/openai";
import { vectorSearch } from "../services/vector-search.js";
import dotenv from "dotenv";

dotenv.config();

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
});

/**
 * Step 1: Decide if the query needs retrieval from our docs
 * or can be answered from general knowledge.
 * This is the "agentic" decision-making.
 */
async function decideAction(query) {
  const decisionPrompt = `You are a routing agent. Decide whether the user's question requires looking up specific company documents or can be answered with general knowledge.

Respond with ONLY one word: "RETRIEVE" or "GENERAL".

Use RETRIEVE if the question asks about:
- Specific company info (services, products, case studies, clients)
- Anything that would require knowing specific facts about a particular organization

Use GENERAL if the question is about:
- General concepts (what is RAG, how does AI work, programming questions)
- Common knowledge

User question: "${query}"

Answer:`;

  const response = await llm.invoke(decisionPrompt);
  const decision = response.content.trim().toUpperCase();
  return decision.includes("RETRIEVE") ? "RETRIEVE" : "GENERAL";
}

/**
 * Step 2a: Answer using retrieved context (RAG)
 */
async function answerWithRetrieval(query) {
  const chunks = await vectorSearch(query, 3);

  if (chunks.length === 0) {
    return {
      answer: "I couldn't find relevant information in the knowledge base.",
      sources: [],
      tool: "searchDocs",
    };
  }

  const context = chunks
    .map((c, i) => `[Source ${i + 1}: ${c.source}]\n${c.text}`)
    .join("\n\n");

  const ragPrompt = `You are a helpful assistant. Answer the user's question using ONLY the context provided below. If the context doesn't contain the answer, say so honestly.

Context:
${context}

Question: ${query}

Answer:`;

  const response = await llm.invoke(ragPrompt);

  return {
    answer: response.content,
    sources: chunks,
    tool: "searchDocs",
  };
}

/**
 * Step 2b: Answer from general knowledge (no retrieval)
 */
async function answerGeneral(query) {
  const response = await llm.invoke(query);
  return {
    answer: response.content,
    sources: [],
    tool: "generalKnowledge",
  };
}

/**
 * Main agent entry point - decides and dispatches
 */
export async function runAgent(query) {
  const decision = await decideAction(query);

  if (decision === "RETRIEVE") {
    return await answerWithRetrieval(query);
  } else {
    return await answerGeneral(query);
  }
}
