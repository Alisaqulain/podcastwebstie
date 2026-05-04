import { HeroPremium } from "@/components/home/hero-premium";
import { LatestConversations } from "@/components/home/latest-conversations";
import { AboutPreview } from "@/components/home/about-preview";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { SocialProof } from "@/components/home/social-proof";
import { PricingSection } from "@/components/home/pricing-section";
import { CtaSection } from "@/components/home/cta-section";
import { NewsletterCta } from "@/components/home/newsletter-cta";

export default function HomePage() {
  return (
    <>
      <HeroPremium />
      <LatestConversations />
      <AboutPreview />
      <TestimonialsSection />
      <SocialProof />
      <PricingSection />
      <CtaSection />
      <NewsletterCta />
    </>
  );
}
