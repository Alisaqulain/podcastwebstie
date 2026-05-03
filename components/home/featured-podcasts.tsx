import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GoldButton } from "@/components/ui/gold-button";
import { listPodcasts } from "@/lib/data";
import { FeaturedPodcastCard } from "@/components/podcast/featured-podcast-card";

export async function FeaturedPodcasts() {
  const items = await listPodcasts(3);

  const cards = items.map((p) => ({
    id: p.id,
    title: String(p.title),
    description: String(p.description),
    youtubeLink: String(p.youtubeLink),
    thumbnail: p.thumbnail ? String(p.thumbnail) : undefined,
  }));

  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Listen in"
          title="Featured conversations"
          subtitle="Episodes crafted to help you reset your inner narrative and step forward with poise."
        />

        {cards.length === 0 ? (
          <div className="glass-panel mx-auto max-w-2xl rounded-3xl p-10 text-center">
            <p className="text-brand-dark/70">
              New episodes are on the way. Subscribe on YouTube to be the first
              to watch.
            </p>
            <div className="mt-6 flex justify-center">
              <GoldButton href="https://youtube.com/@bhawnamrata">
                Subscribe on YouTube
              </GoldButton>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {cards.map((item, i) => (
              <FeaturedPodcastCard key={item.id ?? i} item={item} index={i} />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <GoldButton href="/podcast" variant="outline">
            View all episodes
          </GoldButton>
        </div>
      </Container>
    </section>
  );
}
