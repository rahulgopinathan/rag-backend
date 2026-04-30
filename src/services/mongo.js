import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client;
let collection;

export async function connectDB() {
  if (collection) return collection;

  if (
    !process.env.MONGODB_URI ||
    !process.env.MONGODB_DB ||
    !process.env.MONGODB_COLLECTION
  ) {
    throw new Error("MongoDB environment variables are not configured");
  }

  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db(process.env.MONGODB_DB);
    collection = db.collection(process.env.MONGODB_COLLECTION);
    return collection;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw new Error("Failed to connect to MongoDB");
  }
}

export async function getCollection() {
  try {
    if (!collection) await connectDB();
    return collection;
  } catch (err) {
    console.error("Failed to get MongoDB collection:", err);
    throw err;
  }
}

export async function closeDB() {
  if (!client) return;

  try {
    await client.close();
  } catch (err) {
    console.error("Failed to close MongoDB connection:", err);
  }
}
