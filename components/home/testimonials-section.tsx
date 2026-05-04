import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GoldButton } from "@/components/ui/gold-button";
import { listTestimonials } from "@/lib/data";
import {
  TestimonialSlider,
  type TestimonialItem,
} from "@/components/testimonials/testimonial-slider";
import { TestimonialGridCard } from "@/components/testimonials/testimonial-grid-card";

export async function TestimonialsSection() {
  const raw = await listTestimonials();
  const items: TestimonialItem[] = raw.map((t) => ({
    id: t.id,
    name: String(t.name),
    message: String(t.message),
    image: t.image ? String(t.image) : undefined,
    rating:
      typeof t.rating === "number" && t.rating >= 1 && t.rating <= 5
        ? t.rating
        : undefined,
  }));

  const preview = items.slice(0, 6);

  return (
    <section className="border-t border-luxury-border bg-luxury-section py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Proof"
          title="Women who felt the shift"
          subtitle="Real words from clients and listeners who chose expression over hesitation."
        />

        {items.length === 0 ? (
          <div className="glass-panel mx-auto max-w-xl rounded-3xl p-10 text-center text-luxury-body">
            Testimonials will appear here soon.{" "}
            <Link
              href="/contact"
              className="font-semibold text-brand-gold-deep hover:text-brand-gold"
            >
              Share your story
            </Link>{" "}
            with Namrata.
          </div>
        ) : (
          <>
            <TestimonialSlider items={items} />
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((t, idx) => (
                <TestimonialGridCard key={t.id ?? idx} item={t} index={idx} />
              ))}
            </div>
          </>
        )}

        <div className="mt-12 flex justify-center">
          <GoldButton href="/testimonials" variant="outline">
            View all testimonials
          </GoldButton>
        </div>
      </Container>
    </section>
  );
}
