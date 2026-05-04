"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageCard } from "@/components/ui/image-card";

export type TestimonialItem = {
  id?: string;
  name: string;
  message: string;
  image?: string;
  rating?: number;
};

export function TestimonialSlider({ items }: { items: TestimonialItem[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[i];

  return (
    <div className="relative mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id ?? i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-10"
        >
          <Quote className="absolute right-6 top-6 h-10 w-10 text-brand-gold/25" />
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-8 md:text-left">
            <div className="relative h-20 w-20 shrink-0">
              {current.image ? (
                <ImageCard
                  type="testimonial"
                  testimonialShape="circle"
                  src={current.image}
                  alt={`${current.name} — testimonial photo`}
                  className="h-20 w-20 shadow-md ring-2 ring-brand-gold/25"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-luxury-border bg-luxury-bg font-display text-xl text-brand-gold-deep shadow-inner">
                  {current.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg leading-relaxed text-luxury-body md:text-xl">
                “{current.message}”
              </p>
              <p className="mt-6 font-display text-lg font-semibold text-luxury-heading">
                {current.name}
              </p>
              {current.rating ? (
                <div
                  className="mt-2 flex justify-center gap-0.5 md:justify-start"
                  aria-label={`${current.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < current.rating!
                          ? "fill-brand-gold text-brand-gold"
                          : "text-luxury-border"
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {items.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            className="rounded-xl border border-luxury-border bg-luxury-bg p-2 text-luxury-heading transition hover:border-brand-gold/40 hover:bg-brand-gold/10"
            onClick={() => setI((v) => (v - 1 + items.length) % items.length)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to testimonial ${idx + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  idx === i ? "w-8 bg-brand-gold" : "w-2 bg-luxury-border"
                )}
                onClick={() => setI(idx)}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonial"
            className="rounded-xl border border-luxury-border bg-luxury-bg p-2 text-luxury-heading transition hover:border-brand-gold/40 hover:bg-brand-gold/10"
            onClick={() => setI((v) => (v + 1) % items.length)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
