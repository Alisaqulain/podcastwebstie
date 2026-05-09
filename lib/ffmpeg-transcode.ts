import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export function ffmpegBin(): string {
  return process.env.FFMPEG_PATH?.trim() || "ffmpeg";
}

export async function ffmpegAvailable(): Promise<boolean> {
  try {
    await execFileAsync(ffmpegBin(), ["-version"], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/** Poster frame ~2s into the video */
export async function extractThumbnail(
  inputPath: string,
  outputJpgPath: string
): Promise<boolean> {
  try {
    await execFileAsync(
      ffmpegBin(),
      [
        "-y",
        "-ss",
        "2",
        "-i",
        inputPath,
        "-vframes",
        "1",
        "-q:v",
        "3",
        "-vf",
        "scale=1280:-2",
        outputJpgPath,
      ],
      { timeout: 180_000, maxBuffer: 10 * 1024 * 1024 }
    );
    return true;
  } catch (e) {
    console.warn("[ffmpeg] thumbnail failed", e);
    return false;
  }
}

/** Short muted H.264 preview for cards / VPS hosting */
export async function extractPreviewClip(
  inputPath: string,
  outputMp4Path: string,
  durationSec = 30
): Promise<boolean> {
  try {
    await execFileAsync(
      ffmpegBin(),
      [
        "-y",
        "-i",
        inputPath,
        "-t",
        String(durationSec),
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "26",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        outputMp4Path,
      ],
      { timeout: 600_000, maxBuffer: 10 * 1024 * 1024 }
    );
    return true;
  } catch (e) {
    console.warn("[ffmpeg] preview clip failed", e);
    return false;
  }
}
