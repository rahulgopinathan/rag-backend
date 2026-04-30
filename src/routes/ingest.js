import express from "express";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getCollection } from "../services/mongo.js";
import { embedBatch } from "../services/embeddings.js";

const router = express.Router();

/**
 * POST /ingest
 * Body: { text: string, source: string }
 * Chunks the text, embeds each chunk, and stores in MongoDB
 */
router.post("/ingest", async (req, res) => {
  console.log("Received ingest request");
  try {
    const { text, source = "unknown" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text field is required" });
    }

    // 1. Chunk the document
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const chunks = await splitter.splitText(text);

    // 2. Embed all chunks in one batch (faster + cheaper)
    const vectors = await embedBatch(chunks);

    // 3. Build documents and insert
    const docs = chunks.map((chunk, i) => ({
      text: chunk,
      embedding: vectors[i],
      source,
      createdAt: new Date(),
    }));

    const collection = await getCollection();
    const result = await collection.insertMany(docs);

    res.json({
      success: true,
      chunksCreated: result.insertedCount,
      source,
    });
  } catch (err) {
    console.error("Ingest error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /ingest/all
 * Wipe the collection (useful during demos)
 */
router.delete("/ingest/all", async (req, res) => {
  try {
    const collection = await getCollection();
    const result = await collection.deleteMany({});
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
