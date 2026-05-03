import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import { ensureUniqueBlogSlug } from "@/lib/blog-slug";
import type { BlogInput } from "@/models/blog";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function GET(_req: NextRequest, context: Ctx) {
  const { id } = context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const db = await getDb();
  if (!db) return NextResponse.json(null, { status: 404 });
  const doc = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
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

  const oid = new ObjectId(id);
  const existing = await db.collection("blogs").findOne({ _id: oid });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await req.json()) as Partial<BlogInput> & { slug?: string };
  const update: Record<string, unknown> = {};

  if (body.title !== undefined) update.title = String(body.title).trim();
  if (body.content !== undefined) update.content = body.content;
  if (body.coverImage !== undefined) {
    update.coverImage = String(body.coverImage).trim();
  }
  if (body.seoTitle !== undefined) {
    update.seoTitle = String(body.seoTitle).trim();
  }
  if (body.seoDescription !== undefined) {
    update.seoDescription = String(body.seoDescription).trim();
  }

  if (body.slug !== undefined || body.title !== undefined) {
    const title = (update.title as string) || (existing.title as string);
    const slug = await ensureUniqueBlogSlug(
      db,
      title,
      body.slug !== undefined ? String(body.slug) : undefined,
      oid
    );
    update.slug = slug;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  await db.collection("blogs").updateOne({ _id: oid }, { $set: update });
  const doc = await db.collection("blogs").findOne({ _id: oid });
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

  await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
