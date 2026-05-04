import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { listTestimonials } from "@/lib/data";
import { TestimonialSlider } from "@/components/testimonials/testimonial-slider";
import type { TestimonialItem } from "@/components/testimonials/testimonial-slider";
import { TestimonialGridCard } from "@/components/testimonials/testimonial-grid-card";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Stories from women who worked with Namrata and listened to the BHAW Namrata Podcast.",
  openGraph: {
    title: `Testimonials | ${SITE.name}`,
    description: "Client and listener reflections on confidence and self-image.",
  },
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const raw = await listTestimonials();
  const items: TestimonialItem[] = raw.map((t) => ({
    id: t.id,
    name: String(t.name),
    message: String(t.message),
    image: t.image ? String(t.image) : undefined,
  }));

  return (
    <div className="pb-24">
      <section className="border-b border-luxury-border bg-luxury-section py-14 md:py-20">
        <Container>
          <SectionHeading
            eyebrow="Love letters"
            title="What women say after they choose themselves"
            subtitle="A living gallery of courage, softness, and the kind of confidence that doesn’t need to shout."
          />
        </Container>
      </section>

      <Container className="mt-14">
        {items.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-luxury-body">
            Testimonials will appear here as they are shared.{" "}
            <a href="/contact" className="font-semibold text-brand-gold-deep underline hover:text-brand-gold">
              Tell Namrata about your transformation
            </a>
            .
          </div>
        ) : (
          <>
            <TestimonialSlider items={items} />
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t, idx) => (
                <TestimonialGridCard key={t.id ?? idx} item={t} index={idx} />
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
