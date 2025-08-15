import { 
  LandingNavigation,
  LandingHero,
  TrustBadges,
  HowItWorks,
  Features,
  SecuritySection,
  TrustSection,
  FinalCTA,
  LandingFooter
} from "@/components/landing";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <LandingNavigation />

      {/* Hero Section */}
      <LandingHero />

      {/* Trust Badges */}
      <TrustBadges />

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <Features />

      {/* Security Section */}
      <SecuritySection />

      {/* Trust Section */}
      <TrustSection />

      {/* Final CTA Section */}
      <FinalCTA />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}