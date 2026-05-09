import path from "node:path";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";

const cwd = process.cwd();

/** Public web root for static files (served at /uploads/...) */
export const PUBLIC_UPLOADS_DIR = path.join(cwd, "public", "uploads");

/** Private working / raw uploads (not directly URL-mapped) */
export const STORAGE_PODCASTS_DIR = path.join(cwd, "storage", "podcasts");

export const SUBDIRS = {
  images: path.join(PUBLIC_UPLOADS_DIR, "images"),
  videos: path.join(PUBLIC_UPLOADS_DIR, "videos"),
  previews: path.join(PUBLIC_UPLOADS_DIR, "podcasts", "previews"),
  thumbs: path.join(PUBLIC_UPLOADS_DIR, "podcasts", "thumbs"),
  incoming: path.join(STORAGE_PODCASTS_DIR, "incoming"),
} as const;

export function publicUrlFromFs(
  absolutePath: string
): string | null {
  const rel = path.relative(PUBLIC_UPLOADS_DIR, absolutePath);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return `/uploads/${rel.split(path.sep).join("/")}`;
}

export async function ensureMediaDirs(): Promise<void> {
  for (const p of [
    ...Object.values(SUBDIRS),
    STORAGE_PODCASTS_DIR,
  ]) {
    await fs.mkdir(p, { recursive: true });
  }
}

export function extnameLower(name: string): string {
  const n = path.extname(name).toLowerCase();
  return n || "";
}

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);

export function isImageExt(ext: string): boolean {
  return IMAGE_EXT.has(ext.toLowerCase());
}

export function isVideoExt(ext: string): boolean {
  return VIDEO_EXT.has(ext.toLowerCase());
}

export function yearMonthSubdir(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}/${m}`;
}

export function uniqueBaseName(): string {
  return randomBytes(12).toString("hex");
}

export function getMaxUploadBytes(): number {
  const mb = parseInt(process.env.UPLOAD_MAX_MB || "25", 10);
  return (Number.isFinite(mb) && mb > 0 ? Math.min(mb, 200) : 25) * 1024 * 1024;
}

/** Video uploads (admin) — larger cap for VPS */
export function getMaxVideoUploadBytes(): number {
  const mb = parseInt(process.env.UPLOAD_MAX_VIDEO_MB || "120", 10);
  return (Number.isFinite(mb) && mb > 0 ? Math.min(mb, 500) : 120) * 1024 * 1024;
}
