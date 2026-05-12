"use client";

/** Crossfade length — match BackgroundVideo / ambient layers (~2s feels seamless). */
export const VIDEO_CROSSFADE_MS = 2200;

export function phaseVisible(
  phase: "a" | "b",
  layer: "a" | "b",
  dualLayer: boolean
): boolean {
  if (!dualLayer) return true;
  return phase === layer;
}
