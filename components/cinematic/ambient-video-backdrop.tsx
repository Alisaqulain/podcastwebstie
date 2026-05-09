"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  type AmbientClip,
  youtubeAmbientEmbedSrc,
} from "@/lib/youtube-ambient";
import {
  CINEMATIC_ROTATE_MS,
  useCinematicVideo,
} from "./cinematic-video-context";
import { SITE } from "@/lib/site";

export type AmbientVideoVariant =
  | "hero"
  | "section-soft"
  | "split-left"
  | "masked-blob"
  | "floating-orbs"
  | "strip";

type Props = {
  clips: AmbientClip[];
  variant: AmbientVideoVariant;
  /** Shift rotating index for layered sections (only when synced with provider). */
  startOffset?: number;
  className?: string;
  intervalMs?: number;
};

export function AmbientVideoBackdrop({
  clips: clipsProp,
  variant,
  startOffset = 0,
  className,
  intervalMs = CINEMATIC_ROTATE_MS,
}: Props) {
  const ctx = useCinematicVideo();
  const synced = Boolean(ctx?.clips?.length);

  const reduceMotionFramer = useReducedMotion();

  const list = useMemo(() => {
    const raw = synced ? ctx!.clips : clipsProp;
    return raw.filter((c) => c.videoId).slice(0, 12);
  }, [synced, ctx, clipsProp]);

  const len = list.length;

  const [idxLocal, setIdxLocal] = useState(() =>
    len ? startOffset % len : 0
  );
  const [armedLocal, setArmedLocal] = useState(false);
  const [phaseLocal, setPhaseLocal] = useState<"a" | "b">("a");
  const [inView, setInView] = useState(variant === "hero");

  const idx = synced ? (ctx!.index + startOffset) % Math.max(len, 1) : idxLocal;
  const phase = synced ? ctx!.phase : phaseLocal;
  const armed = synced ? ctx!.armed : armedLocal;
  const reduceMotion = synced ? ctx!.reduceMotion : Boolean(reduceMotionFramer);

  const rootRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const timerRef = useRef<number | null>(null);

  const current = len ? list[idx % len] : null;
  const next =
    len > 1 ? list[(idx + 1) % len] : null;

  const dualLayer =
    variant === "hero" ||
    variant === "section-soft" ||
    variant === "split-left" ||
    variant === "strip" ||
    variant === "masked-blob";

  useEffect(() => {
    if (synced) return;
    const id = window.setTimeout(() => setArmedLocal(true), 380);
    return () => window.clearTimeout(id);
  }, [synced]);

  useEffect(() => {
    if (variant === "hero") return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variant]);

  useEffect(() => {
    if (synced || !len || len <= 1 || reduceMotion) return;
    if (!inView) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setPhaseLocal((p) => (p === "a" ? "b" : "a"));
      setIdxLocal((v) => (v + 1) % len);
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [synced, len, reduceMotion, inView, intervalMs]);

  useEffect(() => {
    const wrap = zoomWrapRef.current;
    const animateZoom =
      inView &&
      !reduceMotion &&
      Boolean(current) &&
      variant !== "strip" &&
      variant !== "floating-orbs";

    if (!wrap || !animateZoom) {
      tweenRef.current?.kill();
      tweenRef.current = null;
      return;
    }

    gsap.set(wrap, { scale: 1 });
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(wrap, {
      scale: 1.08,
      duration: intervalMs / 1000,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [
    variant,
    current,
    reduceMotion,
    inView,
    intervalMs,
    idx,
    phase,
  ]);

  const autoplay = armed && inView && !reduceMotion && Boolean(current);

  function Layer({
    clip,
    opacityClass,
    loading,
  }: {
    clip: AmbientClip;
    opacityClass: string;
    loading: "eager" | "lazy";
  }) {
    return (
      <div className={cn("absolute inset-0", opacityClass)} aria-hidden>
        <iframe
          title=""
          src={youtubeAmbientEmbedSrc(clip.videoId, autoplay)}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 scale-[1.12] border-0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen={false}
          loading={loading}
        />
      </div>
    );
  }

  function ZoomedDual({
    className: wrapClass,
    primary,
    secondary,
    eagerPrimary,
  }: {
    className?: string;
    primary: AmbientClip;
    secondary?: AmbientClip | null;
    eagerPrimary?: boolean;
  }) {
    const aOn = dualLayer ? phase === "a" : true;
    const bOn = dualLayer ? phase === "b" : false;
    return (
      <div
        ref={zoomWrapRef}
        className={cn("absolute inset-0 origin-center", wrapClass)}
      >
        <Layer
          clip={primary}
          loading={eagerPrimary ? "eager" : "lazy"}
          opacityClass={cn(
            "transition-opacity duration-[1100ms] ease-out",
            aOn ? "opacity-100" : dualLayer ? "opacity-0" : "opacity-100"
          )}
        />
        {secondary && dualLayer ? (
          <Layer
            clip={secondary}
            loading="eager"
            opacityClass={cn(
              "transition-opacity duration-[1100ms] ease-out",
              bOn ? "opacity-100" : "opacity-0"
            )}
          />
        ) : null}
      </div>
    );
  }

  const warmFallback = (
    <div
      className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-white to-[#f3efe8]"
      aria-hidden
    />
  );

  const fallbackMp4 = SITE.heroVideoUrl?.trim();

  if (!len || !current) {
    return (
      <div
        ref={rootRef}
        className={cn("pointer-events-none", className)}
        aria-hidden
      >
        {fallbackMp4 ? (
          <video
            src={fallbackMp4}
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.42] blur-[48px]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : null}
        {warmFallback}
      </div>
    );
  }

  const active = current;

  return (
    <div
      ref={rootRef}
      className={cn("pointer-events-none select-none", className)}
      aria-hidden
    >
      {warmFallback}

      {variant === "hero" ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-[0.58] blur-[52px] sm:blur-3xl">
            <ZoomedDual
              eagerPrimary
              primary={active}
              secondary={next}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/88 via-white/72 to-[#faf8f5]/96" />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-cream/35 via-transparent to-brand-gold/[0.12]" />
          <div className="absolute inset-0 ring-1 ring-black/[0.04]" />
        </div>
      ) : null}

      {variant === "section-soft" ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.38] blur-3xl">
            <ZoomedDual primary={active} secondary={next} />
          </div>
          <div className="absolute inset-0 bg-[#faf8f5]/92 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/78 via-transparent to-white/90" />
        </div>
      ) : null}

      {variant === "split-left" ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 hidden w-[min(44%,520px)] overflow-hidden lg:block">
            <div className="absolute inset-0 opacity-[0.52] blur-3xl">
              <ZoomedDual
                className="scale-110"
                primary={active}
                secondary={next}
              />
            </div>
            <div className="absolute inset-0 rounded-r-[2.25rem] ring-1 ring-black/[0.05]">
              <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/82 to-transparent" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfcfa] via-white to-[#faf8f5] lg:pointer-events-none lg:bg-gradient-to-r lg:from-transparent lg:via-white/92 lg:to-[#faf8f6]" />
          <div className="pointer-events-none absolute -right-32 top-1/4 hidden h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl lg:block" />
        </div>
      ) : null}

      {variant === "masked-blob" ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-[12%] top-10 hidden h-[min(420px,48vh)] w-[min(620px,92vw)] overflow-hidden rounded-[2.25rem] shadow-[0_24px_60px_-22px_rgba(26,26,26,0.12)] ring-1 ring-black/[0.06] md:block">
            <div className="relative h-full w-full opacity-90">
              <div className="absolute inset-0 blur-2xl">
                <ZoomedDual primary={active} secondary={next} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tl from-white/92 via-white/40 to-transparent" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#fdfcfa]/95 via-white/85 to-transparent" />
        </div>
      ) : null}

      {variant === "floating-orbs" ? (
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.videoId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute -left-10 top-[-6%] h-56 w-56 overflow-hidden rounded-full opacity-[0.18] blur-3xl md:h-[18rem] md:w-[18rem]"
                animate={
                  reduceMotion ? undefined : { y: [0, -10, 0], x: [0, 6, 0] }
                }
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <iframe
                  title=""
                  src={youtubeAmbientEmbedSrc(
                    list[idx % len].videoId,
                    autoplay
                  )}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 border-0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen={false}
                  loading="eager"
                />
              </motion.div>
              {len > 1 ? (
                <motion.div
                  className="absolute right-[2%] top-[18%] h-44 w-44 overflow-hidden rounded-full opacity-[0.14] blur-3xl md:h-52 md:w-52"
                  animate={
                    reduceMotion ? undefined : { y: [0, 12, 0], x: [0, -8, 0] }
                  }
                  transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <iframe
                    title=""
                    src={youtubeAmbientEmbedSrc(
                      list[(idx + 2) % len].videoId,
                      autoplay
                    )}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 border-0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen={false}
                    loading="lazy"
                  />
                </motion.div>
              ) : null}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#faf8f5]/93 to-white" />
        </div>
      ) : null}

      {variant === "strip" ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-[-6%] top-1/2 min-h-[6.75rem] w-[112%] -translate-y-1/2 opacity-40 blur-[40px] md:min-h-[8rem]">
            <ZoomedDual primary={active} secondary={next} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-[#fdfcfa]/95 to-white" />
        </div>
      ) : null}
    </div>
  );
}
