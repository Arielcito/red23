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
  Smartphone,
  Sparkles,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScheduledImagesList } from "@/components/schedule/ScheduledImagesList"
import { AppLayout } from "@/components/layout/AppLayout"
import { WinnerBanner } from "@/components/ui/winner-banner"

export default function Dashboard() {
  const [stats] = useState({
    imagesGenerated: 127,
    whatsappPosts: 45,
    galleryItems: 89,
    monthlyLimit: 500,
  })

  const [dailyWinner] = useState({
    name: "María González",
    points: 2850,
    avatar: "/placeholder.svg?height=64&width=64&text=MG"
  })

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
    {
      title: "Configurar WhatsApp",
      description: "Conecta tu cuenta de WhatsApp",
      icon: Smartphone,
      href: "/whatsapp-setup",
      color: "bg-primary-600",
    },
  ]

  const recentImages = [
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
        className: "text-primary-600 border-primary-200 bg-primary-50 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800"
      }}
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Winner Banner */}
        <WinnerBanner winner={dailyWinner} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imágenes Generadas</CardTitle>
              <Sparkles className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.imagesGenerated}</div>
              <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts WhatsApp</CardTitle>
              <Smartphone className="h-4 w-4 text-tertiary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.whatsappPosts}</div>
              <p className="text-xs text-muted-foreground">Automáticos este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Galería</CardTitle>
              <Gallery className="h-4 w-4 text-secondary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.galleryItems}</div>
              <p className="text-xs text-muted-foreground">Imágenes guardadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uso Mensual</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((stats.imagesGenerated / stats.monthlyLimit) * 100)}%
              </div>
              <Progress
                value={(stats.imagesGenerated / stats.monthlyLimit) * 100}
                className="mt-2 [&>div]:bg-primary-500"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.imagesGenerated} de {stats.monthlyLimit} imágenes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 sm:mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-sm">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Images & Scheduled Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Images */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg">Imágenes Recientes</CardTitle>
              <Link href="/gallery">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  Ver todas
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                      <p className="text-xs sm:text-sm font-medium">{image.title}</p>
                      <p className="text-xs text-gray-500">{image.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Posts */}
          <ScheduledImagesList />
        </div>
      </div>
    </AppLayout>
  )
}
