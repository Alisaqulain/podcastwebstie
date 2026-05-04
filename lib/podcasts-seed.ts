import podcastsSeed from "@/data/podcasts-seed.json";
import { getYoutubeVideoId } from "@/lib/youtube";
import type { PodcastApi } from "@/components/podcast/podcast-directory";

/** Episodes shipped in-repo; used when MongoDB is unavailable and as the source for `npm run seed:podcasts`. */
export function getSeedPodcastApiRows(): PodcastApi[] {
  const base = Date.now();
  return podcastsSeed.map((p, i) => {
    const id = getYoutubeVideoId(p.youtubeLink) ?? `row-${i}`;
    return {
      _id: `seed-${id}`,
      title: p.title,
      description: p.description,
      youtubeLink: p.youtubeLink,
      thumbnail: p.thumbnail,
      createdAt: new Date(base - i * 120_000).toISOString(),
    };
  });
}
