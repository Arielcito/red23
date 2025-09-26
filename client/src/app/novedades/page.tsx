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
        subtitle="Últimas noticias y actualizaciones"
      >
        <ErrorState error={error} />
      </AppLayout>
    )
  }

  if (isLoading) {
    return (
      <AppLayout 
        title="Novedades" 
        subtitle="Últimas noticias y actualizaciones"
      >
        <LoadingState />
      </AppLayout>
    )
  }


  return (
    <AppLayout
      title="Novedades"
      subtitle="Últimas noticias y actualizaciones del mundo de los casinos"
      badge={{
        text: "Actualizado",
        variant: "secondary",
        className: "text-xs"
      }}
    >
      <div className="space-y-6 md:space-y-12 bg-blue-50/50 md:bg-gradient-to-br md:from-blue-50 md:to-indigo-50 dark:bg-blue-950/10 dark:md:from-blue-950/20 dark:md:to-indigo-950/20 px-6 py-6 -mx-6">
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
