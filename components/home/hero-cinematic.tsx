"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Play, Sparkles } from "lucide-react";
import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";
import type { YouTubeChannelStats } from "@/lib/youtube-data-api";
import { cn } from "@/lib/utils";
import { clipsFromEpisodes, type AmbientClip } from "@/lib/youtube-ambient";
import { BackgroundVideo } from "@/components/cinematic/background-video";

function formatCompact(n: number) {
  try {
    return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(n);
  } catch {
    return String(n);
  }
}

export function HeroCinematic({
  episodes,
  channel,
  clips: clipsProp,
}: {
  episodes: PodcastEpisodeCard[];
  channel?: YouTubeChannelStats | null;
  clips?: AmbientClip[];
}) {
  const reduceMotion = useReducedMotion();
  const list = useMemo(() => episodes.filter(Boolean).slice(0, 8), [episodes]);
  const ambientClips = useMemo(() => {
    if (clipsProp?.length) return clipsProp;
    return clipsFromEpisodes(list);
  }, [clipsProp, list]);

  const current = list[0] ?? null;
  const second = list[1] ?? current;

  const [headlineIx, setHeadlineIx] = useState(0);
  const headlines = useMemo(
    () => [
      "Every Conversation Creates Impact",
      "Stories That Inspire Millions",
      "Where Powerful Voices Are Heard",
    ],
    []
  );

  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => {
      setHeadlineIx((v) => (v + 1) % headlines.length);
    }, 7000);
    return () => window.clearInterval(t);
  }, [reduceMotion, headlines.length]);

  useEffect(() => {
    if (!second?.thumbnailUrl) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = second.thumbnailUrl;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [second?.thumbnailUrl]);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-[max(5.75rem,env(safe-area-inset-top)+4.5rem)] md:pb-28">
      <BackgroundVideo
        clips={ambientClips}
        startOffset={0}
        className="absolute inset-0 z-0"
      />

      <div
        className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-brand-gold/[0.14] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-[-120px] h-[480px] w-[480px] rounded-full bg-brand-red/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep shadow-sm backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-gold" aria-hidden />
              BhawnaMrata · cinematic podcast &amp; media
            </motion.div>

            <div className="relative mt-8 min-h-[1.15em]">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlines[headlineIx]}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(2.75rem,6.2vw,5.1rem)] font-semibold leading-[1.03] tracking-tight text-luxury-heading"
                >
                  {headlines[headlineIx]}
                </motion.h1>
              </AnimatePresence>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-5 max-w-xl text-base leading-relaxed text-luxury-body sm:text-lg"
              >
                Meaningful podcasts, sharp interviews, and story-led media that
                strengthens your personal brand—without losing the warmth that
                makes people lean in.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/book"
                className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-gold-gradient px-10 text-sm font-semibold text-[#1A1A1A] shadow-gold-glow transition hover:brightness-110 hover:shadow-gold-glow-lg hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Book your slot
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={current?.watchUrl ?? "/podcast"}
                className={cn(
                  "inline-flex min-h-[54px] items-center justify-center rounded-full border border-black/[0.08] bg-white/70 px-10 text-sm font-semibold text-luxury-heading backdrop-blur-md transition hover:border-brand-gold/40 hover:bg-white"
                )}
              >
                <Play className="mr-2 h-4 w-4 fill-current" aria-hidden />
                Watch latest episode
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              className="mt-10 flex flex-wrap gap-3 text-sm text-luxury-muted"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/75 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-brand-gold shadow-[0_0_16px_rgba(201,161,74,0.45)]" />
                Studio-grade production · calm direction
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/75 px-4 py-2 backdrop-blur-md">
                Limited monthly guest slots
              </span>
            </motion.div>

            {channel &&
            (typeof channel.subscriberCount === "number" ||
              typeof channel.viewCount === "number") ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                {typeof channel.subscriberCount === "number" ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-luxury-heading/80 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                    {formatCompact(channel.subscriberCount)} subscribers
                  </span>
                ) : null}
                {typeof channel.viewCount === "number" ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-luxury-heading/80 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    {formatCompact(channel.viewCount)} channel views
                  </span>
                ) : null}
              </motion.div>
            ) : null}
          </div>

          <div className="lg:justify-self-end">
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: reduceMotion ? 0 : -0.4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {!reduceMotion ? (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand-gold/20 via-transparent to-brand-red/15 blur-2xl"
                  animate={{ opacity: [0.45, 0.75, 0.45] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}
              <AnimatePresence mode="wait">
                {current ? (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.4 }}
                    className="glass-panel relative overflow-hidden rounded-[1.75rem] p-7 shadow-luxury-card ring-1 ring-black/[0.06]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white/40 to-brand-cream/30" />
                    <p className="relative text-xs font-semibold uppercase tracking-[0.26em] text-brand-gold-deep">
                      Latest spotlight
                    </p>
                    <p className="relative mt-4 font-display text-2xl font-semibold leading-snug text-luxury-heading">
                      {current.title}
                    </p>
                    <p className="relative mt-3 line-clamp-3 text-sm text-luxury-body">
                      {current.description}
                    </p>
                    {second && second.id !== current.id ? (
                      <div className="relative mt-5 flex gap-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-luxury-bg/60 p-2">
                        <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-luxury-muted/20">
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-90"
                            style={{
                              backgroundImage: `url(https://img.youtube.com/vi/${second.videoId}/mqdefault.jpg)`,
                            }}
                          />
                        </div>
                        <div className="min-w-0 py-1">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold-deep">
                            Up next
                          </p>
                          <p className="line-clamp-2 text-xs font-medium text-luxury-heading">
                            {second.title}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    <div className="relative mt-6 flex flex-wrap gap-3">
                      <Link
                        href={current.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-luxury-heading px-6 py-3 text-sm font-semibold text-white transition hover:bg-luxury-heading/90"
                      >
                        Watch on YouTube
                      </Link>
                      <Link
                        href="/podcast"
                        className="inline-flex items-center justify-center rounded-full border border-black/[0.08] bg-white/80 px-6 py-3 text-sm font-semibold text-luxury-heading backdrop-blur hover:border-brand-gold/45"
                      >
                        All episodes
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="fallback"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel relative rounded-[1.75rem] p-7 shadow-luxury-card ring-1 ring-black/[0.06]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-gold-deep">
                      Channel
                    </p>
                    <p className="mt-4 font-display text-2xl font-semibold text-luxury-heading">
                      Fresh episodes loading
                    </p>
                    <p className="mt-3 text-sm text-luxury-body">
                      We sync the latest uploads automatically from the public
                      channel feed. If you&apos;re offline momentarily, browse the
                      full library anytime.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href="https://youtube.com/@bhawnamrata"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-[#1a1a1a] shadow-gold-glow"
                      >
                        Open YouTube
                      </Link>
                      <Link
                        href="/podcast"
                        className="inline-flex rounded-full border border-black/[0.08] px-6 py-3 text-sm font-semibold text-luxury-heading"
                      >
                        Podcast hub
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <motion.a
          href="#why-book"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.55 }}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-luxury-muted shadow-sm backdrop-blur-md md:inline-flex"
        >
          Scroll
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.a>
      </div>
    </section>
  );
}
