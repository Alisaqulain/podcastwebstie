import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import { listPodcastsPublic } from "@/lib/list-podcasts-public";
import { getYoutubeThumbnail } from "@/lib/youtube";
import type { PodcastInput } from "@/models/podcast";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limitRaw = searchParams.get("limit");
  const limit = limitRaw ? parseInt(limitRaw, 10) : undefined;
  const q = searchParams.get("q")?.trim();

  const rows = await listPodcastsPublic({
    q: q || undefined,
    limit:
      typeof limit === "number" && !Number.isNaN(limit) && limit > 0
        ? limit
        : undefined,
  });

  return NextResponse.json(rows);
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
    localPreviewUrl: previewIn,
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
    ...(previewIn?.trim()
      ? { localPreviewUrl: previewIn.trim() }
      : {}),
    createdAt: new Date(),
  };

  const result = await db.collection("podcasts").insertOne(doc);
  return NextResponse.json({
    ...doc,
    _id: result.insertedId.toString(),
  });
}
