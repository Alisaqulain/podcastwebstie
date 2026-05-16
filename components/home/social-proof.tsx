"use client";

import { IconVideo, IconInstagram } from "@/components/icons/social-icons";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
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
            <Button
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-3"
            >
              <IconVideo className="h-5 w-5" />
              YouTube
            </Button>
            <Button
              href={SITE.social.instagram}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-3"
            >
              <IconInstagram className="h-5 w-5" />
              Instagram
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
