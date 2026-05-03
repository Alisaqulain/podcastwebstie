"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";

export function CtaSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-4xl bg-brand-dark px-8 py-14 text-center text-brand-cream shadow-2xl md:px-16"
        >
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-gold/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-brand-gold-deep/30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              Ready when you are
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold md:text-4xl">
              Let your next chapter sound like you
            </h2>
            <p className="mt-4 text-brand-cream/75">
              Book a private coaching conversation or start with the podcast—
              both are invitations to practice powerful expression.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-brand-dark shadow-gold-glow transition hover:brightness-105"
              >
                Book a Session
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-brand-cream backdrop-blur transition hover:bg-white/15"
              >
                Watch the Podcast
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
