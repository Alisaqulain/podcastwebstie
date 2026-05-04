"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";

export function NewsletterCta() {
  return (
    <section className="border-t border-luxury-border bg-luxury-section pb-20 md:pb-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel flex flex-col items-center gap-6 rounded-3xl px-8 py-10 text-center md:flex-row md:text-left"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-gradient text-[#1A1A1A] shadow-gold-glow">
            <Mail className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="font-display text-xl font-semibold text-luxury-heading">
              Stay close to the conversation
            </p>
            <p className="mt-2 text-sm text-luxury-muted">
              The simplest way to hear new episodes first is on YouTube—subscribe
              to {SITE.name} and turn on notifications.
            </p>
          </div>
          <a
            href={SITE.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-gold-gradient px-7 py-3 text-sm font-semibold text-[#1A1A1A] shadow-gold-glow transition hover:brightness-110 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            Subscribe on YouTube
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
