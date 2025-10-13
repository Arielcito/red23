"use client"

import { Header } from "@/components/landing/Header"
import { NexusHero } from "@/components/landing/NexusHero"
import { MusicPlayerShowcase } from "@/components/landing/MusicPlayerShowcase"
import { MethodCard } from "@/components/landing/MethodCard"
import { CommunicationCTA } from "@/components/landing/CommunicationCTA"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="min-h-screen">
        <NexusHero />
        <MusicPlayerShowcase />
        <MethodCard />
        <CommunicationCTA />
      </main>
      <Footer />
    </div>
  )
}
