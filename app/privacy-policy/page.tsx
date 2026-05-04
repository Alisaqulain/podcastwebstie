import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { LegalProse } from "@/components/legal/legal-prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How BHAW Namrata collects, uses, and protects your personal information, including cookies and contact details.",
  openGraph: {
    title: `Privacy Policy | ${SITE.name}`,
    description:
      "Privacy practices for the BHAW Namrata website, coaching services, and payments.",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pb-24">
      <section className="border-b border-luxury-border bg-luxury-section py-14 md:py-20">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-deep">
            Legal
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-luxury-heading md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-luxury-body">
            Last updated: May 4, 2026. This policy describes how we handle
            information when you use {SITE.name} ({SITE.url}).
          </p>
        </Container>
      </section>

      <Container className="mt-12 max-w-3xl">
        <LegalProse>
          <h2>Who we are</h2>
          <p>
            {SITE.name} is operated by Namrata Tiwary Singh, offering podcast
            content, coaching, and related digital services. For privacy
            questions, contact{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> or
            message us on{" "}
            <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            .
          </p>

          <h2>Data we collect</h2>
          <p>We may collect and process:</p>
          <ul>
            <li>
              <strong>Contact details</strong> you submit via forms (name, email,
              phone, message content).
            </li>
            <li>
              <strong>Payment-related data</strong> when you pay through Razorpay,
              including name, email, phone (if provided), transaction IDs, and
              amount. Card and banking credentials are processed by Razorpay and
              are not stored on our servers.
            </li>
            <li>
              <strong>Technical data</strong> such as browser type, device
              information, IP address, and pages visited, used for security and
              analytics.
            </li>
          </ul>

          <h2>How we use personal information</h2>
          <p>We use information to:</p>
          <ul>
            <li>Respond to inquiries and deliver coaching or purchased services.</li>
            <li>Process and verify payments, prevent fraud, and meet legal duties.</li>
            <li>Improve the website, content, and user experience.</li>
            <li>
              Send essential transactional messages (e.g., payment or booking
              confirmations). Marketing emails are only sent where permitted by
              law and your preferences.
            </li>
          </ul>
          <p>
            We do not sell your personal information. We may share data with
            trusted processors (e.g., payment providers, email or hosting
            services) strictly as needed to operate the business.
          </p>

          <h2>Cookies and similar technologies</h2>
          <p>
            We may use cookies or local storage to keep the site secure,
            remember preferences, and measure basic usage. You can control
            cookies through your browser settings; disabling cookies may affect
            some features.
          </p>

          <h2>Retention</h2>
          <p>
            We retain information only as long as needed for the purposes above,
            including legal, accounting, or dispute requirements. Payment
            records may be kept for the period required by tax and regulatory
            rules.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on applicable law, you may have rights to access, correct,
            delete, or restrict processing of your personal data, or to object to
            certain processing. To exercise these rights, email{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>

          <h2>Security</h2>
          <p>
            We use reasonable administrative and technical safeguards to protect
            information. No online transmission is completely secure; please use
            the site and payment flows responsibly.
          </p>

          <h2>Contact</h2>
          <p>
            {SITE.name}
            <br />
            Email:{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            <br />
            WhatsApp:{" "}
            <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer">
              {SITE.social.whatsapp}
            </a>
          </p>
        </LegalProse>
      </Container>
    </div>
  );
}
