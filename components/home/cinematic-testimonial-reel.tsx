"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { AmbientClip } from "@/lib/youtube-ambient";
import { youtubeAmbientEmbedSrc } from "@/lib/youtube-ambient";

/**
 * Single muted editorial film-strip built from latest channel clips—atmospheric, not loud.
 */
export function CinematicTestimonialReel({ clips }: { clips: AmbientClip[] }) {
  const reduceMotion = useReducedMotion();
  const list = useMemo(
    () => clips.filter((c) => Boolean(c?.videoId)).slice(0, 10),
    [clips]
  );
  const [ix, setIx] = useState(0);

  useEffect(() => {
    if (reduceMotion || list.length <= 1) return;
    const t = window.setInterval(
      () => setIx((v) => (v + 1) % list.length),
      14_000
    );
    return () => window.clearInterval(t);
  }, [list.length, reduceMotion]);

  const current = list[ix] ?? list[0];
  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className="relative mx-auto mb-14 overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white/70 shadow-luxury-card ring-1 ring-black/[0.04] backdrop-blur-xl md:mb-16"
    >
      <div className="relative aspect-[21/9] min-h-[200px] w-full bg-luxury-bg sm:min-h-[240px]">
        {reduceMotion ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{
              backgroundImage: `url(https://img.youtube.com/vi/${current.videoId}/maxresdefault.jpg)`,
            }}
          />
        ) : (
          <iframe
            key={current.videoId}
            title=""
            src={youtubeAmbientEmbedSrc(current.videoId, true)}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 scale-[1.06] border-0 opacity-[0.42]"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/55 to-white/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/25" />
        <div className="relative flex h-full flex-col justify-end p-8 md:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-gold-deep">
            On-camera proof
          </p>
          <p className="mt-3 max-w-xl font-display text-xl font-semibold leading-snug text-luxury-heading md:text-2xl">
            Voices that trusted this stage—and left with clarity, polish, and reach.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-luxury-body md:text-base">
            A gentle cinematic reel assembled from real episodes—authentic conversations,
            luxury pacing, and storytelling built for modern discovery.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
