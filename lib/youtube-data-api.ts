/**
 * YouTube Data API v3 — fetch latest uploads for a channel handle.
 * Server-only; use YOUTUBE_API_KEY in env.
 */

export type YouTubeApiVideo = {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  watchUrl: string;
};

const API_BASE = "https://www.googleapis.com/youtube/v3";

function pickThumbnail(snippet: {
  thumbnails?: Record<string, { url?: string }>;
}): string {
  const t = snippet.thumbnails;
  return (
    t?.maxres?.url ||
    t?.standard?.url ||
    t?.high?.url ||
    t?.medium?.url ||
    t?.default?.url ||
    ""
  );
}

/**
 * @param handle Channel handle without @ (e.g. BHAWNamrata)
 */
export async function fetchLatestYouTubeUploads(
  apiKey: string,
  handle: string,
  maxResults: number
): Promise<YouTubeApiVideo[]> {
  const clean = handle.replace(/^@/, "").trim();
  if (!clean || !apiKey.trim()) return [];

  const chUrl = `${API_BASE}/channels?part=contentDetails&forHandle=${encodeURIComponent(
    clean
  )}&key=${encodeURIComponent(apiKey)}`;

  const chRes = await fetch(chUrl, { next: { revalidate: 3600 } });
  if (!chRes.ok) return [];

  const chJson = (await chRes.json()) as {
    items?: Array<{
      contentDetails?: { relatedPlaylists?: { uploads?: string } };
    }>;
  };

  const uploadsId = chJson.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) return [];

  const plUrl = `${API_BASE}/playlistItems?part=snippet&playlistId=${encodeURIComponent(
    uploadsId
  )}&maxResults=${Math.min(maxResults, 50)}&key=${encodeURIComponent(apiKey)}`;

  const plRes = await fetch(plUrl, { next: { revalidate: 3600 } });
  if (!plRes.ok) return [];

  const plJson = (await plRes.json()) as {
    items?: Array<{
      snippet?: {
        title?: string;
        description?: string;
        publishedAt?: string;
        resourceId?: { videoId?: string };
        thumbnails?: Record<string, { url?: string }>;
      };
    }>;
  };

  const out: YouTubeApiVideo[] = [];
  for (const row of plJson.items ?? []) {
    const s = row.snippet;
    const videoId = s?.resourceId?.videoId;
    if (!videoId || !s?.title) continue;
    out.push({
      videoId,
      title: s.title,
      description: (s.description ?? "").trim(),
      thumbnailUrl:
        pickThumbnail(s) ||
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      publishedAt: s.publishedAt ?? new Date().toISOString(),
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }
  return out;
}
