"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ImageCard } from "@/components/ui/image-card";

export type BlogCardData = {
  id?: string;
  slug: string;
  title: string;
  coverImage?: string;
  seoDescription?: string;
  createdAt?: string | Date;
};

export function BlogCard({ blog, index }: { blog: BlogCardData; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-gold/12 bg-white/60 shadow-sm backdrop-blur"
    >
      <Link href={`/blog/${blog.slug}`} className="relative block p-2">
        <ImageCard
          type="blog"
          src={blog.coverImage}
          alt={`Cover image for article: ${blog.title}`}
          className="shadow-none ring-1 ring-brand-gold/10"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-brand-gold-deep">
          {blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Journal"}
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-brand-dark group-hover:text-brand-gold-deep">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h2>
        {blog.seoDescription ? (
          <p className="mt-3 line-clamp-3 text-sm text-brand-dark/65">
            {blog.seoDescription}
          </p>
        ) : null}
        <Link
          href={`/blog/${blog.slug}`}
          className="mt-auto pt-6 text-sm font-semibold text-brand-gold-deep hover:underline"
        >
          Read article
        </Link>
      </div>
    </motion.article>
  );
}
