"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BackgroundVideo } from "@/components/cinematic/background-video";
import { SITE } from "@/lib/site";
import type { AmbientClip } from "@/lib/youtube-ambient";

export function AboutHero({ clips }: { clips: AmbientClip[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[min(100svh,42rem)] overflow-hidden border-b border-luxury-border sm:min-h-[min(92svh,44rem)]">
      <BackgroundVideo
        clips={clips}
        startOffset={1}
        className="absolute inset-0 z-0"
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-luxury-bg/50 via-luxury-bg/70 to-luxury-bg/88"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-white/[0.68] dark:bg-black/50"
        aria-hidden
      />

      <motion.div
        className="relative z-10 mx-auto flex min-h-[min(100svh,42rem)] w-full max-w-6xl items-center justify-center px-3 pb-14 pt-[max(5.5rem,env(safe-area-inset-top)+4.5rem)] sm:min-h-[min(92svh,44rem)] sm:px-6 sm:pb-20 sm:pt-24 md:pb-24 md:pt-28"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="readable-content-panel mx-auto w-full max-w-3xl rounded-[1.35rem] px-4 py-6 text-center sm:rounded-[1.75rem] sm:px-7 sm:py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
            About
          </p>
          <h1 className="mt-4 font-display text-[clamp(1.75rem,5.5vw,3.25rem)] font-semibold leading-[1.12] tracking-tight text-luxury-heading text-balance">
            {SITE.name}
          </h1>
          <p className="mt-3 font-display text-lg text-brand-gold-deep sm:text-xl">
            {SITE.tagline}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-luxury-body sm:mt-6 sm:text-lg">
            {SITE.description}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
