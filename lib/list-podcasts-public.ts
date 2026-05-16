import type { PodcastApi } from "@/components/podcast/podcast-directory";
import { getDb } from "@/lib/mongodb";
import { getSeedPodcastApiRows } from "@/lib/podcasts-seed";

function filterSeed(
  rows: PodcastApi[],
  q?: string,
  limit?: number
): PodcastApi[] {
  let out = rows;
  if (q) {
    const needle = q.toLowerCase();
    out = out.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle)
    );
  }
  if (typeof limit === "number" && limit > 0) {
    out = out.slice(0, limit);
  }
  return out;
}

function mapDoc(d: {
  _id: { toString(): string };
  title?: unknown;
  description?: unknown;
  youtubeLink?: unknown;
  thumbnail?: unknown;
  localPreviewUrl?: unknown;
  createdAt?: unknown;
}): PodcastApi {
  return {
    _id: d._id.toString(),
    title: String(d.title ?? ""),
    description: String(d.description ?? ""),
    youtubeLink: String(d.youtubeLink ?? ""),
    thumbnail: String(d.thumbnail ?? ""),
    localPreviewUrl:
      typeof d.localPreviewUrl === "string"
        ? d.localPreviewUrl.trim() || undefined
        : undefined,
    createdAt: d.createdAt
      ? new Date(d.createdAt as Date).toISOString()
      : undefined,
  };
}

/** Public podcast list — MongoDB when populated, otherwise in-repo seed (works on localhost). */
export async function listPodcastsPublic(opts?: {
  q?: string;
  limit?: number;
}): Promise<PodcastApi[]> {
  const q = opts?.q?.trim();
  const limit = opts?.limit;
  const seed = getSeedPodcastApiRows();

  const db = await getDb();
  if (!db) {
    return filterSeed(seed, q, limit);
  }

  const filter = q
    ? {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  let cur = db.collection("podcasts").find(filter).sort({ createdAt: -1 });
  if (typeof limit === "number" && limit > 0) {
    cur = cur.limit(limit);
  }
  const docs = await cur.toArray();

  if (docs.length === 0) {
    return filterSeed(seed, q, limit);
  }

  return docs.map((d) => mapDoc(d));
}
