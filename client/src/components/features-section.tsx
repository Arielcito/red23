"use client";

import HubFeaturesDiagram from "./hub-features-diagram"
import { MathBackgroundDecoration } from "@/components/math-background-decoration"

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden" id="features">
      {/* Smooth gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3a] to-[#0a1628]" />

      {/* Subtle animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-100" />
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-200" />
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-300" />
      </div>

      <MathBackgroundDecoration />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-cyan-400">IMPACTANTE</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">Sistema 100% eficaz y seguro</p>
        </div>

        <HubFeaturesDiagram
          logoUrl="/logo.png"
          centerLabel="RED23"
        />
      </div>
    </section>
  )
}
