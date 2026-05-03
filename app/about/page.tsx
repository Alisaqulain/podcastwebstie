import type { Metadata } from "next";
import { GoldButton } from "@/components/ui/gold-button";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Namrata",
  description:
    "Mission, vision, and the self-image coaching philosophy behind BHAW Namrata.",
  openGraph: {
    title: `About | ${SITE.name}`,
    description:
      "Discover Namrata’s story, mission, and approach to self-image coaching.",
  },
};

export default function AboutPage() {
  return (
    <div className="pb-24">
      <section className="border-b border-brand-gold/10 bg-white/30 py-16 backdrop-blur-sm md:py-24">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-deep">
            About
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold text-brand-dark md:text-5xl">
            The woman behind the microphone—and the mirror.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-dark/75">
            {SITE.description}
          </p>
        </Container>
      </section>

      <Container className="mt-16 space-y-16 md:mt-24 md:space-y-24">
        <section className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="font-display text-3xl font-semibold text-brand-dark">
              The story
            </h2>
            <p className="mt-4 leading-relaxed text-brand-dark/75">
              Namrata built {SITE.name} as a home for honest dialogue—where
              ambition meets softness, and leadership doesn’t require you to
              harden. Her work sits at the intersection of personal branding,
              self-worth, and the quiet discipline of showing up consistently.
            </p>
            <p className="mt-4 leading-relaxed text-brand-dark/75">
              From boardrooms to recording studios, she has watched brilliant
              women mute their own voices—not for lack of skill, but because
              their self-image hadn’t caught up with their capability. That gap
              is where her coaching begins.
            </p>
          </div>
          <div className="glass-panel rounded-4xl p-8 md:p-10">
            <h3 className="font-display text-xl font-semibold text-brand-dark">
              Mission
            </h3>
            <p className="mt-3 text-brand-dark/75">
              To help women express themselves with clarity and conviction—so
              their presence feels as intentional as their résumé.
            </p>
            <h3 className="mt-8 font-display text-xl font-semibold text-brand-dark">
              Vision
            </h3>
            <p className="mt-3 text-brand-dark/75">
              A world where women trust their reflection, their voice, and their
              decisions—without waiting for permission.
            </p>
          </div>
        </section>

        <section className="rounded-4xl border border-brand-gold/15 bg-gradient-to-br from-white via-brand-cream to-brand-gold/10 p-10 md:p-14">
          <h2 className="font-display text-3xl font-semibold text-brand-dark">
            Self-image coaching—what it really means
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-brand-dark/75">
            Self-image work is not vanity—it is the internal architecture that
            decides how you negotiate, how you rest, and how boldly you pitch
            your ideas. Namrata helps you align what you believe about yourself
            with the life you are actively building: your career, your
            relationships, and your public voice.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Reframing self-talk that quietly caps your growth",
              "Presence practices for camera, stage, and real life",
              "Boundaries that protect your energy without guilt",
              "A personal brand that feels like you—not a costume",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl bg-white/60 px-4 py-3 text-sm text-brand-dark/80"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl font-semibold text-brand-dark">
            Professional branding—with soul
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-brand-dark/75">
            Whether you are stepping into video, launching a podcast, or
            refreshing how clients perceive you, Namrata treats branding as an
            expression of integrity. The goal is not performance—it is coherence.
            When your inner narrative matches your outer presence, people feel
            it immediately.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <GoldButton href="/contact">Work with Namrata</GoldButton>
            <GoldButton href="/podcast" variant="outline">
              Explore the podcast
            </GoldButton>
          </div>
        </section>
      </Container>
    </div>
  );
}
