import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";
import { getDb } from "@/lib/mongodb";
import { BookingExperience, type PackagePublic } from "@/components/booking/booking-experience";
import { getSeedPackagesPublic } from "@/lib/packages-seed";
import Link from "next/link";
import { AmbientSectionShell } from "@/components/cinematic/ambient-section-shell";
import { getLatestPodcastEpisodesForHome } from "@/lib/podcast-episodes";
import { clipsFromEpisodes } from "@/lib/youtube-ambient";

export const metadata: Metadata = {
  title: "Book a Guest Slot",
  description:
    "Book a cinematic podcast guest appearance—packages, availability, Razorpay checkout, and optional Calendly scheduling.",
  openGraph: {
    title: `Book a Guest Slot | ${SITE.name}`,
    description:
      "Premium podcast booking: packages, live availability, secure payment, and a calm guest experience.",
  },
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

async function loadPackages(): Promise<PackagePublic[]> {
  const db = await getDb();
  if (!db) return getSeedPackagesPublic();
  const docs = await db
    .collection("packages")
    .find({ active: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .toArray();
  if (docs.length === 0) return getSeedPackagesPublic();
  return docs.map((d) => ({
    _id: d._id.toString(),
    title: String(d.title),
    description: String(d.description ?? ""),
    price: Number(d.price),
    discountPrice:
      d.discountPrice != null ? Number(d.discountPrice) : null,
    features: Array.isArray(d.features)
      ? d.features.map((x) => String(x))
      : [],
    badge: d.badge ? String(d.badge) : undefined,
    active: Boolean(d.active),
  }));
}

export default async function BookPage() {
  const initialPackages = await loadPackages();
  const ambientClips = clipsFromEpisodes(
    await getLatestPodcastEpisodesForHome(6)
  );

  return (
    <div className="pb-24">
      <AmbientSectionShell
        clips={ambientClips}
        variant="section-soft"
        startOffset={4}
        className="relative overflow-hidden border-b border-luxury-border py-16 md:py-20"
      >
        <div className="pointer-events-none absolute -right-24 top-0 z-10 h-72 w-72 rounded-full bg-brand-gold/12 blur-3xl" />
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
            Book a slot
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight text-luxury-heading md:text-5xl">
            Reserve your feature—with intention and polish
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-luxury-body">
            Booking a slot means professionally featuring your story,
            business, or expertise to a wider audience through cinematic podcast
            production and strategic promotion. Select a package, share a few
            details, and choose a{" "}
            <strong className="text-luxury-heading">
              Wednesday or Friday
            </strong>{" "}
            slot. Checkout is powered by Razorpay for a calm, trustworthy
            experience.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3 text-sm text-luxury-body">
            <li className="rounded-full border border-luxury-border bg-luxury-bg px-4 py-2">
              Dynamic packages &amp; pricing
            </li>
            <li className="rounded-full border border-luxury-border bg-luxury-bg px-4 py-2">
              Live calendar availability
            </li>
            <li className="rounded-full border border-luxury-border bg-luxury-bg px-4 py-2">
              WhatsApp:{" "}
              <a
                href={SITE.social.whatsapp}
                className="font-semibold text-brand-gold-deep underline underline-offset-2 hover:text-brand-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                +91 92431 22115
              </a>
            </li>
          </ul>
        </Container>
      </AmbientSectionShell>

      {initialPackages[0]?._id.startsWith("demo-package") ? (
        <Container className="mt-6">
          <p className="rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-3 text-center text-sm text-luxury-body">
            <strong className="text-luxury-heading">Demo mode:</strong> Packages
            are shown for layout testing. To book and pay, set{" "}
            <code className="rounded bg-luxury-bg px-1 text-xs">MONGODB_URI</code>{" "}
            and run{" "}
            <code className="rounded bg-luxury-bg px-1 text-xs">
              npm run seed:packages
            </code>
            .
          </p>
        </Container>
      ) : null}

      <div className="mt-14 md:mt-20">
        <BookingExperience initialPackages={initialPackages} />
      </div>

      {SITE.calendlyUrl ? (
        <Container className="mt-16 md:mt-20">
          <div className="glass-panel overflow-hidden rounded-[2rem] shadow-luxury-card ring-1 ring-black/[0.05]">
            <div className="border-b border-luxury-border bg-white/85 px-6 py-6 md:px-10">
              <h2 className="font-display text-2xl font-semibold text-luxury-heading md:text-3xl">
                Prefer Calendly? Schedule a discovery call
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-luxury-body md:text-base">
                Use the calendar below for a quick alignment conversation before
                you lock your guest episode. Same premium experience—just a softer
                first step if you&apos;re exploring dates.
              </p>
            </div>
            <iframe
              title="Schedule with Calendly"
              src={SITE.calendlyUrl}
              className="min-h-[720px] w-full bg-white"
              loading="lazy"
            />
          </div>
        </Container>
      ) : null}

      <Container className="mt-16">
        <div className="glass-panel rounded-4xl p-8 md:p-11">
          <h2 className="font-display text-xl font-semibold text-luxury-heading">
            Policies &amp; support
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-luxury-body">
            Questions before you book? Email{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="font-medium text-brand-gold-deep hover:text-brand-gold"
            >
              {SITE.contactEmail}
            </a>{" "}
            or read our{" "}
            <Link href="/terms" className="text-brand-gold-deep underline hover:text-brand-gold">
              Terms
            </Link>
            ,{" "}
            <Link href="/privacy-policy" className="text-brand-gold-deep underline hover:text-brand-gold">
              Privacy
            </Link>
            , and{" "}
            <Link href="/refund-policy" className="text-brand-gold-deep underline hover:text-brand-gold">
              Refund policy
            </Link>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
