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

export default function Dashboard() {
  const [stats] = useState({
    imagesGenerated: 127,
    whatsappPosts: 45,
    galleryItems: 89,
    monthlyLimit: 500,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Bienvenido de vuelta, Juan</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className="text-primary-600 border-primary-200 bg-primary-50 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800"
            >
              Plan Pro
            </Badge>
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Images */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Imágenes Recientes</CardTitle>
              <Link href="/gallery">
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {recentImages.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{image.title}</p>
                      <p className="text-xs text-gray-500">{image.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Próximas Publicaciones</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Programar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="h-5 w-5 text-secondary-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Historia WhatsApp</p>
                    <p className="text-xs text-gray-500">Hoy a las 9:00 AM</p>
                  </div>
                  <Badge variant="secondary">Programado</Badge>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                  <Calendar className="h-5 w-5 text-tertiary-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Historia WhatsApp</p>
                    <p className="text-xs text-gray-500">Mañana a las 9:00 AM</p>
                  </div>
                  <Badge variant="secondary">Programado</Badge>
                </div>
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Configura publicaciones automáticas en WhatsApp</p>
                  <Link href="/whatsapp-setup">
                    <Button variant="link" size="sm">
                      Configurar ahora
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
