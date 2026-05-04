"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { TestimonialItem } from "./testimonial-slider";
import { ImageCard } from "@/components/ui/image-card";
import { cn } from "@/lib/utils";

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
      whileHover={{ y: -3 }}
      className="glass-panel rounded-3xl border border-luxury-border p-6 shadow-luxury-card transition-shadow hover:border-brand-gold/35 hover:shadow-gold-glow"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          {item.image ? (
            <ImageCard
              type="testimonial"
              testimonialShape="square"
              src={item.image}
              alt={`${item.name} — testimonial photo`}
              className="h-12 w-12 shadow-sm ring-1 ring-luxury-border"
              sizes="48px"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-luxury-border bg-luxury-bg text-sm font-display text-brand-gold-deep shadow-inner">
              {item.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-display font-semibold text-luxury-heading">
            {item.name}
          </p>
          {item.rating ? (
            <div className="mt-1 flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < item.rating!
                      ? "fill-brand-gold text-brand-gold"
                      : "text-luxury-border"
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-luxury-body line-clamp-4">
        {item.message}
      </p>
    </motion.div>
  );
}
