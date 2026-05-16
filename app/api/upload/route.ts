import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { getMaxUploadBytes } from "@/lib/media-paths";
import { saveOptimizedWebpImage } from "@/lib/process-local-image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/** Large images + Sharp on VPS */
export const maxDuration = 60;

/**
 * Admin image upload → `public/uploads/images/{YYYY}/{MM}/{id}.webp`
 * Served statically at `/uploads/...` — optimized for VPS (Sharp, no CDN).
 */
export async function POST(req: NextRequest) {
  try {
    return await handleUpload(req);
  } catch (e) {
    console.error("[upload] unhandled", e);
    return NextResponse.json(
      { error: "Upload failed on server. Check logs (Sharp, disk permissions)." },
      { status: 500 }
    );
  }
}

async function handleUpload(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      {
        error:
          "Image uploads need a VPS (writable public/uploads). Serverless hosting cannot store files on disk.",
      },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (e) {
    console.error("[upload] formData", e);
    return NextResponse.json(
      {
        error:
          "Could not read upload body. If the file is large, increase nginx client_max_body_size.",
      },
      { status: 400 }
    );
  }

  const formData = form;
  const file = formData.get("file");

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
    const message =
      e instanceof Error ? e.message : "Image processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
