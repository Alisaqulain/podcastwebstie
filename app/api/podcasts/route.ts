import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import { getYoutubeThumbnail } from "@/lib/youtube";
import type { PodcastInput } from "@/models/podcast";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const db = await getDb();
  if (!db) {
    return NextResponse.json([]);
  }
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit");
  const q = searchParams.get("q")?.trim();

  const filter = q
    ? {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  let cur = db
    .collection("podcasts")
    .find(filter)
    .sort({ createdAt: -1 });
  if (limit) {
    const n = parseInt(limit, 10);
    if (!Number.isNaN(n) && n > 0) cur = cur.limit(n);
  }
  const docs = await cur.toArray();
  return NextResponse.json(
    docs.map((d) => ({
      ...d,
      _id: d._id.toString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await req.json()) as PodcastInput;
  const {
    title,
    description,
    youtubeLink,
    thumbnail: thumbIn,
  } = body;

  if (!title?.trim() || !description?.trim() || !youtubeLink?.trim()) {
    return NextResponse.json(
      { error: "title, description, and youtubeLink are required" },
      { status: 400 }
    );
  }

  const autoThumb = getYoutubeThumbnail(youtubeLink);
  const thumbnail = thumbIn?.trim() || autoThumb || "";

  const doc = {
    title: title.trim(),
    description: description.trim(),
    youtubeLink: youtubeLink.trim(),
    thumbnail,
    createdAt: new Date(),
  };

  const result = await db.collection("podcasts").insertOne(doc);
  return NextResponse.json({
    ...doc,
    _id: result.insertedId.toString(),
  });
}
