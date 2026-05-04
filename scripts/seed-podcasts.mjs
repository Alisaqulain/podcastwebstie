/**
 * Inserts seed podcasts from data/podcasts-seed.json if they are not already present.
 * Dedupes by YouTube video ID (any youtu.be / watch URL form).
 *
 * Usage (from repo root):
 *   node scripts/seed-podcasts.mjs
 *
 * Loads MONGODB_URI from the environment (set in .env.local or export before running).
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

function youtubeId(url) {
  const m = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([a-zA-Z0-9_-]{11})/
  );
  return m?.[1] ?? null;
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error(
    "MONGODB_URI is not set. Add it to .env.local, then run:\n  node scripts/seed-podcasts.mjs"
  );
  process.exit(1);
}

const episodes = JSON.parse(
  readFileSync(join(root, "data", "podcasts-seed.json"), "utf8")
);

const client = new MongoClient(uri);
await client.connect();
const col = client.db().collection("podcasts");

const base = Date.now();
let inserted = 0;
let skipped = 0;

const existingLinks = await col.find({}).project({ youtubeLink: 1 }).toArray();
const existingIds = new Set(
  existingLinks.map((d) => youtubeId(d.youtubeLink)).filter(Boolean)
);

for (let i = 0; i < episodes.length; i++) {
  const ep = episodes[i];
  const id = youtubeId(ep.youtubeLink);
  if (!id) {
    console.warn("Skip (no video id):", ep.youtubeLink);
    continue;
  }
  const canonical = `https://youtu.be/${id}`;
  if (existingIds.has(id)) {
    skipped++;
    console.log("Already in DB:", ep.title);
    continue;
  }
  await col.insertOne({
    title: ep.title,
    description: ep.description,
    youtubeLink: canonical,
    thumbnail: ep.thumbnail || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    createdAt: new Date(base - i * 120_000),
  });
  existingIds.add(id);
  inserted++;
  console.log("Inserted:", ep.title);
}

await client.close();
console.log(`Done. Inserted ${inserted}, skipped ${skipped}.`);
