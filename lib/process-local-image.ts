import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";
import {
  ensureMediaDirs,
  publicUrlFromFs,
  uniqueBaseName,
  yearMonthSubdir,
  SUBDIRS,
} from "@/lib/media-paths";

const MAX_EDGE = 2400;

export async function saveOptimizedWebpImage(
  buffer: Buffer
): Promise<{ absolutePath: string; url: string }> {
  await ensureMediaDirs();
  const ym = yearMonthSubdir();
  const dir = path.join(SUBDIRS.images, ym);
  await fs.mkdir(dir, { recursive: true });
  const base = uniqueBaseName();
  const outPath = path.join(dir, `${base}.webp`);

  await sharp(buffer)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 4 })
    .toFile(outPath);

  const url = publicUrlFromFs(outPath);
  if (!url) throw new Error("Invalid output path");
  return { absolutePath: outPath, url };
}
