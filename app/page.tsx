import { HeroCinematic } from "@/components/home/hero-cinematic";
import { LatestConversations } from "@/components/home/latest-conversations";
import { AboutPreview } from "@/components/home/about-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { SocialProof } from "@/components/home/social-proof";
import { PricingSection } from "@/components/home/pricing-section";
import { CtaSection } from "@/components/home/cta-section";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { WhyBookSection } from "@/components/home/why-book-section";
import { MediaJournalSpotlight } from "@/components/home/media-journal-spotlight";
import { CinematicStripDivider } from "@/components/cinematic/cinematic-strip-divider";
import { CinematicExperienceShell } from "@/components/cinematic/cinematic-experience-shell";
import { getLatestPodcastEpisodesForHome } from "@/lib/podcast-episodes";
import { fetchYouTubeChannelStats } from "@/lib/youtube-data-api";
import { clipsFromEpisodes } from "@/lib/youtube-ambient";

/** Aligns with YouTube RSS/API fetch revalidation — fresh uploads surface without redeploys. */
export const revalidate = 300;

export default async function HomePage() {
  const episodes = await getLatestPodcastEpisodesForHome(12);
  const clips = clipsFromEpisodes(episodes);
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  const handle = process.env.YOUTUBE_CHANNEL_HANDLE?.trim() || "bhawnamrata";
  const channel =
    apiKey ? await fetchYouTubeChannelStats(apiKey, handle) : null;

  return (
    <CinematicExperienceShell episodes={episodes}>
      <HeroCinematic episodes={episodes} channel={channel} clips={clips} />
      <LatestConversations episodes={episodes} />
      <CinematicStripDivider clips={clips} startOffset={1} />
      <WhyBookSection syncedEpisodeCount={episodes.length} />
      <AboutPreview clips={clips} />
      <TestimonialsSection clips={clips} />
      <MediaJournalSpotlight />
      <SocialProof />
      <PricingSection ambientClips={clips} />
      <CtaSection />
      <NewsletterCta />
    </CinematicExperienceShell>
  );
}
