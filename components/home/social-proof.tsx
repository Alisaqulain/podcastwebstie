"use client";

import { motion } from "framer-motion";
import { IconVideo, IconInstagram } from "@/components/icons/social-icons";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";

export function SocialProof() {
  return (
    <section className="border-y border-brand-gold/15 bg-white/40 py-14 backdrop-blur-sm">
      <Container>
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
              Join the movement
            </p>
            <p className="mt-2 font-display text-2xl text-brand-dark md:text-3xl">
              Follow the journey on social
            </p>
            <p className="mt-2 max-w-lg text-sm text-brand-dark/65">
              New episodes, behind-the-scenes reflections, and coaching prompts
              to keep your confidence on track.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl bg-gold-gradient px-6 py-3 font-semibold text-brand-dark shadow-md"
            >
              <IconVideo className="h-5 w-5" />
              YouTube
            </motion.a>
            <motion.a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl border border-brand-gold/35 bg-white/70 px-6 py-3 font-semibold text-brand-dark backdrop-blur"
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
