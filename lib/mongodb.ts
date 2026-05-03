import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri && process.env.NODE_ENV !== "test") {
  console.warn(
    "[mongodb] MONGODB_URI is not defined. Database features will return empty results until configured."
  );
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;
  if (clientPromise) return clientPromise;
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = globalThis as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export default async function getMongoClient(): Promise<MongoClient | null> {
  const p = getClientPromise();
  if (!p) return null;
  return p;
}

export async function getDb(): Promise<Db | null> {
  const c = await getMongoClient();
  if (!c) return null;
  return c.db();
}
