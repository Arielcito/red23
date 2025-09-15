"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MessageCircle,
  Image,
  GalleryThumbnailsIcon as Gallery,
  Settings,
  TrendingUp,
  Calendar,
  Sparkles,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScheduledImagesList } from "@/components/schedule/ScheduledImagesList"
import { AppLayout } from "@/components/layout/AppLayout"
import { WinnerBanner } from "@/components/ui/winner-banner"
import { CasinoComparisonSection } from "@/components/casinos/CasinoComparisonSection"
import { useWinnersApi } from "@/lib/hooks/useWinnersApi"
import { useImagesApi } from "@/lib/hooks/useImagesApi"
import { useStatsApi } from "@/lib/hooks/useStatsApi"

export default function Dashboard() {
  const { images: apiImages, isLoading: imagesLoading } = useImagesApi()
  const { winners, isLoading: winnersLoading, error: winnersError } = useWinnersApi()
  const { stats, isLoading: statsLoading, error: statsError } = useStatsApi()

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

  // Usar imágenes de la API o fallback
  const recentImages = apiImages.length > 0
    ? apiImages.slice(0, 4).map(img => ({
        id: img.id,
        url: img.result,
        title: img.prompt.substring(0, 20) + "...",
        date: new Date(img.created_at).toLocaleDateString('es-ES', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      }))
    : [
        { id: 1, url: "/placeholder.svg?height=100&width=100", title: "Arte Abstracto", date: "Hoy" },
        { id: 2, url: "/placeholder.svg?height=100&width=100", title: "Paisaje", date: "Ayer" },
        { id: 3, url: "/placeholder.svg?height=100&width=100", title: "Retrato", date: "2 días" },
        { id: 4, url: "/placeholder.svg?height=100&width=100", title: "Arte Digital", date: "3 días" },
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
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
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

        {/* Casino Comparison Section */}
        <CasinoComparisonSection showAdminButton={true} />

        {/* Recent Images & Scheduled Posts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Recent Images */}
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Imágenes Recientes</CardTitle>
              <Link href="/gallery">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Ver todas
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {recentImages.map((image) => (
                  <div key={image.id} className="space-y-1 sm:space-y-2">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium line-clamp-2">{image.title}</p>
                      <p className="text-xs text-gray-500">{image.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Temporalmente oculto - Scheduled Posts 
          <ScheduledImagesList />
          */}
        </div>
      </div>
    </AppLayout>
  )
}
