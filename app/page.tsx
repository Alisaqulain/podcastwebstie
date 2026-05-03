import { Hero } from "@/components/home/hero";
import { FeaturedPodcasts } from "@/components/home/featured-podcasts";
import { AboutPreview } from "@/components/home/about-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { SocialProof } from "@/components/home/social-proof";
import { CtaSection } from "@/components/home/cta-section";
import { NewsletterCta } from "@/components/home/newsletter-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPodcasts />
      <AboutPreview />
      <TestimonialsSection />
      <SocialProof />
      <CtaSection />
      <NewsletterCta />
    </>
  );
}
