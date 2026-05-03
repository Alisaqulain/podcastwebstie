import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import { ensureUniqueBlogSlug } from "@/lib/blog-slug";
import type { BlogInput } from "@/models/blog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const db = await getDb();
  if (!db) return NextResponse.json([]);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const filter = q
    ? {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { seoTitle: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const docs = await db
    .collection("blogs")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(
    docs.map((d) => ({ ...d, _id: d._id.toString() }))
  );
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await req.json()) as BlogInput & { slug?: string };
  const {
    title,
    content,
    coverImage,
    slug: slugInput,
    seoTitle,
    seoDescription,
  } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "title and content are required" },
      { status: 400 }
    );
  }

  const slug = await ensureUniqueBlogSlug(db, title, slugInput);

  const doc = {
    title: title.trim(),
    content,
    coverImage: (coverImage || "").trim(),
    slug,
    seoTitle: (seoTitle || title).trim(),
    seoDescription: (seoDescription || "").trim(),
    createdAt: new Date(),
  };

  const result = await db.collection("blogs").insertOne(doc);
  return NextResponse.json({ ...doc, _id: result.insertedId.toString() });
}
