"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  PlayCircle,
  Clock,
  Users,
  Star,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Filter,
  Search,
} from "lucide-react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/AppLayout"
import { useTutorials } from "@/lib/hooks/useTutorials"
import { CourseCard } from "@/components/tutorials/CourseCard"
import { CategoryFilter } from "@/components/tutorials/CategoryFilter"
import { SearchBar } from "@/components/tutorials/SearchBar"

export default function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const { courses, categories, isLoading } = useTutorials()

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const stats = [
    {
      title: "Cursos Disponibles",
      value: courses.length,
      icon: BookOpen,
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

  if (isLoading) {
    return (
      <AppLayout title="Tutoriales" subtitle="Aprende marketing digital">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    )
  }

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
          {stats.map((stat, index) => (
            <Card key={index}>
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Buscar cursos, temas, instructores..."
            />
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Courses Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {selectedCategory === "all" 
                ? "Todos los Cursos" 
                : `Cursos de ${categories.find(c => c.id === selectedCategory)?.name}`
              }
            </h2>
            <span className="text-sm text-gray-500">
              {filteredCourses.length} cursos encontrados
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron cursos
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Intenta con otros términos de búsqueda o categorías
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Limpiar filtros
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Learning Path Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary-500" />
              Rutas de Aprendizaje Recomendadas
            </CardTitle>
            <CardDescription>
              Sigue estos caminos estructurados para dominar el marketing digital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-2 border-dashed border-primary-200 hover:border-primary-400 transition-colors cursor-pointer">
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

              <Card className="p-4 border-2 border-dashed border-secondary-200 hover:border-secondary-400 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-secondary-600 border-secondary-300">
                    Avanzado
                  </Badge>
                  <TrendingUp className="h-5 w-5 text-secondary-500" />
                </div>
                <h4 className="font-semibold mb-2">Especialista en Casinos Online</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Estrategias avanzadas, compliance y optimización de conversiones
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">6 cursos • 35 horas</span>
                  <Button size="sm" variant="outline">Ver Ruta</Button>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}