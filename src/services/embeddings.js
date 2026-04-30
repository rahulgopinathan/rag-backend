import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

// text-embedding-3-small = 1536 dims, cheap, fast, good quality
export const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-small",
});

export async function embedText(text) {
  try {
    return await embeddings.embedQuery(text);
  } catch (err) {
    console.error("Embedding query failed:", err);
    throw new Error("Failed to embed query text");
  }
}

export async function embedBatch(texts) {
  try {
    return await embeddings.embedDocuments(texts);
  } catch (err) {
    console.error("Embedding batch failed:", err);
    throw new Error("Failed to embed documents batch");
  }
}
