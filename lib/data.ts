import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { getSeedPodcastApiRows } from "./podcasts-seed";
import { serializeDocument, serializeDocuments } from "./serialize";

export async function listPodcasts(limit?: number) {
  const db = await getDb();
  if (!db) {
    const rows = getSeedPodcastApiRows();
    const sliced = typeof limit === "number" && limit > 0 ? rows.slice(0, limit) : rows;
    return sliced.map((p) => ({
      id: p._id,
      title: p.title,
      description: p.description,
      youtubeLink: p.youtubeLink,
      thumbnail: p.thumbnail,
      createdAt: p.createdAt,
    }));
  }
  const cur = db
    .collection("podcasts")
    .find({})
    .sort({ createdAt: -1 });
  if (limit) cur.limit(limit);
  const docs = await cur.toArray();
  return serializeDocuments(docs);
}

export async function getBlogBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const doc = await db.collection("blogs").findOne({ slug });
  return serializeDocument(doc);
}

export async function listBlogs(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  const cur = db.collection("blogs").find({}).sort({ createdAt: -1 });
  if (limit) cur.limit(limit);
  return serializeDocuments(await cur.toArray());
}

export async function listTestimonials() {
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection("testimonials")
    .find({})
    .sort({ _id: -1 })
    .toArray();
  return serializeDocuments(docs);
}

export async function getPodcastById(id: string) {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;
  const doc = await db
    .collection("podcasts")
    .findOne({ _id: new ObjectId(id) });
  return serializeDocument(doc);
}

export async function getBlogById(id: string) {
  const db = await getDb();
  if (!db || !ObjectId.isValid(id)) return null;
  const doc = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
  return serializeDocument(doc);
}
