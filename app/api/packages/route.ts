import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getDb } from "@/lib/mongodb";
import { requireAdminSession } from "@/lib/api-auth";
import { authOptions } from "@/lib/auth";
import type { PackageInput } from "@/models/package";
import { getSeedPackagesPublic } from "@/lib/packages-seed";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  if (!db) return NextResponse.json(getSeedPackagesPublic());

  const session = await getServerSession(authOptions);
  const isAdmin = Boolean(session?.user?.email);
  const filter = isAdmin ? {} : { active: true };

  const docs = await db
    .collection("packages")
    .find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .toArray();

  if (docs.length === 0 && !isAdmin) {
    return NextResponse.json(getSeedPackagesPublic());
  }

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

  const body = (await req.json()) as Partial<PackageInput>;
  const title = body.title?.trim();
  const description = (body.description ?? "").trim();
  const price = Number(body.price);
  const discountPrice =
    body.discountPrice != null ? Number(body.discountPrice) : null;

  if (!title || !Number.isFinite(price) || price < 100) {
    return NextResponse.json(
      { error: "title and valid price (paise, min 100) required" },
      { status: 400 }
    );
  }

  const features = Array.isArray(body.features)
    ? body.features.map((f) => String(f).trim()).filter(Boolean)
    : [];

  const doc = {
    title,
    description,
    price: Math.round(price),
    discountPrice:
      discountPrice != null && Number.isFinite(discountPrice) && discountPrice > 0
        ? Math.round(discountPrice)
        : null,
    features,
    badge: body.badge?.trim() || "",
    active: body.active !== false,
    sortOrder: Number.isFinite(Number(body.sortOrder))
      ? Math.round(Number(body.sortOrder))
      : Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("packages").insertOne(doc);
  return NextResponse.json({ ...doc, _id: result.insertedId.toString() });
}
