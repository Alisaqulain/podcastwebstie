import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { getBlogBySlug } from "@/lib/data";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";
import { SITE } from "@/lib/site";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  if (!post) {
    return { title: "Article" };
  }

  const title = String(post.seoTitle || post.title);
  const description = String(post.seoDescription || "").slice(0, 160);
  const images = post.coverImage ? [String(post.coverImage)] : undefined;

  return {
    title,
    description: description || SITE.description,
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description: description || SITE.description,
      type: "article",
      url: `${SITE.url}/blog/${params.slug}`,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description: description || SITE.description,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogBySlug(params.slug);
  if (!post) notFound();

  const html = sanitizeBlogHtml(String(post.content));
  const cover = post.coverImage ? String(post.coverImage) : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: String(post.title),
    description: String(post.seoDescription || ""),
    datePublished: post.createdAt
      ? new Date(post.createdAt as Date).toISOString()
      : undefined,
    author: { "@type": "Person", name: "Namrata Tiwary Singh" },
    image: cover ? [cover] : undefined,
    mainEntityOfPage: `${SITE.url}/blog/${params.slug}`,
  };

  return (
    <article className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <header className="border-b border-brand-gold/10 bg-white/40 py-14 backdrop-blur-sm md:py-20">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
            {post.createdAt
              ? new Date(post.createdAt as Date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Article"}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-brand-dark md:text-5xl">
            {String(post.title)}
          </h1>
          {post.seoDescription ? (
            <p className="mt-6 text-lg text-brand-dark/70">
              {String(post.seoDescription)}
            </p>
          ) : null}
        </Container>
      </header>

      {cover ? (
        <Container className="mt-10 max-w-4xl">
          <div className="relative aspect-[21/9] overflow-hidden rounded-4xl border border-brand-gold/15 shadow-card">
            <Image
              src={cover}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 896px"
            />
          </div>
        </Container>
      ) : null}

      <Container className="mt-12 max-w-3xl">
        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
    </article>
  );
}
