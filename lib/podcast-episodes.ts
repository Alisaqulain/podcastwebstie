import { getDb } from "@/lib/mongodb";
import { getSeedPodcastApiRows } from "@/lib/podcasts-seed";
import { getYoutubeVideoId } from "@/lib/youtube";
import { fetchLatestYouTubeUploads } from "@/lib/youtube-data-api";
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

/**
 * Latest episodes for marketing surfaces: YouTube API → MongoDB → in-repo seed.
 */
export async function getLatestPodcastEpisodesForHome(
  limit = 6
): Promise<PodcastEpisodeCard[]> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (apiKey) {
    const apiRows = await fetchLatestYouTubeUploads(
      apiKey,
      DEFAULT_HANDLE,
      limit
    );
    if (apiRows.length > 0) {
      return mergeLocalPreviewsFromDb(fromYouTubeApi(apiRows));
    }
  }

  const dbRows = await fromDatabase(limit);
  if (dbRows.length > 0) return dbRows;

  return fromSeed(limit);
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
