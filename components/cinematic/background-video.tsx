"use client";

/**
 * Netflix-style hero: fullscreen **landscape cover** YouTube embeds + light scrims.
 * Headline / UI updates must NOT remount iframes — wrapped in React.memo + stable motion props.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import gsap from "gsap";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import type { AmbientClip } from "@/lib/youtube-ambient";
import { youtubeAmbientEmbedSrc } from "@/lib/youtube-ambient";
import {
  CINEMATIC_ROTATE_MS,
  useCinematicVideo,
} from "./cinematic-video-context";
import { VIDEO_CROSSFADE_MS } from "./video-transition-system";

type Props = {
  clips: AmbientClip[];
  startOffset?: number;
  className?: string;
  intervalMs?: number;
};

function clipsSignature(clips: AmbientClip[]) {
  return clips.map((c) => c.videoId).join("|");
}

function BackgroundVideoInner({
  clips: clipsProp,
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

  const idx = synced ? (ctx!.index + startOffset) % Math.max(len, 1) : idxLocal;
  const phase = synced ? ctx!.phase : phaseLocal;
  const armed = synced ? ctx!.armed : armedLocal;
  const reduceMotion = synced ? ctx!.reduceMotion : Boolean(reduceMotionFramer);

  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const current = len ? list[idx % len] : null;
  const next = len > 1 ? list[(idx + 1) % len] : null;

  /** Stable object identities — parent headline slider must not restart Framer animations. */
  const driftAnimate = useMemo(
    () => ({ x: [0, 5, -4, 0], y: [0, -4, 3, 0] }),
    []
  );
  const driftTransition = useMemo(
    (): Transition => ({
      duration: 64,
      repeat: Infinity,
      ease: "easeInOut",
    }),
    []
  );

  const coverScale = SITE.heroVideoCoverScale;

  useEffect(() => {
    if (synced) return;
    const id = window.setTimeout(() => setArmedLocal(true), 280);
    return () => window.clearTimeout(id);
  }, [synced]);

  useEffect(() => {
    if (synced || !len || len <= 1 || reduceMotion) return;
    const t = window.setInterval(() => {
      setPhaseLocal((p) => (p === "a" ? "b" : "a"));
      setIdxLocal((v) => (v + 1) % len);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [synced, len, reduceMotion, intervalMs]);

  /** Slow continuous zoom — only reset when the clip id changes. */
  useEffect(() => {
    const wrap = zoomWrapRef.current;
    if (!wrap || reduceMotion || !current) {
      tweenRef.current?.kill();
      tweenRef.current = null;
      return;
    }

    gsap.set(wrap, { scale: 1 });
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(wrap, {
      scale: 1.02,
      duration: 56,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zoom must not reset each crossfade
  }, [current?.videoId, reduceMotion]);

  const autoplay = armed && !reduceMotion && Boolean(current);

  if (!len || !current) {
    return (
      <div
        className={cn(
          "pointer-events-none bg-gradient-to-br from-[#f8f5f0] via-white to-[#efe8dc]",
          className
        )}
        aria-hidden
      />
    );
  }

  if (reduceMotion) {
    const poster = `https://img.youtube.com/vi/${current.videoId}/maxresdefault.jpg`;
    return (
      <div
        className={cn("pointer-events-none overflow-hidden", className)}
        aria-hidden
      >
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/38 via-white/26 to-[#faf8f5]/42" />
      </div>
    );
  }

  /** Full-viewport landscape cover (16:9 box) centered on subjects; long-form uploads only upstream. */
  function CoverIframe({
    clip,
    loading,
  }: {
    clip: AmbientClip;
    loading: "eager" | "lazy";
  }) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            width: "max(100vw, 177.77vh)",
            height: "max(56.25vw, 100vh)",
            transform: `translate(-50%, -50%) scale(${coverScale})`,
          }}
        >
          <iframe
            title=""
            src={youtubeAmbientEmbedSrc(clip.videoId, autoplay)}
            className="pointer-events-none h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen={false}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  function FilmLayer({
    clip,
    visible,
    loading,
  }: {
    clip: AmbientClip;
    visible: boolean;
    loading: "eager" | "lazy";
  }) {
    return (
      <div
        key={clip.videoId}
        style={{ transitionDuration: `${VIDEO_CROSSFADE_MS}ms` }}
        className={cn(
          "absolute inset-0 transform-gpu transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)]",
          visible
            ? "z-[3] opacity-100"
            : "pointer-events-none z-[2] opacity-[0.02]"
        )}
        aria-hidden
      >
        <CoverIframe clip={clip} loading={loading} />
      </div>
    );
  }

  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden>
      <motion.div
        className="absolute inset-0 overflow-hidden will-change-transform"
        animate={reduceMotion ? undefined : driftAnimate}
        transition={driftTransition}
      >
        <div
          ref={zoomWrapRef}
          className="absolute inset-0 origin-center will-change-transform"
        >
          {next ? (
            <>
              <FilmLayer
                clip={current}
                visible={phase === "a"}
                loading="eager"
              />
              <FilmLayer clip={next} visible={phase === "b"} loading="eager" />
            </>
          ) : (
            <FilmLayer clip={current} visible loading="eager" />
          )}
        </div>
      </motion.div>

      <div
        className="absolute inset-0 z-[4] bg-gradient-to-b from-white/[0.22] via-white/[0.14] to-[#f3ebe3]/[0.28]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[4] bg-gradient-to-tr from-amber-50/12 via-transparent to-rose-950/[0.045]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[4] shadow-[inset_0_0_100px_rgba(255,255,255,0.18)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[4] shadow-[inset_0_0_160px_rgba(26,26,26,0.035)]"
        aria-hidden
      />
    </div>
  );
}

export const BackgroundVideo = memo(BackgroundVideoInner, (prev, next) => {
  return (
    clipsSignature(prev.clips) === clipsSignature(next.clips) &&
    prev.startOffset === next.startOffset &&
    prev.intervalMs === next.intervalMs &&
    prev.className === next.className
  );
});

BackgroundVideo.displayName = "BackgroundVideo";
