/**
 * YouTube Data API v3 — latest uploads, stats.
 * Server-only; use YOUTUBE_API_KEY in env.
 */

import { getYouTubeRevalidateSeconds } from "@/lib/youtube-revalidate";

export type YouTubeApiVideo = {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  watchUrl: string;
  viewCount?: number;
  durationSeconds?: number;
  mediaWidth?: number;
  mediaHeight?: number;
};

export type YouTubeChannelStats = {
  title: string;
  customUrl?: string;
  subscriberCount?: number;
  viewCount?: number;
  videoCount?: number;
};

const API_BASE = "https://www.googleapis.com/youtube/v3";

function fetchNext(): RequestInit {
  const sec = getYouTubeRevalidateSeconds();
  return { next: { revalidate: sec } };
}

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

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return undefined;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseIso8601Duration(iso: string | undefined): number | undefined {
  if (!iso || typeof iso !== "string" || !iso.startsWith("PT")) return undefined;
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  const total = h * 3600 + min * 60 + s;
  return Number.isFinite(total) ? total : undefined;
}

function pickLargestThumbnailDimensions(snippet: {
  thumbnails?: Record<string, { width?: number; height?: number }>;
}): { w?: number; h?: number } {
  const t = snippet.thumbnails;
  if (!t) return {};
  let best = 0;
  let w: number | undefined;
  let h: number | undefined;
  for (const key of [
    "maxres",
    "standard",
    "high",
    "medium",
    "default",
  ] as const) {
    const thumb = t[key];
    const tw = thumb?.width;
    const th = thumb?.height;
    if (typeof tw === "number" && typeof th === "number" && tw > 0 && th > 0) {
      const area = tw * th;
      if (area > best) {
        best = area;
        w = tw;
        h = th;
      }
    }
  }
  return { w, h };
}

export async function enrichEpisodeCardsWithYouTubeVideoMetadata<
  T extends {
    videoId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishedAt: string;
    watchUrl: string;
    viewCount?: number;
    durationSeconds?: number;
    mediaWidth?: number;
    mediaHeight?: number;
  },
>(apiKey: string, episodes: T[]): Promise<T[]> {
  if (!apiKey.trim() || episodes.length === 0) return episodes;

  const byId = new Map<string, T>();
  for (const e of episodes) {
    byId.set(e.videoId, { ...e });
  }

  const idsList = Array.from(byId.keys());
  for (let i = 0; i < idsList.length; i += 50) {
    const chunk = idsList.slice(i, i + 50);
    const statsUrl = `${API_BASE}/videos?part=snippet,statistics,contentDetails&id=${encodeURIComponent(
      chunk.join(",")
    )}&key=${encodeURIComponent(apiKey)}`;
    const statsRes = await fetch(statsUrl, fetchNext());
    if (!statsRes.ok) continue;
    const statsJson = (await statsRes.json()) as {
      items?: Array<{
        id?: string;
        statistics?: { viewCount?: string };
        contentDetails?: { duration?: string };
        snippet?: {
          thumbnails?: Record<string, { width?: number; height?: number }>;
        };
      }>;
    };
    for (const it of statsJson.items ?? []) {
      const id = it.id;
      if (!id) continue;
      const row = byId.get(id);
      if (!row) continue;
      const views = toNumber(it.statistics?.viewCount);
      if (typeof views === "number") row.viewCount = views;
      const dur = parseIso8601Duration(it.contentDetails?.duration);
      if (typeof dur === "number") row.durationSeconds = dur;
      const dims = pickLargestThumbnailDimensions(it.snippet ?? {});
      if (typeof dims.w === "number" && typeof dims.h === "number") {
        row.mediaWidth = dims.w;
        row.mediaHeight = dims.h;
      }
    }
  }

  return episodes.map((e) => byId.get(e.videoId) ?? e);
}

export async function enrichEpisodeCardsWithViewCounts<
  T extends {
    videoId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishedAt: string;
    watchUrl: string;
    viewCount?: number;
    durationSeconds?: number;
    mediaWidth?: number;
    mediaHeight?: number;
  },
>(apiKey: string, episodes: T[]): Promise<T[]> {
  return enrichEpisodeCardsWithYouTubeVideoMetadata(apiKey, episodes);
}

async function playlistItemsFromUploadsId(
  apiKey: string,
  uploadsPlaylistId: string,
  maxResults: number
): Promise<YouTubeApiVideo[]> {
  const plUrl = `${API_BASE}/playlistItems?part=snippet&playlistId=${encodeURIComponent(
    uploadsPlaylistId
  )}&maxResults=${Math.min(maxResults, 50)}&key=${encodeURIComponent(apiKey)}`;

  const plRes = await fetch(plUrl, fetchNext());
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

async function resolveUploadsPlaylistId(
  apiKey: string,
  handle: string
): Promise<string | null> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim();
  if (channelId) {
    const url = `${API_BASE}/channels?part=contentDetails&id=${encodeURIComponent(
      channelId
    )}&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, fetchNext());
    if (res.ok) {
      const json = (await res.json()) as {
        items?: Array<{
          contentDetails?: { relatedPlaylists?: { uploads?: string } };
        }>;
      };
      const id =
        json.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
      if (id) return id;
    }
  }

  const clean = handle.replace(/^@/, "").trim();
  const handlesToTry = Array.from(
    new Set(
      [clean, "BHAW Namrata", "BhawnaMrata", "bhawnamrata", "BHAWNamrata"].filter(
        Boolean
      )
    )
  );

  for (const h of handlesToTry) {
    const chUrl = `${API_BASE}/channels?part=contentDetails&forHandle=${encodeURIComponent(
      h
    )}&key=${encodeURIComponent(apiKey)}`;
    const chRes = await fetch(chUrl, fetchNext());
    if (!chRes.ok) continue;
    const chJson = (await chRes.json()) as {
      items?: Array<{
        contentDetails?: { relatedPlaylists?: { uploads?: string } };
      }>;
    };
    const uploadsId =
      chJson.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (uploadsId) return uploadsId;
  }

  return null;
}

/**
 * @param handle Fallback handle without @ if YOUTUBE_CHANNEL_ID unset
 */
export async function fetchLatestYouTubeUploads(
  apiKey: string,
  handle: string,
  maxResults: number
): Promise<YouTubeApiVideo[]> {
  if (!apiKey.trim()) return [];

  const uploadsId = await resolveUploadsPlaylistId(apiKey, handle);
  if (!uploadsId) return [];

  return playlistItemsFromUploadsId(apiKey, uploadsId, maxResults);
}

/**
 * Fetch channel stats — prefers YOUTUBE_CHANNEL_ID, then handle variants.
 */
export async function fetchYouTubeChannelStats(
  apiKey: string,
  handle: string
): Promise<YouTubeChannelStats | null> {
  if (!apiKey.trim()) return null;

  const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim();
  if (channelId) {
    const url = `${API_BASE}/channels?part=snippet,statistics&id=${encodeURIComponent(
      channelId
    )}&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, fetchNext());
    if (res.ok) {
      const parsed = await parseChannelStats(res);
      if (parsed) return parsed;
    }
  }

  const clean = handle.replace(/^@/, "").trim();
  const handlesToTry = Array.from(
    new Set(
      [clean, "BHAW Namrata", "BhawnaMrata", "bhawnamrata", "BHAWNamrata"].filter(
        Boolean
      )
    )
  );

  for (const h of handlesToTry) {
    const url = `${API_BASE}/channels?part=snippet,statistics&forHandle=${encodeURIComponent(
      h
    )}&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, fetchNext());
    if (!res.ok) continue;
    const parsed = await parseChannelStats(res);
    if (parsed) return parsed;
  }

  return null;
}

async function parseChannelStats(
  res: Response
): Promise<YouTubeChannelStats | null> {
  const json = (await res.json()) as {
    items?: Array<{
      snippet?: { title?: string; customUrl?: string };
      statistics?: {
        subscriberCount?: string;
        viewCount?: string;
        videoCount?: string;
      };
    }>;
  };
  const item = json.items?.[0];
  if (!item) return null;
  return {
    title: item.snippet?.title ?? "Channel",
    customUrl: item.snippet?.customUrl,
    subscriberCount: toNumber(item.statistics?.subscriberCount),
    viewCount: toNumber(item.statistics?.viewCount),
    videoCount: toNumber(item.statistics?.videoCount),
  };
}
