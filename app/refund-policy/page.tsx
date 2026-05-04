import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { LegalProse } from "@/components/legal/legal-prose";
import { SITE } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Refund eligibility, cancellation rules, and processing times for BHAW Namrata coaching and digital purchases.",
  openGraph: {
    title: `Refund & Cancellation | ${SITE.name}`,
    description:
      "How refunds and cancellations work for sessions and premium content.",
  },
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <div className="pb-24">
      <section className="border-b border-luxury-border bg-luxury-section py-14 md:py-20">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-deep">
            Legal
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-luxury-heading md:text-5xl">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-luxury-body">
            Last updated: May 4, 2026. Please read this alongside our{" "}
            <Link href="/terms" className="text-brand-gold-deep underline hover:text-brand-gold">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </Container>
      </section>

      <Container className="mt-12 max-w-3xl">
        <LegalProse>
          <h2>Overview</h2>
          <p>
            We want you to feel confident when booking coaching or purchasing
            premium materials from {SITE.name}. This policy explains when
            refunds or cancellations may apply and how long processing takes.
          </p>

          <h2>Coaching sessions — cancellation</h2>
          <ul>
            <li>
              You may request to reschedule or cancel a confirmed session by
              contacting us at least <strong>48 hours</strong> before the agreed
              start time via email or WhatsApp.
            </li>
            <li>
              Cancellations with sufficient notice may be eligible for a full
              refund or credit toward a future session, at our discretion and
              subject to availability.
            </li>
            <li>
              Late cancellations (within 48 hours) or missed sessions without
              notice may not be refunded, as the time has been reserved for you.
            </li>
          </ul>

          <h2>Refund eligibility</h2>
          <ul>
            <li>
              <strong>Duplicate charges</strong> or <strong>technical errors</strong>{" "}
              confirmed on our side will be corrected with a refund to the
              original payment method where possible.
            </li>
            <li>
              <strong>Premium digital content</strong> (guides, resource packs)
              is generally <strong>non-refundable</strong> once access or
              delivery has been provided, except where required by law or where
              we explicitly agree otherwise in writing.
            </li>
            <li>
              If a <strong>scheduled service cannot be delivered</strong> by us
              (for example, cancellation on our end), you will receive a full
              refund or an alternative session, as you prefer.
            </li>
          </ul>

          <h2>Processing time</h2>
          <p>
            Approved refunds are initiated within <strong>7 business days</strong>{" "}
            of approval. Depending on your bank or card issuer, the amount may
            take an additional <strong>5–10 business days</strong> to appear in
            your account. Razorpay and banking partners control final settlement
            timelines.
          </p>

          <h2>How to request a refund or cancellation</h2>
          <p>
            Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>{" "}
            with your name, payment reference (Razorpay payment ID or order ID),
            date of purchase, and reason for the request. You may also reach us
            on{" "}
            <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            .
          </p>

          <h2>Chargebacks</h2>
          <p>
            If you have a concern, please contact us first so we can resolve it.
            Unnecessary chargebacks may limit our ability to serve you in the
            future.
          </p>

          <h2>Contact</h2>
          <p>
            {SITE.name} — {SITE.contactEmail} —{" "}
            <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
        </LegalProse>
      </Container>
    </div>
  );
}
