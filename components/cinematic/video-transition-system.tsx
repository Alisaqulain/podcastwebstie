"use client";

/** Shared timing for crossfade + ambient rotation */
export const VIDEO_CROSSFADE_MS = 1100;

export function phaseVisible(
  phase: "a" | "b",
  layer: "a" | "b",
  dualLayer: boolean
): boolean {
  if (!dualLayer) return true;
  return phase === layer;
}
