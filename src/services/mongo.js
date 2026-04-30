import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client;
let collection;

export async function connectDB() {
  if (collection) return collection;

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log("✅ Connected to MongoDB Atlas");

  const db = client.db(process.env.MONGODB_DB);
  collection = db.collection(process.env.MONGODB_COLLECTION);
  return collection;
}

export async function getCollection() {
  if (!collection) await connectDB();
  return collection;
}

export async function closeDB() {
  if (client) await client.close();
}
