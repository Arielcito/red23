import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { SecurityEffectivenessSection } from "@/components/security-effectiveness-section"
import { AdComparisonSection } from "@/components/ad-comparison-section"
import { ReferralBanner } from "@/components/referral-banner"
import { PricingSection } from "@/components/pricing-section"
import { ContactFormSection } from "@/components/contact-form-section"
import { CtaSection } from "@/components/cta-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SecurityEffectivenessSection />
        <AdComparisonSection />
        <CtaSection />
      </main>
    </div>
  )
}
