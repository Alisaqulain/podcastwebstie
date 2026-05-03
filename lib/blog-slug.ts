import type { Db } from "mongodb";
import { ObjectId } from "mongodb";
import { slugify } from "./utils";

export async function ensureUniqueBlogSlug(
  db: Db,
  title: string,
  preferredSlug?: string,
  excludeId?: ObjectId
): Promise<string> {
  const base = slugify(preferredSlug?.trim() || title) || "post";
  let slug = base;
  let n = 0;

  while (true) {
    const filter: Record<string, unknown> = { slug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const exists = await db.collection("blogs").findOne(filter);
    if (!exists) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}
