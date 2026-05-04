import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { LegalProse } from "@/components/legal/legal-prose";
import { SITE } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms of use for BHAW Namrata services, including payments, coaching, and digital content.",
  openGraph: {
    title: `Terms & Conditions | ${SITE.name}`,
    description:
      "Service usage rules, payment terms, and liability disclaimer for BHAW Namrata.",
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="pb-24">
      <section className="border-b border-luxury-border bg-luxury-section py-14 md:py-20">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-deep">
            Legal
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-luxury-heading md:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-luxury-body">
            Last updated: May 4, 2026. By using this website or purchasing
            services, you agree to these terms.
          </p>
        </Container>
      </section>

      <Container className="mt-12 max-w-3xl">
        <LegalProse>
          <h2>Services</h2>
          <p>
            {SITE.name} provides podcast content, coaching, speaking, and related
            digital offerings. Descriptions and pricing on{" "}
            <Link href="/book">the Book &amp; pay page</Link> and elsewhere on
            this site form part of these terms.
          </p>

          <h2>Service usage rules</h2>
          <ul>
            <li>
              You agree to provide accurate information when booking, paying, or
              contacting us.
            </li>
            <li>
              Coaching and content are for personal development; they are not a
              substitute for medical, legal, or financial advice.
            </li>
            <li>
              You may not misuse the site, attempt unauthorized access, scrape
              content at scale, or use materials in a way that infringes
              intellectual property rights.
            </li>
            <li>
              Session scheduling is subject to availability and confirmation.
              Digital materials are licensed for your personal use unless
              otherwise agreed in writing.
            </li>
          </ul>

          <h2>Payment terms</h2>
          <ul>
            <li>
              Prices are listed in Indian Rupees (INR) unless stated otherwise.
              Taxes may apply as per law.
            </li>
            <li>
              Payments are processed by Razorpay. By paying, you also accept
              Razorpay&apos;s terms and privacy practices for the payment step.
            </li>
            <li>
              A successful charge indicates acceptance of the selected service or
              product at the price shown at checkout.
            </li>
            <li>
              Refunds and cancellations are governed by our{" "}
              <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>
              .
            </li>
          </ul>

          <h2>Intellectual property</h2>
          <p>
            Podcast episodes, branding, written materials, and other content on
            this site belong to {SITE.name} or its licensors. You may not copy,
            redistribute, or publicly perform them beyond what the law allows
            without permission.
          </p>

          <h2>Liability disclaimer</h2>
          <p>
            Services and content are provided &quot;as is&quot; to the fullest
            extent permitted by law. We do not guarantee specific outcomes from
            coaching or programs. To the maximum extent permitted by applicable
            law, {SITE.name} and Namrata Tiwary Singh shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or
            loss of profits or data, arising from use of the site or services.
          </p>
          <p>
            Nothing in these terms limits liability that cannot be limited under
            mandatory law.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. The &quot;Last
            updated&quot; date will change accordingly. Continued use after
            changes constitutes acceptance where permitted by law.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of India. Courts at the
            appropriate jurisdiction in India shall have exclusive jurisdiction,
            subject to mandatory consumer protections.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> or{" "}
            <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            .
          </p>
        </LegalProse>
      </Container>
    </div>
  );
}
