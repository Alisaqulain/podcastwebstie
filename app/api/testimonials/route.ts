import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import type { TestimonialInput } from "@/models/testimonial";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  if (!db) return NextResponse.json([]);
  const docs = await db
    .collection("testimonials")
    .find({})
    .sort({ _id: -1 })
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

  const body = (await req.json()) as TestimonialInput & { rating?: unknown };
  const { name, image, message } = body;
  let rating: number | undefined;
  const rawR = body.rating as unknown;
  if (rawR != null && rawR !== "") {
    const r = Number(rawR);
    if (Number.isFinite(r) && r >= 1 && r <= 5) rating = Math.round(r);
  }

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "name and message are required" },
      { status: 400 }
    );
  }

  const doc = {
    name: name.trim(),
    image: (image || "").trim(),
    message: message.trim(),
    ...(rating != null ? { rating } : {}),
  };

  const result = await db.collection("testimonials").insertOne(doc);
  return NextResponse.json({ ...doc, _id: result.insertedId.toString() });
}
