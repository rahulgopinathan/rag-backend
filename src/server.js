import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ingestRouter from "./routes/ingest.js";
import queryRouter from "./routes/query.js";
import { connectDB } from "./services/mongo.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

await connectDB();

app.use("/api", ingestRouter);
app.use("/api", queryRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
