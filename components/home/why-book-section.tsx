"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Clapperboard,
  LineChart,
  Mic2,
  Share2,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { GoldButton } from "@/components/ui/gold-button";

const valueCards = [
  {
    icon: Users,
    title: "Massive audience reach",
    copy: "Tap into a podcast audience that shows up for real stories—not noise.",
  },
  {
    icon: Sparkles,
    title: "Premium production",
    copy: "Lighting, sound, and pacing that feel documentary-level, not DIY.",
  },
  {
    icon: LineChart,
    title: "Authority that compounds",
    copy: "Long-form depth builds trust faster than a carousel ever will.",
  },
  {
    icon: Share2,
    title: "Promo that travels",
    copy: "Short-form cutdowns and assets designed for social discovery.",
  },
  {
    icon: Mic2,
    title: "Conversations with signal",
    copy: "Interview craft that keeps your message clear, human, and memorable.",
  },
  {
    icon: Video,
    title: "Cinematic presence",
    copy: "Story-first framing that reflects the quality of your brand.",
  },
  {
    icon: Clapperboard,
    title: "Repurposable IP",
    copy: "Turn one session into clips, quotes, thumbnails, and evergreen content.",
  },
  {
    icon: BadgeCheck,
    title: "Trust, on record",
    copy: "Credibility you can link to—episode pages, SEO, and evergreen search.",
  },
] as const;

const steps = [
  { title: "Discovery", desc: "Audience, message, and storyline—locked in." },
  { title: "Session design", desc: "Talking points that still feel like you." },
  { title: "Record", desc: "Studio calm, premium capture, zero chaos." },
  { title: "Edit & polish", desc: "Sound, pacing, and cinematic finish." },
  { title: "Launch", desc: "YouTube + social assets aligned to your launch." },
];

const stats = [
  { label: "Total views (channel)", value: "Growing weekly" },
  { label: "Episodes published", value: "Consistency-first" },
  { label: "Guest trust", value: "Verified social proof" },
  { label: "Engagement", value: "Story-led formats" },
];

export function WhyBookSection() {
  return (
    <section
      id="why-book"
      className="scroll-mt-28 border-t border-luxury-border bg-luxury-bg py-20 md:py-28"
      aria-labelledby="why-book-heading"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold-deep">
            Why book a slot
          </p>
          <h2
            id="why-book-heading"
            className="mt-4 font-display text-3xl font-semibold leading-tight text-luxury-heading sm:text-4xl md:text-[2.65rem]"
          >
            This isn’t exposure for exposure’s sake—
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              {" "}
              it’s a credibility engine
            </span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-luxury-body md:text-lg">
            Booking a slot means professionally featuring your story, business, or
            expertise to a wider audience through cinematic podcast production and
            strategic promotion—so people don’t just scroll past you, they remember
            you.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0 },
              }}
              className="glass-panel rounded-3xl px-5 py-6 text-center ring-1 ring-black/[0.04]"
            >
              <p className="font-display text-2xl font-semibold text-luxury-heading md:text-3xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {valueCards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
              className="glass-panel group rounded-3xl p-6 shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-1 hover:shadow-soft-xl"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gold/12 text-brand-gold-deep ring-1 ring-brand-gold/25">
                <c.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-luxury-heading">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-luxury-body">
                {c.copy}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-20 rounded-[2rem] border border-luxury-border bg-luxury-section/80 p-8 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-xl md:p-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
                Guest journey
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-luxury-heading md:text-3xl">
                A calm, premium process—end to end
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-luxury-body">
                You bring the story—we handle the production craft, distribution
                polish, and promo packaging so you leave with assets you’re proud
                to share.
              </p>
              <ul className="mt-6 flex flex-wrap gap-3 text-xs text-luxury-muted">
                <li className="rounded-full border border-luxury-border bg-luxury-bg px-3 py-1.5">
                  Limited monthly guest slots
                </li>
                <li className="rounded-full border border-luxury-border bg-luxury-bg px-3 py-1.5">
                  Brand-safe review &amp; approvals
                </li>
                <li className="rounded-full border border-luxury-border bg-luxury-bg px-3 py-1.5">
                  Editorial direction included
                </li>
              </ul>
            </div>
            <ol className="relative space-y-0">
              <div className="absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-brand-gold/50 via-luxury-border to-transparent md:left-4" />
              {steps.map((st, i) => (
                <li key={st.title} className="relative grid grid-cols-[auto_1fr] gap-4 pb-10 last:pb-0 md:gap-5">
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-[#1a1a1a] shadow-gold-glow md:h-9 md:w-9">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-luxury-heading">
                      {st.title}
                    </p>
                    <p className="mt-1 text-sm text-luxury-body">{st.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-luxury-border pt-8">
            <p className="max-w-xl text-sm text-luxury-muted">
              Want the full experience? See packages, calendar options, and secure
              checkout on the booking page—built to feel as premium as the episode
              itself.
            </p>
            <div className="flex flex-wrap gap-3">
              <GoldButton href="/book">Book your slot</GoldButton>
              <GoldButton href="/contact" variant="outline">
                Ask a question
              </GoldButton>
              <Link
                href="/podcast"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-brand-gold-deep underline-offset-4 hover:underline"
              >
                Preview episodes
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
