"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";

function formatPublished(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

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
          Episodes are loading from the channel. Subscribe on YouTube so you never
          miss a conversation.
        </p>
        <div className="mt-6 flex justify-center">
          <GoldButton href="https://www.youtube.com/@BHAWNamrata">
            Subscribe on YouTube
          </GoldButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {episodes.map((ep, i) => (
          <motion.article
            key={ep.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.24) }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-luxury-border bg-luxury-section shadow-md transition-shadow hover:shadow-lg"
          >
            <button
              type="button"
              onClick={() => setOpenId(ep.id)}
              className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              aria-haspopup="dialog"
              aria-expanded={openId === ep.id}
            >
              <div className="relative aspect-video overflow-hidden bg-luxury-bg">
                <Image
                  src={ep.thumbnailUrl}
                  alt={`YouTube thumbnail: ${ep.title}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                <span
                  className="absolute inset-0 flex items-center justify-center bg-luxury-heading/25 opacity-0 transition duration-300 group-hover:opacity-100"
                  aria-hidden
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-[#1A1A1A] shadow-gold-glow ring-2 ring-white/80">
                    <Play className="h-6 w-6 fill-current" aria-hidden />
                  </span>
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <time
                  dateTime={ep.publishedAt}
                  className="text-xs font-medium uppercase tracking-wider text-brand-gold-deep"
                >
                  {formatPublished(ep.publishedAt)}
                </time>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-luxury-heading group-hover:text-brand-gold-deep">
                  {ep.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-luxury-muted">
                  {ep.description}
                </p>
              </div>
            </button>
          </motion.article>
        ))}
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
            className="fixed inset-0 z-[200] flex items-center justify-center bg-luxury-heading/50 p-4 backdrop-blur-sm"
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
                <h2 id={titleId} className="font-display text-lg font-semibold text-luxury-heading md:text-xl">
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
                  loading="lazy"
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
                <button
                  type="button"
                  onClick={close}
                  className="text-sm font-medium text-luxury-body hover:text-luxury-heading"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
