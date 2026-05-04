import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import type { PackageInput } from "@/models/package";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = (await req.json()) as Partial<PackageInput>;
  const $set: Record<string, unknown> = { updatedAt: new Date() };

  if (body.title != null) $set.title = body.title.trim();
  if (body.description != null) $set.description = body.description.trim();
  if (body.price != null) {
    const p = Number(body.price);
    if (!Number.isFinite(p) || p < 100) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    $set.price = Math.round(p);
  }
  if (body.discountPrice !== undefined) {
    if (body.discountPrice === null) {
      $set.discountPrice = null;
    } else {
      const d = Number(body.discountPrice);
      $set.discountPrice =
        Number.isFinite(d) && d > 0 ? Math.round(d) : null;
    }
  }
  if (body.features != null) {
    $set.features = Array.isArray(body.features)
      ? body.features.map((f) => String(f).trim()).filter(Boolean)
      : [];
  }
  if (body.badge !== undefined) $set.badge = body.badge?.trim() || "";
  if (body.active !== undefined) $set.active = Boolean(body.active);
  if (body.sortOrder != null) {
    $set.sortOrder = Math.round(Number(body.sortOrder));
  }

  const result = await db
    .collection("packages")
    .updateOne({ _id: new ObjectId(id) }, { $set });

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const doc = await db.collection("packages").findOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ...doc, _id: doc!._id!.toString() });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const result = await db.collection("packages").deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
