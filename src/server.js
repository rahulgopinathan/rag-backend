import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { MongoClient } from "mongodb";
// import { OpenAI } from "openai";
import { connectDB } from "./services/mongo.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;

await connectDB();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
