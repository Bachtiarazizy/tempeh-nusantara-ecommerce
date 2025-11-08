import { HeroSection } from "@/components/home-page/hero-section";
import { FeatureSection } from "@/components/home-page/feature-section";
import { HowItWorkSection } from "@/components/home-page/how-it-work-section";
import TestimonialSection from "@/components/home-page/testimonial-section";
import { AffliateCtaSsection } from "@/components/home-page/affliate-cta-section";
import { NewsletterSection } from "@/components/home-page/newsletter-section";
import { TrustBadgeSolution } from "@/components/home-page/trust-badge-solution";
import { FeaturedProductSection } from "@/components/home-page/feature-product-section";

export const dynamic = "force-dynamic";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* Featured Products Section */}
      <FeaturedProductSection />

      {/* How It Works Section */}
      <HowItWorkSection />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Affiliate CTA Section */}
      <AffliateCtaSsection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Trust Badges Footer */}
      <TrustBadgeSolution />
    </div>
  );
};

export default LandingPage;
