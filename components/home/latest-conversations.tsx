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

  return (
    <section
      className="border-t border-luxury-border bg-luxury-bg py-20 md:py-28"
      aria-labelledby="latest-conversations-heading"
    >
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <Container>
        <SectionHeading
          id="latest-conversations-heading"
          title="Latest from the channel"
          subtitle="Auto-synced from YouTube—new uploads appear here without manual edits."
        />
        <LatestConversationsGrid episodes={episodes} />
        <div className="mt-12 flex justify-center">
          <GoldButton href="/podcast" variant="outline">
            View all episodes
          </GoldButton>
        </div>
      </Container>
    </section>
  );
}
