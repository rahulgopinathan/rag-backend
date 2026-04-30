import express from "express";
import { runAgent } from "../agent/agent.js";

const router = express.Router();

/**
 * POST /query
 * Body: { query: string }
 * Runs the agentic RAG pipeline and returns the answer + sources + which tool was used
 */
router.post("/query", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "query field is required" });
    }

    const result = await runAgent(query);
    res.json(result);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
