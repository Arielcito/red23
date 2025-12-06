"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircle,
  GalleryThumbnailsIcon as Gallery,
  Clock,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/AppLayout"
import { WinnerBanner } from "@/components/ui/winner-banner"
import { useWinnersApi } from "@/lib/hooks/useWinnersApi"
import { useCasinosData } from "@/lib/hooks/useCasinosData"
import { useRewardsData } from "@/lib/hooks/useRewardsData"
import { useLearningPaths } from "@/lib/hooks/useLearningPaths"
import { PrizeCard } from "@/components/rewards/PrizeCard"
import { TopThreeSection } from "@/components/novedades/TopThreeSection"
import { LearningPathsSection } from "@/components/tutorials/LearningPathsSection"
import { TermsAcceptanceModal } from "@/components/legal/TermsAcceptanceModal"
import { useTermsAcceptance } from "@/lib/hooks/useTermsAcceptance"
import { useAdminRewardsSettings } from "@/lib/hooks/useAdminRewardsSettings"
import { getNextMonthlyDrawArgentinaTime } from "@/lib/utils/dateHelpers"

export default function Dashboard() {
  const { winners } = useWinnersApi()
  const { topThree } = useCasinosData()
  const { nextWeeklyPrize, weeklyPrizeAmount } = useRewardsData()
  const { learningPaths, featuredPaths } = useLearningPaths()
  const { needsAcceptance, isAccepting, acceptTerms } = useTermsAcceptance()
  const { settings: bannerSettings, isLoaded: settingsLoaded } = useAdminRewardsSettings()

  // Usar el primer ganador de la API o un fallback
  const dailyWinner = winners.length > 0 ? {
    name: winners[0].username || winners[0].first_name,
    points: 0, // Ya no mostramos puntos
  } : {
    name: "María González",
    points: 0,
  }

  const quickActions = [
    {
      title: "Generar",
      mobileTitle: "Generar Imagen",
      description: "Usa el chatbot IA para crear nuevas imágenes",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-primary-500",
    },
    {
      title: "Galería",
      mobileTitle: "Ver Galería",
      description: "Explora todas tus imágenes creadas",
      icon: Gallery,
      href: "/gallery",
      color: "bg-secondary-500",
    },
    /* Temporalmente oculto
    {
      title: "Configurar WhatsApp",
      description: "Conecta tu cuenta de WhatsApp",
      icon: Smartphone,
      href: "/whatsapp-setup",
      color: "bg-primary-600",
    },
    */
  ]


  return (
    <AppLayout
      title="INICIO"
      subtitle="Bienvenido de vuelta"
    >
      <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">


        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 sm:mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full bg-gray-100 dark:bg-gray-800">
                  <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 text-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${action.color} flex items-center justify-center mb-2 mx-auto`}>
                      <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <CardTitle className="text-sm sm:text-base">
                      <span className="sm:hidden">{action.title}</span>
                      <span className="hidden sm:inline">{action.mobileTitle}</span>
                    </CardTitle>
                    <CardDescription className="hidden sm:block text-xs sm:text-sm">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Daily and Monthly Prizes */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg font-semibold">Premios</h2>
            <Link href="/rewards">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Ver todos los premios
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {/* Premio Semanal */}
            <PrizeCard
              title="Premio Semanal"
              description="Sorteo todos los viernes a las 20:00 "
              targetDate={nextWeeklyPrize}
              prizeAmount={settingsLoaded ? bannerSettings.dailyPrizeAmount : weeklyPrizeAmount}
              icon={Clock}
              theme="primary"
            />

            {/* Premio Mensual */}
            {settingsLoaded && bannerSettings.monthlyPrizeAmount && (
              <PrizeCard
                title="Premio Mensual"
                description="Sorteo el último día de cada mes a las 20:00"
                targetDate={
                  bannerSettings.useCustomDates && bannerSettings.monthlyPrizeDrawDate
                    ? new Date(bannerSettings.monthlyPrizeDrawDate)
                    : getNextMonthlyDrawArgentinaTime()
                }
                prizeAmount={bannerSettings.monthlyPrizeAmount}
                icon={Gift}
                theme="blue"
              />
            )}
          </div>
        </div>

        {/* Top Casinos Section */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg font-semibold">Mejores Casinos</h2>
            <Link href="/novedades">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Ver novedades
              </Button>
            </Link>
          </div>
          
          <TopThreeSection topThree={topThree} />
        </div>

        {/* Learning Tutorials */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg font-semibold">Tutoriales</h2>
            <Link href="/tutorials">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Ver todos los cursos
              </Button>
            </Link>
          </div>
          
          <LearningPathsSection 
            learningPaths={featuredPaths.length > 0 ? featuredPaths : learningPaths}
            showHeader={false}
            maxPaths={3}
            gridCols={3}
            className="py-0"
          />
        </div>


      </div>

      {/* Terms Acceptance Modal */}
      <TermsAcceptanceModal
        open={needsAcceptance}
        onAccept={acceptTerms}
        isAccepting={isAccepting}
      />
    </AppLayout>
  )
}
