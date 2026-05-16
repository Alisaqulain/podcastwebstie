"use client";

/**
 * Netflix-style hero: fullscreen **landscape cover** YouTube embeds + scrims.
 * No zoom or drift — only smooth crossfades between clips.
 */

import {
  useEffect,
  useMemo,
  useState,
  memo,
} from "react";
import { useReducedMotion } from "framer-motion";
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

  const current = len ? list[idx % len] : null;
  const next = len > 1 ? list[(idx + 1) % len] : null;

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

  const autoplay = armed && !reduceMotion && Boolean(current);

  if (!len || !current) {
    return (
      <div
        className={cn(
          "pointer-events-none bg-gradient-to-br from-[color:var(--video-fallback-from)] via-[color:var(--video-fallback-via)] to-[color:var(--video-fallback-to)]",
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
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ambient-scrim-top)] via-[color:var(--ambient-scrim-mid)] to-[color:var(--ambient-scrim-bottom)]" />
      </div>
    );
  }

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
      <div className="absolute inset-0 overflow-hidden">
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

      <div
        className="absolute inset-0 z-[4] bg-gradient-to-b from-[color:var(--ambient-scrim-top)] via-[color:var(--ambient-scrim-mid)] to-[color:var(--ambient-scrim-bottom)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[4] bg-gradient-to-tr from-brand-gold/8 via-transparent to-brand-red/[0.04]"
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
