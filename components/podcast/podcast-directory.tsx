"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { ImageCard } from "@/components/ui/image-card";

export type PodcastApi = {
  _id: string;
  title: string;
  description: string;
  youtubeLink: string;
  thumbnail: string;
  /** Optional local MP4 preview; merged onto YouTube-synced cards when video IDs match. */
  localPreviewUrl?: string;
  createdAt?: string;
};

export function PodcastDirectory({ initial }: { initial: PodcastApi[] }) {
  const [items, setItems] = useState<PodcastApi[]>(initial);
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [loading, setLoading] = useState(false);
  const firstFetch = useRef(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (firstFetch.current) {
        firstFetch.current = false;
        if (!debouncedQ.trim()) return;
      }
      setLoading(true);
      try {
        const url = debouncedQ.trim()
          ? `/api/podcasts?q=${encodeURIComponent(debouncedQ.trim())}`
          : "/api/podcasts";
        const res = await fetch(url);
        const data = (await res.json()) as PodcastApi[];
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      }),
    [items]
  );

  return (
    <div className="pb-24">
      <section className="border-b border-luxury-border bg-luxury-section py-14 md:py-20">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="BHAW Namrata Podcast"
            title="Conversations that return you to yourself"
            subtitle="Watch episodes on YouTube—search below to find a topic or title."
            className="mb-0"
          />
          <div className="relative mt-10 max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-muted"
              aria-hidden
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search episodes..."
              className="field-input w-full py-3.5 !pl-12 pr-4 shadow-sm"
            />
            {loading ? (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-luxury-muted">
                Updating…
              </span>
            ) : null}
          </div>
        </Container>
      </section>

      <Container className="mt-14">
        {sorted.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-luxury-body">
            No episodes match your search yet. Try another keyword—or explore
            the channel on YouTube.
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {sorted.map((p, idx) => {
              const embed = getYoutubeEmbedUrl(p.youtubeLink);
              return (
                <motion.article
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: Math.min(idx * 0.04, 0.2) }}
                  whileHover={{ y: -4 }}
                  className="grid gap-8 rounded-4xl border border-luxury-border bg-luxury-section p-6 shadow-luxury-card transition hover:border-brand-gold/40 hover:shadow-gold-glow md:grid-cols-[1.15fr_0.85fr] md:p-8"
                >
                  <div className="overflow-hidden rounded-3xl bg-luxury-bg ring-1 ring-luxury-border">
                    {embed ? (
                      <div className="aspect-video w-full">
                        <iframe
                          title={p.title}
                          src={`${embed}?rel=0`}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center text-sm text-luxury-muted">
                        Invalid YouTube URL
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-brand-gold-deep">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Episode"}
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-luxury-heading md:text-3xl">
                      {p.title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-luxury-body">
                      {p.description}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      {p.thumbnail ? (
                        <ImageCard
                          type="podcast"
                          src={p.thumbnail}
                          alt={`Thumbnail: ${p.title}`}
                          className="w-28 shrink-0 shadow-sm ring-1 ring-luxury-border"
                          sizes="112px"
                        />
                      ) : null}
                      <a
                        href={p.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-brand-gold-deep hover:text-brand-gold hover:underline"
                      >
                        Open on YouTube
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
