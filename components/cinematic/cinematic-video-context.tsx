"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";
import { clipsFromEpisodes, type AmbientClip } from "@/lib/youtube-ambient";

export const CINEMATIC_ROTATE_MS = 30_000;

type CinematicVideoContextValue = {
  episodes: PodcastEpisodeCard[];
  clips: AmbientClip[];
  /** Current background clip index */
  index: number;
  /** Crossfade phase for dual-layer transitions */
  phase: "a" | "b";
  /** True after short delay — enables iframe autoplay policy */
  armed: boolean;
  reduceMotion: boolean;
  currentClip: AmbientClip | null;
  nextClip: AmbientClip | null;
};

const CinematicVideoContext = createContext<CinematicVideoContextValue | null>(
  null
);

export function useCinematicVideo(): CinematicVideoContextValue | null {
  return useContext(CinematicVideoContext);
}

/** Throws if used outside `CinematicVideoProvider` — valid React hook name for ESLint. */
export function useCinematicVideoRequired(): CinematicVideoContextValue {
  const v = useContext(CinematicVideoContext);
  if (!v) {
    throw new Error("useCinematicVideo: missing CinematicVideoProvider");
  }
  return v;
}

type ProviderProps = {
  episodes: PodcastEpisodeCard[];
  children: ReactNode;
  rotateMs?: number;
};

/**
 * Global cinematic rotation + clip metadata for synced background layers (home).
 */
export function CinematicVideoProvider({
  episodes,
  children,
  rotateMs = CINEMATIC_ROTATE_MS,
}: ProviderProps) {
  const reduceMotion = useReducedMotion();
  const clips = useMemo(
    () => clipsFromEpisodes(episodes.filter(Boolean)),
    [episodes]
  );
  const len = clips.length;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"a" | "b">("a");
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), 320);
    return () => window.clearTimeout(t);
  }, []);

  const advance = useCallback(() => {
    if (len <= 1) return;
    setPhase((p) => (p === "a" ? "b" : "a"));
    setIndex((i) => (i + 1) % len);
  }, [len]);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion || len <= 1) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(advance, rotateMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [advance, len, reduceMotion, rotateMs]);

  const currentClip = len ? clips[index % len] : null;
  const nextClip = len > 1 ? clips[(index + 1) % len] : null;

  const value = useMemo(
    (): CinematicVideoContextValue => ({
      episodes,
      clips,
      index,
      phase,
      armed,
      reduceMotion: Boolean(reduceMotion),
      currentClip,
      nextClip,
    }),
    [
      episodes,
      clips,
      index,
      phase,
      armed,
      reduceMotion,
      currentClip,
      nextClip,
    ]
  );

  return (
    <CinematicVideoContext.Provider value={value}>
      {children}
    </CinematicVideoContext.Provider>
  );
}

/** Alias — Netflix-style global background rotation */
export const BackgroundVideoProvider = CinematicVideoProvider;
