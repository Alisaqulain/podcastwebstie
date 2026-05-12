/**
 * YouTube public Atom feeds — no API key required.
 * @see https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
 */

import { getYouTubeRevalidateSeconds } from "@/lib/youtube-revalidate";

export type RssVideoRow = {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  watchUrl: string;
};

function rssFetchInit(): RequestInit {
  const sec = getYouTubeRevalidateSeconds();
  return {
    next: { revalidate: sec },
    headers: {
      Accept: "application/atom+xml,application/xml;q=0.9,text/xml;q=0.8,*/*;q=0.7",
    },
  };
}

function channelPageFetchInit(): RequestInit {
  return {
    next: { revalidate: 86_400 },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  };
}

function decodeBasicEntities(input: string): string {
  return input
    .replace(/&(#39|apos);/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function stripCDATA(raw: string): string {
  const m = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return (m?.[1] ?? raw).trim();
}

/**
 * Reads `YOUTUBE_CHANNEL_ID` when set to a valid UC… id; otherwise resolves from `@handle` HTML.
 */
export async function resolveChannelIdFromEnvOrHandle(
  handle: string
): Promise<string | null> {
  const fromEnv = process.env.YOUTUBE_CHANNEL_ID?.trim();
  if (fromEnv && /^UC[a-zA-Z0-9_-]{22}$/.test(fromEnv)) return fromEnv;
  return resolveChannelIdFromHandle(handle);
}

/** Scrapes the public channel page for `"channelId":"UC…"`. Cached ~24h. */
export async function resolveChannelIdFromHandle(
  handle: string
): Promise<string | null> {
  const clean = handle.replace(/^@/, "").trim();
  if (!clean) return null;
  try {
    const url = `https://www.youtube.com/@${encodeURIComponent(clean)}`;
    const res = await fetch(url, channelPageFetchInit());
    if (!res.ok) return null;
    const html = await res.text();
    const patterns = [
      /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
      /"externalId":"(UC[a-zA-Z0-9_-]{22})"/,
      /youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/,
      /browse_id\":\"(UC[a-zA-Z0-9_-]{22})\"/,
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m?.[1]) return m[1];
    }
    return null;
  } catch {
    return null;
  }
}

function parseAtomEntries(xml: string, maxResults: number): RssVideoRow[] {
  const out: RssVideoRow[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(xml)) !== null) {
    const entry = m[1];
    const vidMatch =
      entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i) ||
      entry.match(/yt:video:([^<\s]+)/i);
    const videoId = vidMatch?.[1]?.trim();
    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) continue;

    const rawTitle = entry.match(/<title(?:[^>]*)>([\s\S]*?)<\/title>/i)?.[1];
    const title = decodeBasicEntities(
      stripCDATA((rawTitle ?? "Episode").trim())
    );

    const published =
      entry.match(/<published>([^<]+)<\/published>/i)?.[1]?.trim() ??
      new Date().toISOString();

    let description = "";
    const mediaDesc = entry.match(
      /<media:description[^>]*>([\s\S]*?)<\/media:description>/i
    );
    if (mediaDesc?.[1]) {
      description = decodeBasicEntities(stripCDATA(mediaDesc[1].trim()));
    }

    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const thumbUrlMatch =
      entry.match(/<media:thumbnail[^>]+url="([^"]+)"/i) ||
      entry.match(/url="(https:\/\/i\.ytimg\.com\/[^"]+)"/i);
    if (thumbUrlMatch?.[1]) thumbnailUrl = thumbUrlMatch[1];

    out.push({
      videoId,
      title,
      description,
      thumbnailUrl,
      publishedAt: published,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    });
    if (out.length >= maxResults) break;
  }
  return out;
}

/** Latest public uploads for a channel via Atom feed (typically up to 15 entries per request). */
export async function fetchLatestUploadsFromRss(
  channelId: string,
  maxResults: number
): Promise<RssVideoRow[]> {
  const capped = Math.min(Math.max(maxResults, 1), 50);
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
    channelId
  )}`;
  try {
    const res = await fetch(feedUrl, rssFetchInit());
    if (!res.ok) return [];
    const xml = await res.text();
    return parseAtomEntries(xml, capped);
  } catch {
    return [];
  }
}
