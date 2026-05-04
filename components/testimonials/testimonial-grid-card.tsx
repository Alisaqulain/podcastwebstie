"use client";

import { motion } from "framer-motion";
import type { TestimonialItem } from "./testimonial-slider";
import { ImageCard } from "@/components/ui/image-card";

export function TestimonialGridCard({
  item,
  index,
}: {
  item: TestimonialItem;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="rounded-3xl border border-brand-gold/15 bg-white/55 p-6 shadow-sm backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          {item.image ? (
            <ImageCard
              type="testimonial"
              testimonialShape="square"
              src={item.image}
              alt={`${item.name} — testimonial photo`}
              className="h-12 w-12 shadow-sm ring-1 ring-brand-gold/15"
              sizes="48px"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/15 bg-brand-cream text-sm font-display text-brand-gold-deep shadow-sm">
              {item.name.charAt(0)}
            </div>
          )}
        </div>
        <p className="font-display font-semibold text-brand-dark">{item.name}</p>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-brand-dark/70 line-clamp-4">
        {item.message}
      </p>
    </motion.div>
  );
}
