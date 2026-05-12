"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Eye, Play } from "lucide-react";
import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";
import {
  YOUTUBE_PREVIEW_CLIP_SECONDS,
  youtubeShortPreviewEmbedSrc,
} from "@/lib/youtube";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/ui/gold-button";
import { usePodcastPreviewPlayback } from "@/components/podcast/podcast-preview-playback";

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

function formatViews(n?: number) {
  if (typeof n !== "number") return "—";
  try {
    return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(n);
  } catch {
    return String(n);
  }
}

type Props = {
  episode: PodcastEpisodeCard;
  featured?: boolean;
  priorityImage?: boolean;
  /** If true, preview can start once when the card enters the viewport (exclusive group). */
  viewportPreview?: boolean;
};

export function PodcastPreviewCard({
  episode,
  featured,
  priorityImage,
  viewportPreview,
}: Props) {
  const playback = usePodcastPreviewPlayback();
  const [previewOn, setPreviewOn] = useState(false);
  const hoverRef = useRef(false);
  const viewportTriggered = useRef(false);
  const timerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stopPreview = useCallback(() => {
    setPreviewOn(false);
    playback?.release(episode.id);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [episode.id, playback]);

  const startPreview = useCallback(() => {
    playback?.request(episode.id);
    setPreviewOn(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setPreviewOn(false);
      playback?.release(episode.id);
      timerRef.current = null;
    }, YOUTUBE_PREVIEW_CLIP_SECONDS * 1000);
  }, [episode.id, playback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !episode.localPreviewUrl) return;
    if (!previewOn) {
      v.pause();
      v.currentTime = 0;
      return;
    }
    v.currentTime = 0;
    void v.play().catch(() => {});
  }, [previewOn, episode.localPreviewUrl]);

  useEffect(() => {
    if (!playback || !previewOn) return;
    if (playback.activeId !== episode.id) {
      setPreviewOn(false);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [playback, playback?.activeId, episode.id, previewOn]);

  useEffect(() => {
    if (!viewportPreview) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (
          e.isIntersecting &&
          e.intersectionRatio >= 0.35 &&
          !viewportTriggered.current &&
          !hoverRef.current
        ) {
          viewportTriggered.current = true;
          startPreview();
        }
      },
      { threshold: [0, 0.35, 0.55], rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [startPreview, viewportPreview]);

  const previewAllowed =
    previewOn && (!playback || playback.activeId === episode.id);

  return (
    <motion.article
      ref={rootRef}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[1.35rem] border border-luxury-border bg-luxury-section shadow-md ring-1 ring-black/[0.03] transition-shadow hover:shadow-soft-xl",
        featured && "md:col-span-2 lg:col-span-2 lg:row-span-1"
      )}
      onMouseEnter={() => {
        hoverRef.current = true;
        startPreview();
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        stopPreview();
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-luxury-bg",
          featured ? "aspect-[21/9] sm:aspect-[2.4/1]" : "aspect-video"
        )}
      >
        <motion.div
          className="absolute inset-0"
          animate={
            previewAllowed
              ? { scale: 1 }
              : { scale: 1.06 }
          }
          transition={{
            duration: previewOn ? 0.45 : 14,
            repeat: previewAllowed ? 0 : Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Image
            src={episode.thumbnailUrl}
            alt={episode.title}
            fill
            className={cn(
              "object-cover transition duration-700",
              previewAllowed ? "opacity-0" : "opacity-100"
            )}
            sizes={
              featured
                ? "(max-width:768px) 100vw, 90vw"
                : "(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            }
            priority={priorityImage}
          />
        </motion.div>

        {previewAllowed && episode.localPreviewUrl ? (
          <video
            ref={videoRef}
            src={episode.localPreviewUrl}
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-100 transition-opacity duration-500"
            muted
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : previewAllowed ? (
          <iframe
            title=""
            src={youtubeShortPreviewEmbedSrc(episode.videoId, true)}
            className="absolute inset-0 h-full w-full scale-[1.02] border-0 opacity-100 transition-opacity duration-500"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          aria-hidden
        />

        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-luxury-heading shadow-sm backdrop-blur-sm">
            <Calendar className="h-3 w-3 text-brand-gold-deep" />
            {formatPublished(episode.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-luxury-heading shadow-sm backdrop-blur-sm">
            <Eye className="h-3 w-3 text-brand-gold-deep" />
            {formatViews(episode.viewCount)} views
          </span>
        </div>

        {!previewAllowed ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-[#1A1A1A] shadow-gold-glow ring-2 ring-white/90">
              <Play className="h-6 w-6 fill-current" aria-hidden />
            </span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {featured ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-gold-deep">
            Latest episode
          </p>
        ) : null}
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-luxury-heading md:text-xl">
          {episode.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-luxury-muted">
          {episode.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <GoldButton
            href={episode.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 flex-1 justify-center sm:flex-none"
          >
            Watch full episode
          </GoldButton>
          <GoldButton
            href="/book"
            variant="outline"
            className="min-h-11 flex-1 justify-center sm:flex-none"
          >
            Book your slot
          </GoldButton>
        </div>
      </div>
    </motion.article>
  );
}
