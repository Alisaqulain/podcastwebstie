"use client";

import { AmbientVideoBackdrop } from "./ambient-video-backdrop";
import type { AmbientClip } from "@/lib/youtube-ambient";

/** Slim ambient band — light, breathable, cinematic glue between sections. */
export function CinematicStripDivider({
  clips,
  startOffset = 1,
}: {
  clips: AmbientClip[];
  startOffset?: number;
}) {
  if (!clips?.length) {
    return (
      <div
        className="relative isolate h-10 bg-gradient-to-r from-transparent via-brand-gold/[0.08] to-transparent"
        aria-hidden
      />
    );
  }

  return (
    <div className="relative isolate h-12 overflow-hidden md:h-16">
      <AmbientVideoBackdrop
        clips={clips}
        variant="strip"
        startOffset={startOffset}
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-luxury-bg via-transparent to-luxury-bg" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
    </div>
  );
}
