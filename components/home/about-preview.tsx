"use client";

import { motion } from "framer-motion";
import { GoldButton } from "@/components/ui/gold-button";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";

export function AboutPreview() {
  return (
    <section className="border-t border-luxury-border bg-luxury-section py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="glass-panel rounded-4xl p-10 md:p-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
              About Namrata
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-luxury-heading md:text-4xl">
              A coach for the woman who is done playing small
            </h2>
            <p className="mt-6 leading-relaxed text-luxury-body">
              {SITE.description} Namrata blends executive presence with feminine
              warmth—helping you refine how you see yourself, how you speak, and
              how you show up in rooms that matter.
            </p>
            <p className="mt-4 leading-relaxed text-luxury-body">
              Whether you are rebuilding after a pivot, preparing for a big
              stage, or simply tired of doubting your reflection, this space is
              built to help you return to your power—gracefully, boldly, and
              without apology.
            </p>
            <div className="mt-8">
              <GoldButton href="/about" variant="outline">
                Read the full story
              </GoldButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="glass-panel rounded-4xl border border-luxury-border p-10 shadow-luxury-card">
              <ul className="space-y-6 text-luxury-body">
                <li className="flex gap-4">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-gold-deep" />
                  <div>
                    <p className="font-semibold text-luxury-heading">
                      Self-image coaching
                    </p>
                    <p className="text-sm text-luxury-muted">
                      Align your inner identity with the life you are building
                      outwardly.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-gold-deep" />
                  <div>
                    <p className="font-semibold text-luxury-heading">
                      Voice &amp; presence
                    </p>
                    <p className="text-sm text-luxury-muted">
                      Speak with clarity on podcasts, panels, and everyday
                      leadership moments.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-gold-deep" />
                  <div>
                    <p className="font-semibold text-luxury-heading">
                      The BHAW Namrata Podcast
                    </p>
                    <p className="text-sm text-luxury-muted">
                      Honest stories and frameworks you can apply between
                      episodes.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
