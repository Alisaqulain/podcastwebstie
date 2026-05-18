"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { GoldButton } from "@/components/ui/gold-button";
import {
  FOUNDER_FEARS,
  FOUNDER_MISSION,
  FOUNDER_QUALIFICATIONS,
  FOUNDER_STORY_CLOSING,
  FOUNDER_STORY_CLOSING_LINE,
  FOUNDER_STORY_INTRO,
  FOUNDER_TAGLINE,
  FOUNDER_VISION,
} from "@/lib/founder-content";

function FounderSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: 0.08 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h3 className="font-display text-lg font-semibold text-luxury-heading">
          Educational Qualification &amp; Experience
        </h3>
        <ul className="mt-4 space-y-2.5">
          {FOUNDER_QUALIFICATIONS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-luxury-border bg-surface/90 px-4 py-2.5 text-sm text-luxury-body backdrop-blur-sm"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-gold-deep" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-panel rounded-3xl p-5 md:p-6">
        <h3 className="font-display text-lg font-semibold text-luxury-heading">
          Mission
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-luxury-body">
          {FOUNDER_MISSION}
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-5 md:p-6">
        <h3 className="font-display text-lg font-semibold text-luxury-heading">
          Vision
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-luxury-body">
          {FOUNDER_VISION}
        </p>
      </div>
    </motion.div>
  );
}

export function FounderSection() {
  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="border-t border-luxury-border bg-luxury-bg py-20 md:py-28"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
            Founder
          </p>
          <h2
            id="founder-heading"
            className="mt-3 font-display text-3xl font-semibold text-luxury-heading md:text-4xl"
          >
            BHAW Namrata
          </h2>
          <p className="mt-2 font-display text-lg text-brand-gold-deep md:text-xl">
            {FOUNDER_TAGLINE}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="lg:col-start-1 lg:row-start-1"
          >
            <div className="glass-panel overflow-hidden rounded-4xl p-2 shadow-luxury-card">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl sm:aspect-[4/5]">
                <Image
                  src="/founder.jpeg"
                  alt="Namrata, founder of BHAW Namrata, in her podcast studio"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover object-[center_15%]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/20 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <p className="px-4 py-3 text-center text-sm text-luxury-muted">
                Namrata Tiwary Singh · Founder &amp; Host
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="space-y-8 lg:col-start-2 lg:row-start-1 lg:row-span-2"
          >
            <div>
              <h3 className="font-display text-2xl font-semibold text-luxury-heading">
                My Story
              </h3>
              <div className="mt-5 space-y-4 leading-relaxed text-luxury-body">
                {FOUNDER_STORY_INTRO.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-luxury-border bg-luxury-bg/80 p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
                As a woman entrepreneur, I deeply understood the fears many people
                silently carry
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {FOUNDER_FEARS.map((fear) => (
                  <li
                    key={fear}
                    className="flex gap-3 text-sm text-luxury-body"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold-deep" />
                    {fear}
                  </li>
                ))}
              </ul>
            </div>

            {FOUNDER_STORY_CLOSING.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="leading-relaxed text-luxury-body"
              >
                {paragraph}
              </p>
            ))}
            <p className="font-display text-lg font-medium text-luxury-heading">
              {FOUNDER_STORY_CLOSING_LINE}
            </p>

            <GoldButton href="/about" variant="outline">
              Learn more about BHAW Namrata
            </GoldButton>
          </motion.div>

          <div className="lg:col-start-1 lg:row-start-2">
            <FounderSidebar />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
