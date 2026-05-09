import path from "node:path";
import fs from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import {
  ensureMediaDirs,
  extnameLower,
  getMaxVideoUploadBytes,
  isVideoExt,
  publicUrlFromFs,
  uniqueBaseName,
  yearMonthSubdir,
  SUBDIRS,
} from "@/lib/media-paths";
import {
  extractPreviewClip,
  extractThumbnail,
  ffmpegAvailable,
} from "@/lib/ffmpeg-transcode";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin video upload → public `/uploads/videos/...` + optional ffmpeg thumb + 30s mute preview.
 * Original also kept under `storage/podcasts/incoming/` for re-processing.
 */
export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  await ensureMediaDirs();

  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const max = getMaxVideoUploadBytes();
  if (file.size > max) {
    return NextResponse.json(
      {
        error: `Video too large (max ${Math.round(max / 1024 / 1024)} MB). Set UPLOAD_MAX_VIDEO_MB.`,
      },
      { status: 400 }
    );
  }

  const mime = file.type || "";
  if (!mime.startsWith("video/") && !mime.includes("quicktime")) {
    return NextResponse.json({ error: "Not a video file" }, { status: 400 });
  }

  const origName =
    file instanceof File && file.name ? file.name : "upload.mp4";
  const ext = extnameLower(origName);
  const safeExt = isVideoExt(ext) ? ext : ".mp4";

  const buffer = Buffer.from(await file.arrayBuffer());
  const base = uniqueBaseName();
  const ym = yearMonthSubdir();

  const incomingPath = path.join(SUBDIRS.incoming, `${base}${safeExt}`);
  await fs.mkdir(path.dirname(incomingPath), { recursive: true });
  await fs.writeFile(incomingPath, buffer);

  const videoDir = path.join(SUBDIRS.videos, ym);
  await fs.mkdir(videoDir, { recursive: true });
  const publicVideoPath = path.join(videoDir, `${base}${safeExt}`);
  await fs.copyFile(incomingPath, publicVideoPath);

  const thumbPath = path.join(SUBDIRS.thumbs, `${base}.jpg`);
  const previewPath = path.join(SUBDIRS.previews, `${base}_30s.mp4`);
  await fs.mkdir(SUBDIRS.thumbs, { recursive: true });
  await fs.mkdir(SUBDIRS.previews, { recursive: true });

  let thumbnailUrl: string | null = null;
  let previewUrl: string | null = null;
  let ffmpegOk = false;

  if (await ffmpegAvailable()) {
    const tOk = await extractThumbnail(publicVideoPath, thumbPath);
    const pOk = await extractPreviewClip(publicVideoPath, previewPath, 30);
    ffmpegOk = tOk && pOk;
    if (tOk) thumbnailUrl = publicUrlFromFs(thumbPath);
    if (pOk) previewUrl = publicUrlFromFs(previewPath);
  }

  const url = publicUrlFromFs(publicVideoPath);
  if (!url) {
    return NextResponse.json({ error: "Failed to map public URL" }, { status: 500 });
  }

  return NextResponse.json({
    url,
    thumbnailUrl,
    previewUrl,
    ffmpeg: ffmpegOk,
    message: ffmpegOk
      ? undefined
      : "ffmpeg not available or transcoding failed — install ffmpeg on the VPS and set FFMPEG_PATH if needed.",
  });
}
