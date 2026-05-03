import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";

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

  const body = await req.json().catch(() => ({}));
  const read = body.read;

  if (typeof read !== "boolean") {
    return NextResponse.json({ error: "read boolean required" }, { status: 400 });
  }

  await db
    .collection("contacts")
    .updateOne({ _id: new ObjectId(id) }, { $set: { read } });

  const doc = await db.collection("contacts").findOne({ _id: new ObjectId(id) });
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

  await db.collection("contacts").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
