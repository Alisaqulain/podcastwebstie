"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export function HeroPremium() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const src = SITE.heroVideoUrl;

  useEffect(() => {
    if (!src || reduceMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShouldLoadVideo(true);
          obs.disconnect();
        }
      },
      { rootMargin: "120px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src, reduceMotion]);

  const tryPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setVideoFailed(true));
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo || !src || videoFailed) return;
    const v = videoRef.current;
    if (!v) return;
    v.load();
    tryPlay();
  }, [shouldLoadVideo, src, videoFailed, tryPlay]);

  const showVideo = Boolean(src) && !reduceMotion && !videoFailed && shouldLoadVideo;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-[max(5.5rem,env(safe-area-inset-top)+4rem)] pb-20 md:pb-28"
    >
      <div className="absolute inset-0 z-0">
        {showVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            loop
            preload="none"
            poster={SITE.heroPosterUrl}
            onError={() => setVideoFailed(true)}
            onLoadedData={tryPlay}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-luxury-bg" />
        )}

        {/* Light luxury overlay — readable dark type + soft warmth */}
        <div
          className="absolute inset-0 bg-white/[0.75]"
          aria-hidden
        />

        {!showVideo && SITE.heroPosterUrl ? (
          <div className="absolute inset-0 opacity-30">
            <Image
              src={SITE.heroPosterUrl}
              alt=""
              fill
              className="object-cover object-[center_20%]"
              sizes="100vw"
              priority
            />
          </div>
        ) : null}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-xs font-semibold uppercase tracking-[0.38em] text-brand-gold-deep"
        >
          BHAW Namrata · Coach · Podcast
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="mt-7 font-display text-[clamp(2.5rem,6vw,4.85rem)] font-semibold leading-[1.05] tracking-tight text-luxury-heading text-balance"
        >
          Expression is{" "}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            Power
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-luxury-body sm:text-lg md:text-xl"
        >
          {SITE.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
        >
          <Link
            href="/book"
            className="inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-gold-gradient px-10 py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-gold-glow transition hover:brightness-110 hover:shadow-gold-glow-lg hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.98]"
          >
            Book Now
          </Link>
          <Link
            href="/book#packages"
            className="inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-full border-2 border-luxury-heading bg-transparent px-10 py-3.5 text-sm font-semibold text-luxury-heading transition hover:bg-luxury-heading hover:text-white active:scale-[0.98]"
          >
            View Packages
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-sm text-luxury-muted"
        >
          Namrata Tiwary Singh · Founder &amp; Host · Self Image Coach
        </motion.p>
      </div>
    </section>
  );
}
