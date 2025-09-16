"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { useRewards } from "@/lib/hooks/useRewards"
import { CountdownTimer } from "@/components/rewards/CountdownTimer"
import { RecentWinners } from "@/components/rewards/RecentWinners"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Trophy, Clock, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RewardsBanner } from "@/components/rewards/RewardsBanner"
import { useRewardsSettings } from "@/lib/hooks/useRewardsSettings"

export default function RewardsPage() {
  const { nextDailyPrize, nextMonthlyPrize, recentWinners, isLoading } = useRewards()
  const { settings: bannerSettings } = useRewardsSettings()

  return (
    <AppLayout
      title="Premios y Sorteos"
      subtitle="Participa en nuestros sorteos diarios y mensuales"
      badge={{
        text: "Activo",
        variant: "secondary",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      }}
    >
      <div className="container mx-auto p-6 space-y-8">
        <RewardsBanner settings={bannerSettings} />

        {/* Header con información general */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Gift className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">¡Gana premios increíbles!</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Participa automáticamente en nuestros sorteos usando la plataforma. 
            Cada interacción te da más oportunidades de ganar.
          </p>
        </div>

        {/* Countdowns de premios */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
            <CardHeader className="relative">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Premio Diario</CardTitle>
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
                <CardTitle className="text-xl">Premio Mensual</CardTitle>
                <Badge variant="secondary">Premium</Badge>
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

        {/* Información sobre cómo participar */}
        <Card id="reglas-premios">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              ¿Cómo participar?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold">Usa la plataforma</h3>
                <p className="text-sm text-muted-foreground">
                  Cada imagen generada, subida o programada te da puntos
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold">Acumula puntos</h3>
                <p className="text-sm text-muted-foreground">
                  Más actividad = más oportunidades de ganar
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold">¡Gana premios!</h3>
                <p className="text-sm text-muted-foreground">
                  Los sorteos son automáticos, no necesitas hacer nada más
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ganadores recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
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
                <span>Los ganadores son notificados por email y WhatsApp</span>
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
