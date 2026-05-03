import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import { getYoutubeThumbnail } from "@/lib/youtube";
import type { PodcastInput } from "@/models/podcast";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, context: Ctx) {
  const { id } = context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const db = await getDb();
  if (!db) return NextResponse.json(null, { status: 404 });
  const doc = await db.collection("podcasts").findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json(null, { status: 404 });
  return NextResponse.json({ ...doc, _id: doc._id.toString() });
}

export async function PATCH(req: NextRequest, context: Ctx) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await req.json()) as Partial<PodcastInput>;
  const update: Record<string, unknown> = {};

  if (body.title !== undefined) update.title = String(body.title).trim();
  if (body.description !== undefined) {
    update.description = String(body.description).trim();
  }
  if (body.youtubeLink !== undefined) {
    update.youtubeLink = String(body.youtubeLink).trim();
  }
  if (body.thumbnail !== undefined) {
    update.thumbnail = String(body.thumbnail).trim();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const link = (update.youtubeLink as string) || undefined;
  const existing = await db.collection("podcasts").findOne({ _id: new ObjectId(id) });
  const yt = link ?? (existing?.youtubeLink as string);
  if (yt && (!update.thumbnail || !(update.thumbnail as string))) {
    const auto = getYoutubeThumbnail(yt);
    if (auto) update.thumbnail = auto;
  }

  await db.collection("podcasts").updateOne({ _id: new ObjectId(id) }, { $set: update });
  const doc = await db.collection("podcasts").findOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ...doc, _id: doc?._id?.toString() });
}

export async function DELETE(_req: NextRequest, context: Ctx) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  await db.collection("podcasts").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
