"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { ImageCard } from "@/components/ui/image-card";

export type FeaturedPodcastItem = {
  id?: string;
  title: string;
  description: string;
  youtubeLink: string;
  thumbnail?: string;
};

export function FeaturedPodcastCard({
  item,
  index,
}: {
  item: FeaturedPodcastItem;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-brand-gold/15 bg-white/60 shadow-card backdrop-blur"
    >
      <Link href="/podcast" className="relative block p-2">
        <ImageCard
          type="podcast"
          src={item.thumbnail}
          alt={`Podcast episode: ${item.title}`}
          className="shadow-none ring-1 ring-brand-gold/10"
          sizes="(max-width:768px) 100vw, 33vw"
        >
          <span className="absolute inset-0 flex items-center justify-center bg-brand-dark/20 opacity-0 transition group-hover/image:opacity-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-lg">
              <Play className="h-6 w-6 fill-current" />
            </span>
          </span>
        </ImageCard>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-brand-dark">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-brand-dark/65">
          {item.description}
        </p>
        {item.youtubeLink ? (
          <Link
            href={item.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm font-semibold text-brand-gold-deep hover:underline"
          >
            Watch on YouTube
          </Link>
        ) : null}
      </div>
    </motion.article>
  );
}
