import type { Metadata } from "next";
import { PodcastDirectory } from "@/components/podcast/podcast-directory";
import { getDb } from "@/lib/mongodb";
import { SITE } from "@/lib/site";
import type { PodcastApi } from "@/components/podcast/podcast-directory";

export const metadata: Metadata = {
  title: "Podcast",
  description:
    "Watch BHAW Namrata Podcast episodes—real conversations for confidence, clarity, and self-belief.",
  openGraph: {
    title: `Podcast | ${SITE.name}`,
    description:
      "Explore episodes, watch on YouTube, and search the full library.",
  },
};

export const dynamic = "force-dynamic";

async function getInitial(): Promise<PodcastApi[]> {
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection("podcasts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((d) => ({
    _id: d._id.toString(),
    title: d.title as string,
    description: d.description as string,
    youtubeLink: d.youtubeLink as string,
    thumbnail: (d.thumbnail as string) || "",
    createdAt: d.createdAt ? new Date(d.createdAt as Date).toISOString() : undefined,
  }));
}

export default async function PodcastPage() {
  const initial = await getInitial();
  return <PodcastDirectory initial={initial} />;
}
