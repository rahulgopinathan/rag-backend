import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ingestRouter from "./routes/ingest.js";
import queryRouter from "./routes/query.js";
import { connectDB } from "./services/mongo.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // your frontend URL
  }),
);

app.use(express.json());
const PORT = process.env.PORT || 3001;

try {
  await connectDB();

  app.use("/api", ingestRouter);
  app.use("/api", queryRouter);

  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (err) {
  console.error("Server startup failed:", err);
  process.exit(1);
}
