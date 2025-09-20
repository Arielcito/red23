"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PlayCircle,
  Clock,
  Users,
  Star,
  Target,
  TrendingUp,
  Award,
} from "lucide-react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/AppLayout"

export default function TutorialsPage() {

  const stats = [
    {
      title: "Rutas Disponibles",
      value: "3",
      icon: Target,
      color: "text-primary-500"
    },
    {
      title: "Estudiantes Activos",
      value: "2,847",
      icon: Users,
      color: "text-secondary-500"
    },
    {
      title: "Horas de Contenido",
      value: "156h",
      icon: Clock,
      color: "text-tertiary-500"
    },
    {
      title: "Satisfacción",
      value: "98%",
      icon: Star,
      color: "text-yellow-500"
    }
  ]

  return (
    <AppLayout
      title="Tutoriales"
      subtitle="Aprende marketing digital con nuestros cursos"
      badge={{
        text: "Nuevo",
        variant: "default",
        className: "bg-primary-500 text-white"
      }}
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Course Banner */}
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <Badge className="bg-primary-100 text-primary-700 border-primary-200 mb-3">
                  🔥 Curso Destacado
                </Badge>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Marketing Digital para Casinos Online
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Aprende las estrategias más efectivas para promocionar casinos online de forma legal y ética
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>8 horas</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>1,234 estudiantes</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Comenzar Curso
                </Button>
                <span className="text-sm text-gray-500">Gratis con tu plan</span>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Learning Path Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary-500" />
              Rutas de Aprendizaje
            </CardTitle>
            <CardDescription>
              Elige tu camino de aprendizaje y accede a cursos organizados por nivel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tutorials/fundamentos-marketing">
                <Card className="p-4 border-2 border-dashed border-primary-200 hover:border-primary-400 transition-colors cursor-pointer h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-primary-600 border-primary-300">
                      Principiante
                    </Badge>
                    <Award className="h-5 w-5 text-primary-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Fundamentos del Marketing Digital</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Conceptos básicos, herramientas esenciales y primeras estrategias
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">4 cursos • 20 horas</span>
                    <Button size="sm" variant="outline">Ver Ruta</Button>
                  </div>
                </Card>
              </Link>

              <Link href="/tutorials/marketing-redes-sociales">
                <Card className="p-4 border-2 border-dashed border-secondary-200 hover:border-secondary-400 transition-colors cursor-pointer h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-secondary-600 border-secondary-300">
                      Intermedio
                    </Badge>
                    <TrendingUp className="h-5 w-5 text-secondary-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Marketing en Redes Sociales</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Estrategias en Instagram, Facebook, TikTok y plataformas emergentes
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">4 cursos • 25 horas</span>
                    <Button size="sm" variant="outline">Ver Ruta</Button>
                  </div>
                </Card>
              </Link>

              <Link href="/tutorials/casinos-online">
                <Card className="p-4 border-2 border-dashed border-tertiary-200 hover:border-tertiary-400 transition-colors cursor-pointer h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-tertiary-600 border-tertiary-300">
                      Avanzado
                    </Badge>
                    <Target className="h-5 w-5 text-tertiary-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Especialista en Casinos Online</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Estrategias avanzadas, compliance y optimización de conversiones
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">4 cursos • 30 horas</span>
                    <Button size="sm" variant="outline">Ver Ruta</Button>
                  </div>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}