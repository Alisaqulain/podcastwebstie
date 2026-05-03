import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { listBlogs } from "@/lib/data";
import { BlogCard } from "@/components/blog/blog-card";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on self-image, expression, and showing up powerfully—from BHAW Namrata.",
  openGraph: {
    title: `Blog | ${SITE.name}`,
    description: "Insights, stories, and coaching notes for ambitious women.",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const blogs = await listBlogs();

  const cards = blogs.map((b) => ({
    id: b.id,
    slug: String(b.slug),
    title: String(b.title),
    coverImage: b.coverImage ? String(b.coverImage) : undefined,
    seoDescription: b.seoDescription ? String(b.seoDescription) : undefined,
    createdAt: b.createdAt,
  }));

  return (
    <div className="pb-24">
      <section className="border-b border-brand-gold/10 bg-white/30 py-14 backdrop-blur-sm md:py-20">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Journal"
            title="Ideas for a braver, clearer you"
            subtitle="Long-form notes on self-image, voice, and the psychology of being seen."
            className="mb-0"
          />
        </Container>
      </section>

      <Container className="mt-14">
        {cards.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-brand-dark/70">
            Fresh articles are being prepared. Meanwhile, catch the latest on the{" "}
            <a
              href={SITE.social.youtube}
              className="font-semibold text-brand-gold-deep underline"
            >
              podcast
            </a>
            .
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((b, i) => (
              <BlogCard key={b.id ?? b.slug} blog={b} index={i} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
