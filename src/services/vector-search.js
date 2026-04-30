import { getCollection } from "./mongo.js";
import { embedText } from "./embeddings.js";

/**
 * Run vector similarity search using MongoDB Atlas $vectorSearch
 * @param {string} query - The user's question
 * @param {number} topK - Number of chunks to retrieve
 * @returns {Array} Top matching chunks with their text and source
 */
export async function vectorSearch(query, topK = 3) {
  const collection = await getCollection();
  const queryEmbedding = await embedText(query);

  const results = await collection
    .aggregate([
      {
        $vectorSearch: {
          index: process.env.VECTOR_INDEX_NAME || "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
        },
      },
      {
        $project: {
          _id: 0,
          text: 1,
          source: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ])
    .toArray();

  return results;
}
