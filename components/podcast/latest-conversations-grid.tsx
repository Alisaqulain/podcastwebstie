"use client";

/** Episode rail + mobile Swiper carousel for latest long-form conversations. */
import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";
import { PodcastPreviewCard } from "@/components/podcast/podcast-preview-card";
import { PodcastPreviewPlaybackProvider } from "@/components/podcast/podcast-preview-playback";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export function LatestConversationsGrid({
  episodes,
}: {
  episodes: PodcastEpisodeCard[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const titleId = useId();
  const active = episodes.find((e) => e.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (!openId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [openId, close]);

  if (episodes.length === 0) {
    return (
      <div className="glass-panel mx-auto max-w-2xl rounded-3xl p-10 text-center">
        <p className="text-luxury-body">
          Latest uploads load automatically from the public YouTube channel feed.
          If the feed is unavailable momentarily, browse the archive—or open the
          channel directly on YouTube.
        </p>
        <div className="mt-6 flex justify-center">
          <GoldButton href="https://www.youtube.com/@bhawnamrata">
            Subscribe on YouTube
          </GoldButton>
        </div>
      </div>
    );
  }

  const [featured, ...rest] = episodes;

  return (
    <PodcastPreviewPlaybackProvider>
      <div className="space-y-8 sm:space-y-12">
        {featured ? (
          <PodcastPreviewCard
            episode={featured}
            featured
            priorityImage
            viewportPreview
          />
        ) : null}

        {rest.length > 0 ? (
          <>
            <div className="hidden gap-8 lg:grid lg:grid-cols-3">
              {rest.map((ep, i) => (
                <PodcastPreviewCard
                  key={ep.id}
                  episode={ep}
                  priorityImage={i < 2}
                  viewportPreview
                />
              ))}
            </div>

            <div className="lg:hidden">
              <Swiper
                modules={[Pagination]}
                spaceBetween={12}
                slidesPerView={1}
                centeredSlides={false}
                pagination={{ clickable: true }}
                className="!pb-12 podcast-carousel"
              >
                {rest.map((ep) => (
                  <SwiperSlide key={ep.id}>
                    <PodcastPreviewCard episode={ep} viewportPreview />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        ) : null}

        <div className="hidden flex-wrap justify-center gap-4 sm:flex">
          {episodes.slice(0, 6).map((ep) => (
            <button
              key={`quick-${ep.id}`}
              type="button"
              onClick={() => setOpenId(ep.id)}
              className="group relative flex h-14 w-24 shrink-0 overflow-hidden rounded-xl border border-luxury-border bg-luxury-bg shadow-sm ring-1 ring-black/[0.04] transition hover:border-brand-gold/40 hover:shadow-md"
            >
              <span
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${ep.thumbnailUrl})`,
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100">
                <Play className="h-7 w-7 text-white drop-shadow" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-luxury-heading/45 p-4 backdrop-blur-md"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-luxury-border bg-luxury-section shadow-soft-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-luxury-border px-5 py-4">
                <h2
                  id={titleId}
                  className="font-display text-lg font-semibold text-luxury-heading md:text-xl"
                >
                  {active.title}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="shrink-0 rounded-xl border border-luxury-border bg-luxury-bg p-2 text-luxury-heading transition hover:border-brand-gold/40 hover:bg-brand-gold/10"
                  aria-label="Close video"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  title={`YouTube video: ${active.title}`}
                  src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1&rel=0`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="eager"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-luxury-border px-5 py-4">
                <p className="text-sm text-luxury-muted">
                  Prefer YouTube?{" "}
                  <Link
                    href={active.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-gold-deep underline hover:text-brand-gold"
                  >
                    Open on YouTube
                  </Link>
                </p>
                <GoldButton href="/book" variant="outline">
                  Book your slot
                </GoldButton>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PodcastPreviewPlaybackProvider>
  );
}
