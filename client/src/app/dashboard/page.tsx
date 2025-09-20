"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  MessageCircle,
  Image,
  GalleryThumbnailsIcon as Gallery,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/AppLayout"
import { WinnerBanner } from "@/components/ui/winner-banner"
import { useWinnersApi } from "@/lib/hooks/useWinnersApi"
import { useImagesApi } from "@/lib/hooks/useImagesApi"
import { useStatsApi } from "@/lib/hooks/useStatsApi"
import { useCasinosData } from "@/lib/hooks/useCasinosData"
export default function Dashboard() {
  const { images: apiImages } = useImagesApi()
  const { winners } = useWinnersApi()
  const { stats } = useStatsApi()
  const { topThree, casinos } = useCasinosData()

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
      title: "Generar Imagen",
      description: "Usa el chatbot IA para crear nuevas imágenes",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-primary-500",
    },
    {
      title: "Ver Galería",
      description: "Explora todas tus imágenes creadas",
      icon: Gallery,
      href: "/gallery",
      color: "bg-secondary-500",
    },
    {
      title: "Subir Imagen",
      description: "Sube tus propias imágenes",
      icon: Image,
      href: "/upload",
      color: "bg-tertiary-500",
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
      title="Dashboard"
      subtitle="Bienvenido de vuelta"
      badge={{
        text: "Plan Pro",
        variant: "outline",
        className: "text-primary-600 border-primary-200 bg-primary-50 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800 text-xs sm:text-sm"
      }}
    >
      <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">

        {/* Winner Banner */}
        <WinnerBanner winner={dailyWinner} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imágenes Generadas</CardTitle>
              <Sparkles className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl font-bold mb-1">{apiImages.length}</div>
              <p className="text-xs text-muted-foreground">Total generadas</p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uso Mensual</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl font-bold mb-2">
                {Math.round((apiImages.length / stats.monthlyLimit) * 100)}%
              </div>
              <Progress
                value={(apiImages.length / stats.monthlyLimit) * 100}
                className="mb-2 [&>div]:bg-primary-500"
              />
              <p className="text-xs text-muted-foreground">
                {apiImages.length} de {stats.monthlyLimit} imágenes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 sm:mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                      <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <CardTitle className="text-sm sm:text-base">{action.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{action.description}</CardDescription>
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Premio Diario</CardTitle>
                <CardDescription>Participa cada día para ganar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold mb-2">$500 - $1,500</div>
                <p className="text-xs text-muted-foreground">Sorteo automático cada día</p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Premio Mensual</CardTitle>
                <CardDescription>Gran premio del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold mb-2">$5,000 - $15,000</div>
                <p className="text-xs text-muted-foreground">Gran sorteo mensual</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Casinos Section */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg font-semibold">Mejores Casinos</h2>
            <Link href="/admin/casinos">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Gestionar casinos
              </Button>
            </Link>
          </div>
          
          {/* Top 3 Casinos */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6">
              {topThree.map((casino, index) => (
                <Card key={casino.id} className="h-full relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-white text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    'bg-orange-500'
                  } rounded-bl-lg`}>
                    #{index + 1}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {casino.imageUrl && casino.imageUrl !== '/placeholder-casino.svg' ? (
                          <img 
                            src={casino.imageUrl} 
                            alt={casino.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-lg font-bold">
                            {casino.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{casino.name}</CardTitle>
                        <CardDescription className="text-sm">{casino.plataforma}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        casino.potencial.color === 'green' ? 'bg-green-100 text-green-800' :
                        casino.potencial.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Potencial {casino.potencial.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Casino Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Casinos</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary-500" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl font-bold mb-1">{casinos.length}</div>
                <p className="text-xs text-muted-foreground">Casinos disponibles</p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alto Potencial</CardTitle>
                <Sparkles className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl font-bold mb-1">
                  {casinos.filter(c => c.potencial.value === 'high').length}
                </div>
                <p className="text-xs text-muted-foreground">Con alto potencial</p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top 3 Activos</CardTitle>
                <Sparkles className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl font-bold mb-1">{topThree.length}</div>
                <p className="text-xs text-muted-foreground">En ranking principal</p>
              </CardContent>
            </Card>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Ruta Principiante</CardTitle>
                <CardDescription>Fundamentos del Marketing Digital</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">• Conceptos básicos</p>
                  <p className="text-sm">• Herramientas esenciales</p>
                  <p className="text-sm">• Primeras estrategias</p>
                  <p className="text-sm font-medium text-primary-600">4 cursos • 20 horas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Ruta Avanzada</CardTitle>
                <CardDescription>Especialista en Casinos Online</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">• Estrategias avanzadas</p>
                  <p className="text-sm">• Compliance y regulaciones</p>
                  <p className="text-sm">• Optimización de conversiones</p>
                  <p className="text-sm font-medium text-secondary-600">6 cursos • 35 horas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
    </AppLayout>
  )
}
