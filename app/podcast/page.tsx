import type { Metadata } from "next";
import { PodcastDirectory } from "@/components/podcast/podcast-directory";
import { listPodcastsPublic } from "@/lib/list-podcasts-public";
import { SITE } from "@/lib/site";

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

export default async function PodcastPage() {
  const initial = await listPodcastsPublic();
  return <PodcastDirectory initial={initial} />;
}
