"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { useNewsData } from "@/lib/hooks/useNewsData"
import { useCasinosData } from "@/lib/hooks/useCasinosData"
import { TopThreeSection } from "@/components/novedades/TopThreeSection"
import { CasinosSection } from "@/components/novedades/CasinosSection"
import { NewsSection } from "@/components/novedades/NewsSection"
import { LoadingState } from "@/components/novedades/LoadingState"
import { ErrorState } from "@/components/novedades/ErrorState"

export default function NovedadesPage() {
  const {
    featuredNews,
    recentNews,
    isLoading: newsLoading,
    error: newsError
  } = useNewsData()

  const {
    topThree,
    isLoading: casinosLoading,
    error: casinosError
  } = useCasinosData()

  const isLoading = newsLoading || casinosLoading
  const error = newsError || casinosError

  if (error) {
    return (
      <AppLayout
        title="Novedades"
        subtitle="Información exclusiva y en tiempo real"
      >
        <ErrorState error={error} />
      </AppLayout>
    )
  }

  if (isLoading) {
    return (
      <AppLayout
        title="Novedades"
        subtitle="Información exclusiva y en tiempo real"
      >
        <LoadingState />
      </AppLayout>
    )
  }


  return (
    <AppLayout
      title="Novedades"
      subtitle="Información exclusiva y en tiempo real"
    >
      <div className="space-y-6 md:space-y-12  dark:md:to-indigo-950/20 p-4 md:p-6">
        {/* Top 3 Section */}
        <TopThreeSection topThree={topThree} />

        {/* Casinos Section */}
        <CasinosSection />
        {/* News Section */}
        <NewsSection 
          featuredNews={featuredNews} 
          recentNews={recentNews} 
        />
      </div>
    </AppLayout>
  )
}
