/** ISR / fetch cache for YouTube API — seconds (default 5 min for fresher auto-sync). */
export function getYouTubeRevalidateSeconds(): number {
  const raw = process.env.YOUTUBE_REVALIDATE_SECONDS?.trim();
  if (!raw) return 300;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 60 ? Math.min(n, 3600) : 300;
}
