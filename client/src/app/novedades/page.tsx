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
    casinos, 
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

  // Get 10 casinos for the casinos section (excluding top 3)
  const availableCasinos = casinos.filter(casino => !casino.isTopThree)
  const tenCasinos = availableCasinos.slice(0, 10)

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
      <div className="space-y-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 -mx-6 px-6 -my-6 py-6">
        {/* Top 3 Section */}
        <TopThreeSection topThree={topThree} />

        {/* 10 Casinos Section */}
        <CasinosSection casinos={tenCasinos} />

        {/* News Section */}
        <NewsSection 
          featuredNews={featuredNews} 
          recentNews={recentNews} 
        />
      </div>
    </AppLayout>
  )
}