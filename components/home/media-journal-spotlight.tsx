import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlogCard } from "@/components/blog/blog-card";
import { listBlogs } from "@/lib/data";
import { GoldButton } from "@/components/ui/gold-button";

export async function MediaJournalSpotlight() {
  const blogs = await listBlogs(3);
  const cards = blogs.map((b) => ({
    id: b.id,
    slug: String(b.slug),
    title: String(b.title),
    coverImage: b.coverImage ? String(b.coverImage) : undefined,
    seoDescription: b.seoDescription ? String(b.seoDescription) : undefined,
    createdAt: b.createdAt,
  }));

  return (
    <section
      className="border-t border-luxury-border bg-[linear-gradient(180deg,#ffffff_0%,#faf8f5_55%,#ffffff_100%)] py-20 md:py-28"
      aria-labelledby="journal-heading"
    >
      <Container>
        <SectionHeading
          id="journal-heading"
          eyebrow="Media desk"
          align="left"
          title="Insights that compound authority"
          subtitle="Podcast summaries, founder lessons, and psychology-backed notes—written with SEO discipline and magazine pacing."
        />

        {cards.length === 0 ? (
          <div className="glass-panel rounded-[2rem] border border-dashed border-brand-gold/35 p-12 text-center shadow-sm">
            <p className="text-lg font-display font-semibold text-luxury-heading">
              The editorial desk is warming up
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-luxury-body">
              Long-form articles publish here first—deep dives on presence, courage,
              and building a voice people trust. Until new posts land, explore the
              channel&apos;s latest uploads above for fresh conversations.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <GoldButton href="/blog">Visit the journal</GoldButton>
              <GoldButton href="/podcast" variant="outline">
                Browse episodes
              </GoldButton>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((b, i) => (
                <BlogCard key={b.id ?? b.slug} blog={b} index={i} />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                href="/blog"
                className="text-sm font-semibold text-brand-gold-deep underline underline-offset-[6px] hover:text-brand-gold"
              >
                Browse all articles
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
