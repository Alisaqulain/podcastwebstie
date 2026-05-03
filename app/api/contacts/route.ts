import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const db = await getDb();
  if (!db) return NextResponse.json([]);

  const docs = await db
    .collection("contacts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(
    docs.map((d) => ({ ...d, _id: d._id.toString() }))
  );
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Message could not be saved. Please try again later." },
      { status: 503 }
    );
  }

  const doc = {
    name: parsed.data.name.trim(),
    email: parsed.data.email.trim().toLowerCase(),
    message: parsed.data.message.trim(),
    createdAt: new Date(),
    read: false,
  };

  await db.collection("contacts").insertOne(doc);
  return NextResponse.json({ ok: true });
}
