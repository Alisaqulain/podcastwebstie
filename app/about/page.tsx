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
      <section className="border-b border-luxury-border bg-luxury-section py-16 md:py-24">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
            About
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold text-luxury-heading md:text-5xl">
            The woman behind the microphone—and the mirror.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-luxury-body">
            {SITE.description}
          </p>
        </Container>
      </section>

      <Container className="mt-16 space-y-16 md:mt-24 md:space-y-24">
        <section className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="font-display text-3xl font-semibold text-luxury-heading">
              The story
            </h2>
            <p className="mt-4 leading-relaxed text-luxury-body">
              Namrata built {SITE.name} as a home for honest dialogue—where
              ambition meets softness, and leadership doesn’t require you to
              harden. Her work sits at the intersection of personal branding,
              self-worth, and the quiet discipline of showing up consistently.
            </p>
            <p className="mt-4 leading-relaxed text-luxury-body">
              From boardrooms to recording studios, she has watched brilliant
              women mute their own voices—not for lack of skill, but because
              their self-image hadn’t caught up with their capability. That gap
              is where her coaching begins.
            </p>
          </div>
          <div className="glass-panel rounded-4xl p-8 md:p-10">
            <h3 className="font-display text-xl font-semibold text-luxury-heading">
              Mission
            </h3>
            <p className="mt-3 text-luxury-body">
              To help women express themselves with clarity and conviction—so
              their presence feels as intentional as their résumé.
            </p>
            <h3 className="mt-8 font-display text-xl font-semibold text-luxury-heading">
              Vision
            </h3>
            <p className="mt-3 text-luxury-body">
              A world where women trust their reflection, their voice, and their
              decisions—without waiting for permission.
            </p>
          </div>
        </section>

        <section className="glass-panel rounded-4xl p-10 md:p-14">
          <h2 className="font-display text-3xl font-semibold text-luxury-heading">
            Self-image coaching—what it really means
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-luxury-body">
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
                className="flex gap-3 rounded-2xl border border-luxury-border bg-luxury-bg px-4 py-3 text-sm text-luxury-body"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold-deep" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl font-semibold text-luxury-heading">
            Professional branding—with soul
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-luxury-body">
            Whether you are stepping into video, launching a podcast, or
            refreshing how clients perceive you, Namrata treats branding as an
            expression of integrity. The goal is not performance—it is coherence.
            When your inner narrative matches your outer presence, people feel
            it immediately.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <GoldButton href="/book">Book &amp; pay</GoldButton>
            <GoldButton href="/contact" variant="outline">
              Send a message
            </GoldButton>
            <GoldButton href="/podcast" variant="outline">
              Explore the podcast
            </GoldButton>
          </div>
        </section>
      </Container>
    </div>
  );
}
