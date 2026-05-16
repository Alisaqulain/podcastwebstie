"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export function CtaSection() {
  return (
    <section className="border-t border-luxury-border bg-luxury-bg py-20 md:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel relative overflow-hidden rounded-4xl px-8 py-14 text-center md:px-16"
        >
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-brand-gold-light/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
              Ready when you are
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-luxury-heading md:text-4xl">
              Let your next chapter sound like you
            </h2>
            <p className="mt-4 text-luxury-body">
              Book a private coaching conversation or start with the podcast—
              both are invitations to practice powerful expression.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/book" size="lg">
                Book a Session
              </Button>
              <Button
                href={SITE.social.youtube}
                variant="secondary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch the Podcast
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
