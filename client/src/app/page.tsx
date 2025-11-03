import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { SecurityEffectivenessSection } from "@/components/security-effectiveness-section"
import { AdComparisonSection } from "@/components/ad-comparison-section"
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
        <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-b from-[#0a1628] via-[#0a1628]/80 to-transparent -mt-16 sm:-mt-20 md:-mt-24 relative z-0" />
        <CtaSection />
      </main> 
    </div>
  )
}
