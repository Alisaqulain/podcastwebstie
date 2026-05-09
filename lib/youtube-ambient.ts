import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";

export type AmbientClip = {
  videoId: string;
  title: string;
};

/** Muted, looping YouTube embed suitable for ambient / background playback. */
export function youtubeAmbientEmbedSrc(videoId: string, autoplay: boolean) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: "1",
    controls: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    loop: "1",
    playlist: videoId,
    iv_load_policy: "3",
    disablekb: "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function clipsFromEpisodes(
  episodes: PodcastEpisodeCard[]
): AmbientClip[] {
  return episodes
    .filter((e) => Boolean(e?.videoId))
    .map((e) => ({ videoId: e.videoId, title: e.title }));
}
