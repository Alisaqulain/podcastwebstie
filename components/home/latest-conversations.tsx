import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GoldButton } from "@/components/ui/gold-button";
import { LatestConversationsGrid } from "@/components/podcast/latest-conversations-grid";
import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";
import {
  getLatestPodcastEpisodesForHome,
  podcastEpisodesVideoObjectJsonLd,
} from "@/lib/podcast-episodes";
import { SITE } from "@/lib/site";
import { AmbientSectionShell } from "@/components/cinematic/ambient-section-shell";
import { clipsFromEpisodes } from "@/lib/youtube-ambient";

const HOME_EPISODE_COUNT = 12;

export async function LatestConversations(props?: {
  episodes?: PodcastEpisodeCard[];
}) {
  const episodes =
    props?.episodes ??
    (await getLatestPodcastEpisodesForHome(HOME_EPISODE_COUNT));
  const siteUrl = SITE.url.replace(/\/$/, "");
  const jsonLd =
    episodes.length > 0
      ? podcastEpisodesVideoObjectJsonLd(episodes, siteUrl)
      : null;

  const ambientClips = clipsFromEpisodes(episodes);

  const inner = (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <Container>
        <SectionHeading
          id="latest-conversations-heading"
          eyebrow="Now streaming"
          title="Latest podcasts"
          subtitle="A cinematic shelf of fresh uploads—hover any card for a 30-second muted preview, or jump straight into the full episode."
        />
        <LatestConversationsGrid episodes={episodes} />
        <div className="mt-12 flex justify-center">
          <GoldButton href="/podcast" variant="outline">
            View all episodes
          </GoldButton>
        </div>
      </Container>
    </>
  );

  if (ambientClips.length > 0) {
    return (
      <AmbientSectionShell
        id="latest-podcasts"
        clips={ambientClips}
        variant="section-soft"
        startOffset={1}
        className="scroll-mt-28 border-t border-luxury-border py-20 md:py-28"
        aria-labelledby="latest-conversations-heading"
      >
        {inner}
      </AmbientSectionShell>
    );
  }

  return (
    <section
      id="latest-podcasts"
      className="scroll-mt-28 border-t border-luxury-border bg-luxury-bg py-20 md:py-28"
      aria-labelledby="latest-conversations-heading"
    >
      {inner}
    </section>
  );
}
