import type { Metadata } from "next";
import {
  IconVideo,
  IconLinkedin,
  IconInstagram,
  IconFacebook,
} from "@/components/icons/social-icons";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book Namrata for coaching, speaking, or collaborations—or send a message.",
  openGraph: {
    title: `Contact | ${SITE.name}`,
    description: "Reach BHAW Namrata via the form, WhatsApp, or social channels.",
  },
};

const social = [
  { href: SITE.social.youtube, label: "YouTube", Icon: IconVideo },
  { href: SITE.social.linkedin, label: "LinkedIn", Icon: IconLinkedin },
  { href: SITE.social.instagram, label: "Instagram", Icon: IconInstagram },
  { href: SITE.social.facebook, label: "Facebook", Icon: IconFacebook },
];

export default function ContactPage() {
  return (
    <div className="pb-24">
      <section className="border-b border-brand-gold/10 bg-white/30 py-14 backdrop-blur-sm md:py-20">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-deep">
            Contact
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-brand-dark md:text-5xl">
            Let’s design your next level of expression
          </h1>
          <p className="mt-6 max-w-2xl text-brand-dark/75">
            Coaching inquiries, podcast collaborations, and speaking requests are
            welcome. Share a few details and the right conversation will follow.
          </p>
        </Container>
      </section>

      <Container className="mt-14 grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
        <ContactForm />

        <div className="space-y-8">
          <div className="rounded-3xl border border-brand-gold/20 bg-brand-dark p-8 text-brand-cream shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              WhatsApp
            </p>
            <p className="mt-3 text-sm text-brand-cream/75">
              Prefer a quick hello? Message Namrata directly.
            </p>
            <a
              href={SITE.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gold-gradient py-3 text-sm font-semibold text-brand-dark"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="glass-panel rounded-3xl p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
              Social
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {social.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-gold/20 bg-white/60 text-brand-dark transition hover:border-brand-gold hover:bg-brand-gold/10"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
