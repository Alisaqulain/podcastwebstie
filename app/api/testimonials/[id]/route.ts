import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import type { TestimonialInput } from "@/models/testimonial";

export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

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

  const body = (await req.json()) as Partial<TestimonialInput>;
  const update: Record<string, unknown> = {};

  if (body.name !== undefined) update.name = String(body.name).trim();
  if (body.image !== undefined) update.image = String(body.image).trim();
  if (body.message !== undefined) update.message = String(body.message).trim();
  if (body.rating !== undefined) {
    if (body.rating === null) {
      update.rating = null;
    } else {
      const r = Number(body.rating);
      if (Number.isFinite(r) && r >= 1 && r <= 5) {
        update.rating = Math.round(r);
      }
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  await db
    .collection("testimonials")
    .updateOne({ _id: new ObjectId(id) }, { $set: update });

  const doc = await db
    .collection("testimonials")
    .findOne({ _id: new ObjectId(id) });
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

  await db.collection("testimonials").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
