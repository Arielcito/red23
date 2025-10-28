"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircle,
  GalleryThumbnailsIcon as Gallery,
  Clock,
  Trophy,
  Star,
} from "lucide-react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/AppLayout"
import { WinnerBanner } from "@/components/ui/winner-banner"
import { useWinnersApi } from "@/lib/hooks/useWinnersApi"
import { useCasinosData } from "@/lib/hooks/useCasinosData"
import { useRewardsData } from "@/lib/hooks/useRewardsData"
import { useLearningPaths } from "@/lib/hooks/useLearningPaths"
import { CountdownTimer } from "@/components/rewards/CountdownTimer"
import { TopThreeSection } from "@/components/novedades/TopThreeSection"
import { LearningPathsSection } from "@/components/tutorials/LearningPathsSection"
import { TermsAcceptanceModal } from "@/components/legal/TermsAcceptanceModal"
import { useTermsAcceptance } from "@/lib/hooks/useTermsAcceptance"

export default function Dashboard() {
  const { winners } = useWinnersApi()
  const { topThree } = useCasinosData()
  const { nextDailyPrize, nextMonthlyPrize } = useRewardsData()
  const { featuredPaths } = useLearningPaths()
  const { needsAcceptance, isAccepting, acceptTerms } = useTermsAcceptance()

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

        {/* Winner Banner */}
        <WinnerBanner winner={dailyWinner} />


        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 sm:mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
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
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base sm:text-lg">Premio Diario</CardTitle>
                </div>
                <CardDescription>
                  Sorteo automático cada día a las 00:00
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <CountdownTimer
                  targetDate={nextDailyPrize}
                  label="Tiempo restante"
                  className="mb-4"
                />
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Premio: $500 - $1,500 USD</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-secondary/20" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-base sm:text-lg">Premio Mensual</CardTitle>
                </div>
                <CardDescription>
                  Gran sorteo al final de cada mes
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <CountdownTimer
                  targetDate={nextMonthlyPrize}
                  label="Tiempo restante"
                  className="mb-4"
                />
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Premio: $5,000 - $15,000 USD</span>
                </div>
              </CardContent>
            </Card>
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
            learningPaths={featuredPaths}
            showHeader={false}
            maxPaths={2}
            gridCols={2}
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
