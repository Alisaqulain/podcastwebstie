"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { TestimonialItem } from "./testimonial-slider";

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
        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-brand-gold/15 bg-brand-cream">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-display text-brand-gold-deep">
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
