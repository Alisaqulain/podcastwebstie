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
