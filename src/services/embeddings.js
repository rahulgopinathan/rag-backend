import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

// text-embedding-3-small = 1536 dims, cheap, fast, good quality
export const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-small",
});

export async function embedText(text) {
  return await embeddings.embedQuery(text);
}

export async function embedBatch(texts) {
  return await embeddings.embedDocuments(texts);
}
