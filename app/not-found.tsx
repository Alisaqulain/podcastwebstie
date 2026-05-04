import Link from "next/link";
import { GoldButton } from "@/components/ui/gold-button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-deep">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-luxury-heading md:text-4xl">
        This page stepped out for a breath
      </h1>
      <p className="mt-4 max-w-md text-luxury-body">
        The link may be outdated, or the story moved. Let’s take you somewhere
        intentional.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <GoldButton href="/">Back home</GoldButton>
        <GoldButton href="/contact" variant="outline">
          Contact
        </GoldButton>
      </div>
      <Link
        href="/podcast"
        className="mt-8 text-sm font-medium text-brand-gold-deep hover:text-brand-gold hover:underline"
      >
        Browse the podcast
      </Link>
    </Container>
  );
}
