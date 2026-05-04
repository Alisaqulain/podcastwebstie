"use client";

import { motion } from "framer-motion";
import { IconVideo, IconInstagram } from "@/components/icons/social-icons";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";

export function SocialProof() {
  return (
    <section className="border-y border-luxury-border bg-luxury-bg py-16 md:py-20">
      <Container>
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
              Join the movement
            </p>
            <p className="mt-2 font-display text-2xl text-luxury-heading md:text-3xl">
              Follow the journey on social
            </p>
            <p className="mt-2 max-w-lg text-sm text-luxury-muted">
              New episodes, behind-the-scenes reflections, and coaching prompts
              to keep your confidence on track.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-full bg-gold-gradient px-7 py-3 font-semibold text-[#1A1A1A] shadow-gold-glow transition hover:brightness-110"
            >
              <IconVideo className="h-5 w-5" />
              YouTube
            </motion.a>
            <motion.a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-full border-2 border-luxury-heading bg-transparent px-7 py-3 font-semibold text-luxury-heading transition hover:bg-luxury-heading hover:text-white"
            >
              <IconInstagram className="h-5 w-5" />
              Instagram
            </motion.a>
          </div>
        </div>
      </Container>
    </section>
  );
}
