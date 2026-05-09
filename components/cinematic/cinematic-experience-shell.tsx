"use client";

import type { ReactNode } from "react";
import type { PodcastEpisodeCard } from "@/lib/podcast-episodes";
import { CinematicVideoProvider } from "./cinematic-video-context";

type Props = {
  episodes: PodcastEpisodeCard[];
  children: ReactNode;
};

/** Wraps the marketing home page so background video layers share one rotation clock. */
export function CinematicExperienceShell({ episodes, children }: Props) {
  return (
    <CinematicVideoProvider episodes={episodes}>
      {children}
    </CinematicVideoProvider>
  );
}
