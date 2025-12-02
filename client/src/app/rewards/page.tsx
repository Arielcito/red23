"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { useRewardsData } from "@/lib/hooks/useRewardsData"
import { CountdownTimer } from "@/components/rewards/CountdownTimer"
import { RecentWinners } from "@/components/rewards/RecentWinners"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Trophy, Clock, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RewardsBanner } from "@/components/rewards/RewardsBanner"
import { useAdminRewardsSettings } from "@/lib/hooks/useAdminRewardsSettings"
import { useBannerImage } from "@/lib/hooks/useBannerImage"

export default function RewardsPage() {
  const { nextDailyPrize, nextMonthlyPrize, recentWinners, rewardSettings, isLoading, error } = useRewardsData()
  const { settings: bannerSettings, isLoaded: settingsLoaded } = useAdminRewardsSettings()
  const { bannerImage } = useBannerImage(bannerSettings.imageId)
  
  console.log('🎁 Rewards page loaded with:', { winnersCount: recentWinners.length, settingsLoaded, bannerImage })

  return (
    <AppLayout
      title="Premios y Sorteos"
      subtitle="Gana premios increibles"
      badge={{
        text: "Activo",
        variant: "secondary",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      }}
    >
      <div className="container mx-auto p-4 space-y-6">
        {settingsLoaded && <RewardsBanner settings={bannerSettings} bannerImage={bannerImage} />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">
              <strong>Error de conexión:</strong> {error}
            </p>
          </div>
        )}

        {/* Header con información general */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">¡Gana premios increíbles!</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Participa automáticamente en nuestros sorteos usando la plataforma.
            Cada interacción te da más oportunidades de ganar.
          </p>
        </div>

        {/* Countdowns de premios */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
            <CardHeader className="relative">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <CardTitle className="text-lg">Premio Diario</CardTitle>
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
                <span className="text-sm font-medium">Premio: {rewardSettings?.daily_prize_amount || "$500 - $1,500 USD"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-secondary/20" />
            <CardHeader className="relative">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-secondary" />
                <CardTitle className="text-lg">Premio Mensual</CardTitle>
                <Badge variant="secondary" className="text-xs">Premium</Badge>
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
                <span className="text-sm font-medium">Premio: {rewardSettings?.monthly_prize_amount || "$5,000 - $15,000 USD"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información sobre cómo participar */}
        <Card id="reglas-premios">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              ¿Cómo participar?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-base font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold text-sm">Usa la plataforma</h3>
              </div>
              <div className="text-center space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-base font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold text-sm">Acumula puntos</h3>
              </div>
              <div className="text-center space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-base font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold text-sm">¡Gana premios!</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ganadores recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Ganadores Recientes
            </CardTitle>
            <CardDescription>
              Felicitaciones a nuestros últimos ganadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentWinners
              winners={recentWinners}
              isLoading={isLoading}
              className="max-w-2xl mx-auto"
            />
          </CardContent>
        </Card>

        {/* Reglas y términos */}
        <Card>
          <CardHeader>
            <CardTitle>Reglas del Sorteo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Deben ser usuarios activos de la plataforma Red23</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Los sorteos se realizan automáticamente sin intervención manual</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Los ganadores son notificados por Telegram</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Los premios se entregan dentro de 48 horas hábiles</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>No se pueden transferir los premios a terceros</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
