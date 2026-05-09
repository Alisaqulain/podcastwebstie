import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { getMaxUploadBytes } from "@/lib/media-paths";
import { saveOptimizedWebpImage } from "@/lib/process-local-image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin image upload → `public/uploads/images/{YYYY}/{MM}/{id}.webp`
 * Served statically at `/uploads/...` — optimized for VPS (Sharp, no CDN).
 */
export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const max = getMaxUploadBytes();
  if (file.size > max) {
    return NextResponse.json(
      {
        error: `File too large (max ${Math.round(max / 1024 / 1024)} MB). Set UPLOAD_MAX_MB if needed.`,
      },
      { status: 400 }
    );
  }

  const mime = file.type || "";
  if (!mime.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are supported on this endpoint" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await saveOptimizedWebpImage(buffer);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json(
      { error: "Image processing failed" },
      { status: 500 }
    );
  }
}
