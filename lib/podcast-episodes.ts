import { getDb } from "@/lib/mongodb";
import { getSeedPodcastApiRows } from "@/lib/podcasts-seed";
import { getYoutubeVideoId } from "@/lib/youtube";
import {
  enrichEpisodeCardsWithYouTubeVideoMetadata,
  fetchLatestYouTubeUploads,
} from "@/lib/youtube-data-api";
import { filterLongFormLandscapeEpisodes } from "@/lib/youtube-episode-eligibility";
import {
  fetchLatestUploadsFromRss,
  resolveChannelIdFromEnvOrHandle,
} from "@/lib/youtube-rss";
import { serializeDocuments } from "@/lib/serialize";
import type { PodcastApi } from "@/components/podcast/podcast-directory";
import type { Podcast } from "@/models/podcast";

export type PodcastEpisodeCard = {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  watchUrl: string;
  viewCount?: number;
  /** Length in seconds — RSS `media:content` or Data API `contentDetails.duration`. */
  durationSeconds?: number;
  /** Frame / thumbnail width for orientation checks (RSS or API). */
  mediaWidth?: number;
  mediaHeight?: number;
  /** Local ffmpeg-generated preview (preferred over YouTube iframe when set). */
  localPreviewUrl?: string;
};

const DEFAULT_HANDLE =
  process.env.YOUTUBE_CHANNEL_HANDLE?.trim() || "bhawnamrata";

function truncateDescription(text: string, max = 150): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function fromYouTubeApi(
  rows: Awaited<ReturnType<typeof fetchLatestYouTubeUploads>>
): PodcastEpisodeCard[] {
  return rows.map((r) => ({
    id: `yt-${r.videoId}`,
    videoId: r.videoId,
    title: r.title,
    description: truncateDescription(r.description),
    thumbnailUrl: r.thumbnailUrl,
    publishedAt: r.publishedAt,
    watchUrl: r.watchUrl,
    viewCount: r.viewCount,
  }));
}

function fromRss(
  rows: Awaited<ReturnType<typeof fetchLatestUploadsFromRss>>
): PodcastEpisodeCard[] {
  return rows.map((r) => ({
    id: `yt-${r.videoId}`,
    videoId: r.videoId,
    title: r.title,
    description: truncateDescription(r.description),
    thumbnailUrl: r.thumbnailUrl,
    publishedAt: r.publishedAt,
    watchUrl: r.watchUrl,
    ...(typeof r.durationSeconds === "number"
      ? { durationSeconds: r.durationSeconds }
      : {}),
    ...(typeof r.mediaWidth === "number" && typeof r.mediaHeight === "number"
      ? { mediaWidth: r.mediaWidth, mediaHeight: r.mediaHeight }
      : {}),
  }));
}

function fromPodcastApiRows(rows: PodcastApi[]): PodcastEpisodeCard[] {
  return rows
    .map((r, i) => {
      const videoId = getYoutubeVideoId(r.youtubeLink);
      if (!videoId) return null;
      const localPreview = r.localPreviewUrl?.trim();
      return {
        id: r._id || `db-${i}`,
        videoId,
        title: r.title,
        description: truncateDescription(r.description),
        thumbnailUrl:
          r.thumbnail?.trim() ||
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        publishedAt:
          typeof r.createdAt === "string"
            ? r.createdAt
            : r.createdAt
              ? new Date(r.createdAt).toISOString()
              : new Date().toISOString(),
        watchUrl: r.youtubeLink.trim(),
        ...(localPreview ? { localPreviewUrl: localPreview } : {}),
      } satisfies PodcastEpisodeCard;
    })
    .filter(Boolean) as PodcastEpisodeCard[];
}

async function mergeLocalPreviewsFromDb(
  episodes: PodcastEpisodeCard[]
): Promise<PodcastEpisodeCard[]> {
  const db = await getDb();
  if (!db || episodes.length === 0) return episodes;

  const docs = await db
    .collection<Podcast>("podcasts")
    .find({
      localPreviewUrl: { $exists: true, $nin: [""] },
    })
    .project({ youtubeLink: 1, localPreviewUrl: 1 })
    .toArray();

  const byVideoId = new Map<string, string>();
  for (const d of docs) {
    const prev = d.localPreviewUrl?.trim();
    const vid = d.youtubeLink ? getYoutubeVideoId(d.youtubeLink) : null;
    if (vid && prev) byVideoId.set(vid, prev);
  }

  return episodes.map((e) => {
    const local = byVideoId.get(e.videoId);
    return local ? { ...e, localPreviewUrl: local } : e;
  });
}

async function fromDatabase(limit: number): Promise<PodcastEpisodeCard[]> {
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection<Podcast>("podcasts")
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  const serialized = serializeDocuments(docs);
  const rows: PodcastApi[] = serialized.map((d) => {
    const created = d.createdAt;
    const lp = (d as { localPreviewUrl?: string }).localPreviewUrl;
    return {
      _id: String(d.id ?? ""),
      title: String(d.title ?? ""),
      description: String(d.description ?? ""),
      youtubeLink: String(d.youtubeLink ?? ""),
      thumbnail: d.thumbnail ? String(d.thumbnail) : "",
      ...(lp?.trim() ? { localPreviewUrl: lp.trim() } : {}),
      createdAt:
        created instanceof Date
          ? created.toISOString()
          : created
            ? new Date(created as string).toISOString()
            : undefined,
    };
  });
  return fromPodcastApiRows(rows);
}

function fromSeed(limit: number): PodcastEpisodeCard[] {
  return fromPodcastApiRows(getSeedPodcastApiRows().slice(0, limit));
}

function mergeEpisodesByVideoId(
  primary: PodcastEpisodeCard[],
  secondary: PodcastEpisodeCard[]
): PodcastEpisodeCard[] {
  const map = new Map<string, PodcastEpisodeCard>();
  for (const e of primary) {
    map.set(e.videoId, e);
  }
  for (const e of secondary) {
    const prev = map.get(e.videoId);
    if (!prev) {
      map.set(e.videoId, e);
      continue;
    }
    map.set(e.videoId, {
      ...prev,
      ...e,
      durationSeconds: e.durationSeconds ?? prev.durationSeconds,
      mediaWidth: e.mediaWidth ?? prev.mediaWidth,
      mediaHeight: e.mediaHeight ?? prev.mediaHeight,
      viewCount: e.viewCount ?? prev.viewCount,
    });
  }
  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Latest episodes: YouTube RSS + optional Data API merge → metadata enrichment →
 * long-form landscape filter → MongoDB → in-repo seed.
 */
export async function getLatestPodcastEpisodesForHome(
  limit = 6
): Promise<PodcastEpisodeCard[]> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  const channelId = await resolveChannelIdFromEnvOrHandle(DEFAULT_HANDLE);
  const fetchCap = Math.min(50, Math.max(limit * 4, 24));

  let rssCards: PodcastEpisodeCard[] = [];
  if (channelId) {
    const rssRows = await fetchLatestUploadsFromRss(channelId, fetchCap);
    if (rssRows.length > 0) rssCards = fromRss(rssRows);
  }

  let apiCards: PodcastEpisodeCard[] = [];
  if (apiKey) {
    const apiRows = await fetchLatestYouTubeUploads(
      apiKey,
      DEFAULT_HANDLE,
      fetchCap
    );
    if (apiRows.length > 0) apiCards = fromYouTubeApi(apiRows);
  }

  let candidates = mergeEpisodesByVideoId(rssCards, apiCards);

  if (candidates.length === 0) {
    if (apiKey) {
      const apiRows = await fetchLatestYouTubeUploads(
        apiKey,
        DEFAULT_HANDLE,
        fetchCap
      );
      if (apiRows.length > 0) {
        candidates = fromYouTubeApi(apiRows);
      }
    }
  }

  if (candidates.length === 0) {
    const dbRows = await fromDatabase(fetchCap);
    if (dbRows.length > 0) {
      candidates = dbRows;
    } else {
      candidates = fromSeed(fetchCap);
    }
  }

  candidates = await mergeLocalPreviewsFromDb(candidates);
  if (apiKey) {
    candidates = await enrichEpisodeCardsWithYouTubeVideoMetadata(
      apiKey,
      candidates
    );
  }
  candidates = filterLongFormLandscapeEpisodes(candidates);
  return candidates.slice(0, limit);
}

export function podcastEpisodesVideoObjectJsonLd(
  episodes: PodcastEpisodeCard[],
  siteUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest Conversations — BhawnaMrata Podcast",
    numberOfItems: episodes.length,
    itemListElement: episodes.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: e.title,
        description: e.description,
        thumbnailUrl: e.thumbnailUrl,
        uploadDate: e.publishedAt,
        embedUrl: `https://www.youtube.com/embed/${e.videoId}`,
        contentUrl: e.watchUrl,
        publisher: {
          "@type": "Organization",
          name: "BhawnaMrata",
          url: siteUrl,
        },
      },
    })),
  };
}
