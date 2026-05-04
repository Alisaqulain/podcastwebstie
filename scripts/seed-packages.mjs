/**
 * Inserts coaching packages from data/packages-seed.json if the collection is empty.
 *
 * Usage: npm run seed:packages
 * Loads MONGODB_URI from .env.local when present.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* no .env.local */
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

const samples = JSON.parse(
  readFileSync(join(root, "data", "packages-seed.json"), "utf8")
);

const client = new MongoClient(uri);
await client.connect();
const db = client.db();
const col = db.collection("packages");
const n = await col.countDocuments();
if (n > 0) {
  console.log(`Skipping seed: packages already has ${n} document(s).`);
  await client.close();
  process.exit(0);
}

const now = new Date();
await col.insertMany(
  samples.map((s) => ({
    title: s.title,
    description: s.description,
    price: s.price,
    discountPrice: s.discountPrice ?? null,
    features: Array.isArray(s.features) ? s.features : [],
    badge: s.badge || "",
    active: s.active !== false,
    sortOrder: Number(s.sortOrder) || 0,
    createdAt: now,
    updatedAt: now,
  }))
);
console.log(`Inserted ${samples.length} packages from data/packages-seed.json.`);
await client.close();
