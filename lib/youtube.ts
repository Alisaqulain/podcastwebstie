/**
 * Extract YouTube video ID from common URL formats for embeds.
 */
export function getYoutubeVideoId(url: string): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function getYoutubeThumbnail(url: string): string | null {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

const PREVIEW_SECONDS = 30;

/** Muted embed for ~30s hover/viewport preview (YouTube iframe — no MP4 hosting required). */
export function youtubeShortPreviewEmbedSrc(
  videoId: string,
  autoplay: boolean
): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: "1",
    controls: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    iv_load_policy: "3",
    disablekb: "1",
    start: "0",
    end: String(PREVIEW_SECONDS),
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export { PREVIEW_SECONDS as YOUTUBE_PREVIEW_CLIP_SECONDS };

/** Server utilities — re-export for `@/lib/youtube` single entry */
export {
  fetchLatestYouTubeUploads,
  fetchYouTubeChannelStats,
} from "@/lib/youtube-data-api";
export type {
  YouTubeApiVideo,
  YouTubeChannelStats,
} from "@/lib/youtube-data-api";
