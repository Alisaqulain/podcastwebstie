"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Play, Sparkles } from "lucide-react";
import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";
import type { YouTubeChannelStats } from "@/lib/youtube-data-api";
import { Button } from "@/components/ui/button";
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
    <section className="relative isolate flex min-h-0 flex-col overflow-hidden pb-10 pt-3 sm:pb-16 sm:pt-5 md:min-h-[100svh] md:items-center md:justify-center md:pb-28 md:pt-6">
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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-3 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-end lg:gap-12">
          <div className="readable-content-panel rounded-[1.35rem] px-4 py-5 sm:rounded-[1.75rem] sm:px-7 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="luxury-chip max-w-full gap-1.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold-deep sm:gap-2 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.28em]"
            >
              <Sparkles className="h-3 w-3 shrink-0 text-brand-gold sm:h-3.5 sm:w-3.5" aria-hidden />
              <span className="truncate">BhawnaMrata · podcast &amp; media</span>
            </motion.div>

            <div className="relative mt-4 min-h-[2.6em] sm:mt-8">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlines[headlineIx]}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="text-balance font-display text-[clamp(1.75rem,7.8vw,5.05rem)] font-semibold leading-[1.08] tracking-tight text-luxury-heading"
                >
                  {headlines[headlineIx]}
                </motion.h1>
              </AnimatePresence>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-3 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-luxury-heading sm:mt-5 sm:text-base sm:text-luxury-heading/90 md:text-lg"
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
              className="mt-6 flex flex-col gap-2.5 sm:mt-10 sm:flex-row sm:items-stretch sm:gap-4"
            >
              <Button
                href="/book"
                className="mobile-cta group gap-2"
              >
                Book your slot
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Button>
              <Button
                href={current?.watchUrl ?? "/podcast"}
                variant="outline"
                className="mobile-cta"
              >
                <Play className="mr-2 h-4 w-4 fill-current" aria-hidden />
                Watch latest episode
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              className="mt-4 hidden flex-wrap gap-2 sm:mt-10 sm:flex sm:gap-3"
            >
              <span className="luxury-chip gap-2 px-3 py-2 text-xs">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand-gold shadow-[0_0_16px_rgba(201,161,74,0.45)]" />
                Studio-grade production
              </span>
              <span className="luxury-chip px-3 py-2 text-xs">
                Limited guest slots
              </span>
            </motion.div>

            {channel &&
            (typeof channel.subscriberCount === "number" ||
              typeof channel.viewCount === "number") ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3"
              >
                {typeof channel.subscriberCount === "number" ? (
                  <span className="luxury-chip gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                    {formatCompact(channel.subscriberCount)} subscribers
                  </span>
                ) : null}
                {typeof channel.viewCount === "number" ? (
                  <span className="luxury-chip gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                    {formatCompact(channel.viewCount)} channel views
                  </span>
                ) : null}
              </motion.div>
            ) : null}
          </div>

          <div className="hidden lg:block lg:justify-self-end">
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
                    className="glass-panel relative overflow-hidden rounded-[1.75rem] p-7 shadow-luxury-card ring-1 ring-[color:var(--overlay-ring)]"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-90"
                      style={{ background: "var(--hero-card-shine)" }}
                    />
                    <p className="relative text-xs font-semibold uppercase tracking-[0.26em] text-brand-gold-deep">
                      Latest spotlight
                    </p>
                    <p className="relative mt-4 break-words font-display text-2xl font-semibold leading-snug text-luxury-heading">
                      {current.title}
                    </p>
                    <p className="relative mt-3 line-clamp-3 text-sm leading-relaxed text-luxury-heading/82">
                      {current.description}
                    </p>
                    {second && second.id !== current.id ? (
                      <div className="relative mt-5 flex gap-3 overflow-hidden rounded-2xl border border-luxury-border bg-muted/60 p-2">
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
                      <Button
                        href={current.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                        size="sm"
                      >
                        Watch on YouTube
                      </Button>
                      <Button href="/podcast" variant="outline" size="sm">
                        All episodes
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="fallback"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel relative rounded-[1.75rem] p-7 shadow-luxury-card ring-1 ring-[color:var(--overlay-ring)]"
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
                      <Button
                        href="https://youtube.com/@bhawnamrata"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                      >
                        Open YouTube
                      </Button>
                      <Button href="/podcast" variant="outline" size="sm">
                        Podcast hub
                      </Button>
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
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-luxury-border bg-surface/90 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-luxury-muted shadow-sm backdrop-blur-md transition hover:border-brand-gold/40 hover:text-luxury-heading md:inline-flex"
        >
          Scroll
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.a>
      </div>
    </section>
  );
}
