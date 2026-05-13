/** Long-form podcast floor — excludes Shorts and typical clips. */
export const MIN_PODCAST_DURATION_SECONDS = 600;

export type LongFormEpisodeFilterShape = {
  title: string;
  durationSeconds?: number;
  mediaWidth?: number;
  mediaHeight?: number;
};

export function isLikelyYouTubeShortsTitle(title: string): boolean {
  const t = title.trim().toLowerCase();
  if (t.includes("#shorts")) return true;
  if (/\bshorts\b/i.test(t)) return true;
  return false;
}

export function isPortraitMediaDimensions(
  width: number | undefined,
  height: number | undefined
): boolean {
  if (
    width == null ||
    height == null ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return false;
  }
  return height > width * 1.08;
}

/**
 * Keeps landscape, long-form uploads. Drops Shorts by title, vertical framing,
 * and duration when metadata is available. Entries with no duration and no
 * dimensions (e.g. curated seed rows) are kept so the site never goes empty.
 */
export function filterLongFormLandscapeEpisodes<T extends LongFormEpisodeFilterShape>(
  episodes: T[]
): T[] {
  return episodes.filter((e) => {
    if (isLikelyYouTubeShortsTitle(e.title)) return false;

    const hasDuration =
      typeof e.durationSeconds === "number" && Number.isFinite(e.durationSeconds);
    const hasDims =
      typeof e.mediaWidth === "number" &&
      typeof e.mediaHeight === "number" &&
      e.mediaWidth > 0 &&
      e.mediaHeight > 0;

    if (hasDuration && e.durationSeconds! < MIN_PODCAST_DURATION_SECONDS) {
      return false;
    }
    if (hasDims && isPortraitMediaDimensions(e.mediaWidth, e.mediaHeight)) {
      return false;
    }
    if (hasDuration && hasDims) return true;
    if (hasDuration && !hasDims) return true;
    if (!hasDuration && hasDims) {
      return !isPortraitMediaDimensions(e.mediaWidth, e.mediaHeight);
    }
    return true;
  });
}
