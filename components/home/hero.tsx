"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GoldButton } from "@/components/ui/gold-button";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";
import { SiteLogo } from "@/components/brand/site-logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-6 md:pb-28">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-gold-deep/15 blur-3xl" />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-deep shadow-sm backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Podcaster · Coach · Speaker
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-brand-dark sm:text-5xl md:text-6xl"
            >
              Expression is{" "}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                Power
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-brand-dark/75"
            >
              Empowering women to speak with clarity, lead with confidence, and
              build a self-image that matches their ambition—through coaching,
              conversations, and the {SITE.name} Podcast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <GoldButton href={SITE.social.youtube}>Watch the Podcast</GoldButton>
              <GoldButton href="/contact" variant="outline">
                Book a Session
              </GoldButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-8 text-sm text-brand-dark/55"
            >
              Namrata Tiwary Singh · Founder & Host · Self Image Coach
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="glass-panel relative overflow-hidden rounded-4xl p-2 shadow-card">
              <div className="relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl">
                <div className="relative min-h-[48%] flex-1 bg-brand-dark">
                  <SiteLogo fill className="!p-4 sm:!p-5" />
                </div>
                <div className="flex flex-1 flex-col justify-end bg-gradient-to-br from-brand-cream via-white to-brand-gold/15 p-8">
                  <p className="font-display text-2xl text-brand-dark md:text-3xl">
                    “Your voice becomes your legacy.”
                  </p>
                  <p className="mt-3 text-sm text-brand-dark/60">
                    Luxury coaching for women ready to be seen—on their terms.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-white/50 bg-white/70 px-5 py-3 text-sm font-medium text-brand-dark shadow-lg backdrop-blur md:block">
              Confidence · Clarity · Self-belief
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
