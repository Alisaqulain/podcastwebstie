import { NextResponse } from "next/server";
import { getLatestPodcastEpisodesForHome } from "@/lib/podcast-episodes";

/** Matches default YouTube ISR window (~5 min); tune via YOUTUBE_REVALIDATE_SECONDS */
export const revalidate = 300;

export async function GET() {
  const episodes = await getLatestPodcastEpisodesForHome(24);

  return NextResponse.json(
    {
      ok: true,
      updatedAt: new Date().toISOString(),
      count: episodes.length,
      episodes,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
