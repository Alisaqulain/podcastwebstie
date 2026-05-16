"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  type AmbientClip,
  youtubeAmbientEmbedSrc,
  youtubePosterSrc,
} from "@/lib/youtube-ambient";
import {
  CINEMATIC_ROTATE_MS,
  useCinematicVideo,
} from "./cinematic-video-context";
import { VIDEO_CROSSFADE_MS } from "./video-transition-system";
import { SITE } from "@/lib/site";

export type AmbientVideoVariant =
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
  /**
   * `poster` — still frame only (fast, no iframe).
   * `auto` — mount embed when in view (hero-adjacent sections only).
   */
  playback?: "auto" | "poster";
};

export function AmbientVideoBackdrop({
  clips: clipsProp,
  variant,
  startOffset = 0,
  className,
  intervalMs = CINEMATIC_ROTATE_MS,
  playback = "poster",
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
  const [inView, setInView] = useState(false);

  const idx = synced ? (ctx!.index + startOffset) % Math.max(len, 1) : idxLocal;
  const phase = synced ? ctx!.phase : phaseLocal;
  const armed = synced ? ctx!.armed : armedLocal;
  const reduceMotion = synced ? ctx!.reduceMotion : Boolean(reduceMotionFramer);

  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const current = len ? list[idx % len] : null;
  const next =
    len > 1 ? list[(idx + 1) % len] : null;

  const dualLayer =
    variant === "section-soft" ||
    variant === "split-left" ||
    variant === "strip" ||
    variant === "masked-blob";

  useEffect(() => {
    if (synced || playback === "poster") return;
    const id = window.setTimeout(() => setArmedLocal(true), 120);
    return () => window.clearTimeout(id);
  }, [synced, playback]);

  useEffect(() => {
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

  const mountEmbed =
    playback === "auto" &&
    armed &&
    inView &&
    !reduceMotion &&
    Boolean(current);

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
      <div
        className={cn("absolute inset-0 transform-gpu transition-opacity", opacityClass)}
        style={{ transitionDuration: `${VIDEO_CROSSFADE_MS}ms` }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={youtubePosterSrc(clip.videoId)}
          alt=""
          className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 scale-[1.12] object-cover"
          loading={loading}
          decoding="async"
        />
        {mountEmbed ? (
          <iframe
            title=""
            src={youtubeAmbientEmbedSrc(clip.videoId, true)}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 scale-[1.12] border-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
            loading={loading}
          />
        ) : null}
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
        className={cn("absolute inset-0 origin-center", wrapClass)}
      >
        <Layer
          clip={primary}
          loading={eagerPrimary ? "eager" : "lazy"}
          opacityClass={cn(
            "ease-out",
            aOn ? "opacity-100" : dualLayer ? "opacity-[0.02]" : "opacity-100"
          )}
        />
        {secondary && dualLayer ? (
          <Layer
            clip={secondary}
            loading="eager"
            opacityClass={cn(
              "ease-out",
              bOn ? "opacity-100" : "opacity-[0.02]"
            )}
          />
        ) : null}
      </div>
    );
  }

  const warmFallback = (
    <div
      className="absolute inset-0 bg-gradient-to-br from-[color:var(--video-fallback-from)] via-[color:var(--video-fallback-via)] to-[color:var(--video-fallback-to)]"
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

      {variant === "section-soft" ? (
        <div className="absolute inset-0 overflow-hidden">
          {/* Sharp embeds + light veil — motion stays readable (booking / latest podcasts) */}
          <div className="absolute inset-0 opacity-[0.72] max-md:opacity-[0.62] md:blur-[1px]">
            <ZoomedDual eagerPrimary primary={active} secondary={next} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ambient-scrim-top)] via-[color:var(--ambient-scrim-mid)] to-[color:var(--ambient-scrim-bottom)]" />
        </div>
      ) : null}

      {variant === "split-left" ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 hidden w-[min(44%,520px)] overflow-hidden lg:block">
            <div className="absolute inset-0 opacity-[0.72] blur-[2px]">
              <ZoomedDual
                className="scale-110"
                eagerPrimary
                primary={active}
                secondary={next}
              />
            </div>
            <div className="absolute inset-0 rounded-r-[2.25rem] ring-1 ring-[color:var(--overlay-ring)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--ambient-scrim-mid)] via-[color:var(--ambient-scrim-top)] to-transparent" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ambient-scrim-top)] via-[color:var(--luxury-bg)] to-[color:var(--luxury-bg)] lg:pointer-events-none lg:bg-gradient-to-r lg:from-transparent lg:via-[color:var(--ambient-scrim-mid)] lg:to-[color:var(--luxury-bg)]" />
          <div className="pointer-events-none absolute -right-32 top-1/4 hidden h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl lg:block" />
        </div>
      ) : null}

      {variant === "masked-blob" ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-[12%] top-10 hidden h-[min(420px,48vh)] w-[min(620px,92vw)] overflow-hidden rounded-[2.25rem] shadow-luxury-card ring-1 ring-[color:var(--overlay-ring)] md:block">
            <div className="relative h-full w-full opacity-95">
              <div className="absolute inset-0 blur-[3px]">
                <ZoomedDual eagerPrimary primary={active} secondary={next} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tl from-[color:var(--ambient-scrim-top)] via-[color:var(--ambient-scrim-mid)] to-transparent" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--ambient-scrim-top)] via-[color:var(--ambient-scrim-mid)] to-transparent" />
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
                className="absolute -left-10 top-[-6%] h-56 w-56 overflow-hidden rounded-full opacity-[0.38] blur-md md:h-[18rem] md:w-[18rem]"
                animate={
                  reduceMotion ? undefined : { y: [0, -10, 0], x: [0, 6, 0] }
                }
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={youtubePosterSrc(list[idx % len].videoId)}
                  alt=""
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 object-cover"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>
              {len > 1 ? (
                <div className="absolute right-[2%] top-[18%] h-44 w-44 overflow-hidden rounded-full opacity-[0.32] blur-md md:h-52 md:w-52">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={youtubePosterSrc(list[(idx + 2) % len].videoId)}
                    alt=""
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ambient-scrim-top)] via-[color:var(--ambient-scrim-mid)] to-[color:var(--ambient-scrim-bottom)]" />
        </div>
      ) : null}

      {variant === "strip" ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-[-6%] top-1/2 min-h-[6.75rem] w-[112%] -translate-y-1/2 opacity-[0.62] blur-[8px] md:min-h-[8rem] md:blur-[6px]">
            <ZoomedDual eagerPrimary primary={active} secondary={next} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--ambient-scrim-top)] via-[color:var(--ambient-scrim-mid)] to-[color:var(--ambient-scrim-top)]" />
        </div>
      ) : null}
    </div>
  );
}
