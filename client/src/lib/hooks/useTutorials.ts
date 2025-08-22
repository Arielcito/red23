"use client"

import { useState, useEffect } from "react"
import type { Course } from "@/components/tutorials/CourseCard"
import type { Category } from "@/components/tutorials/CategoryFilter"

interface UseTutorialsReturn {
  courses: Course[]
  categories: Category[]
  isLoading: boolean
  error: string | null
}

export function useTutorials(): UseTutorialsReturn {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simular carga de datos
    const loadTutorials = async () => {
      try {
        setIsLoading(true)
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Datos de ejemplo para cursos de marketing
        const mockCourses: Course[] = [
          {
            id: "1",
            title: "Fundamentos del Marketing Digital para Casinos",
            description: "Aprende los conceptos básicos del marketing digital aplicados específicamente a la industria de casinos online.",
            instructor: "Carlos Ruiz",
            duration: "4h 30m",
            studentsCount: 1234,
            rating: 4.8,
            reviewsCount: 156,
            thumbnail: "/placeholder.svg?height=200&width=300&text=Marketing+Digital",
            category: "marketing-digital",
            level: "Principiante",
            isFree: true,
            isPopular: true,
            lessons: 12,
            progress: 65
          },
          {
            id: "2",
            title: "Estrategias de Contenido Visual para Redes Sociales",
            description: "Domina la creación de contenido visual atractivo que genere engagement en plataformas sociales.",
            instructor: "Ana Martín",
            duration: "6h 15m",
            studentsCount: 892,
            rating: 4.9,
            reviewsCount: 203,
            thumbnail: "/placeholder.svg?height=200&width=300&text=Contenido+Visual",
            category: "redes-sociales",
            level: "Intermedio",
            price: 49,
            originalPrice: 99,
            isFree: false,
            isNew: true,
            lessons: 18
          },
          {
            id: "3",
            title: "SEO Avanzado para Sitios de Entretenimiento",
            description: "Técnicas avanzadas de SEO específicas para mejorar la visibilidad de sitios de entretenimiento online.",
            instructor: "Miguel Torres",
            duration: "8h 45m",
            studentsCount: 567,
            rating: 4.7,
            reviewsCount: 89,
            thumbnail: "/placeholder.svg?height=200&width=300&text=SEO+Avanzado",
            category: "seo",
            level: "Avanzado",
            price: 79,
            isFree: false,
            lessons: 24
          },
          {
            id: "4",
            title: "Email Marketing: Automatización y Personalización",
            description: "Crea campañas de email marketing efectivas con automatización inteligente y personalización avanzada.",
            instructor: "Laura González",
            duration: "5h 20m",
            studentsCount: 1456,
            rating: 4.6,
            reviewsCount: 234,
            thumbnail: "/placeholder.svg?height=200&width=300&text=Email+Marketing",
            category: "email-marketing",
            level: "Intermedio",
            price: 39,
            isFree: false,
            isPopular: true,
            lessons: 15
          },
          {
            id: "5",
            title: "Análisis de Datos y Métricas de Marketing",
            description: "Aprende a interpretar datos de marketing y tomar decisiones basadas en métricas reales.",
            instructor: "Roberto Silva",
            duration: "7h 10m",
            studentsCount: 743,
            rating: 4.8,
            reviewsCount: 112,
            thumbnail: "/placeholder.svg?height=200&width=300&text=Analytics",
            category: "analytics",
            level: "Avanzado",
            price: 69,
            isFree: false,
            lessons: 21
          },
          {
            id: "6",
            title: "Publicidad Programática: Google Ads y Facebook Ads",
            description: "Domina las plataformas de publicidad más importantes para maximizar el ROI de tus campañas.",
            instructor: "Carmen López",
            duration: "9h 30m",
            studentsCount: 2134,
            rating: 4.9,
            reviewsCount: 445,
            thumbnail: "/placeholder.svg?height=200&width=300&text=Publicidad+Digital",
            category: "publicidad-digital",
            level: "Intermedio",
            isFree: true,
            isPopular: true,
            lessons: 28,
            progress: 23
          }
        ]

        // Datos de ejemplo para categorías
        const mockCategories: Category[] = [
          { id: "marketing-digital", name: "Marketing Digital", count: 1, icon: "📱" },
          { id: "redes-sociales", name: "Redes Sociales", count: 1, icon: "📱" },
          { id: "seo", name: "SEO", count: 1, icon: "🔍" },
          { id: "email-marketing", name: "Email Marketing", count: 1, icon: "📧" },
          { id: "analytics", name: "Analytics", count: 1, icon: "📊" },
          { id: "publicidad-digital", name: "Publicidad Digital", count: 1, icon: "🎯" }
        ]

        setCourses(mockCourses)
        setCategories(mockCategories)
        setError(null)
      } catch (err) {
        console.error("Error loading tutorials:", err)
        setError("Error al cargar los tutoriales")
      } finally {
        setIsLoading(false)
      }
    }

    loadTutorials()
  }, [])

  return {
    courses,
    categories,
    isLoading,
    error
  }
}