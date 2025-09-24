"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { LearningPathFormatted } from "@/lib/supabase/types"

interface UseLearningPathsReturn {
  learningPaths: LearningPathFormatted[]
  featuredPaths: LearningPathFormatted[]
  isLoading: boolean
  error: string | null
  refreshLearningPaths: () => void
}

export function useLearningPaths(): UseLearningPathsReturn {
  const [learningPaths, setLearningPaths] = useState<LearningPathFormatted[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLearningPaths = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (supabaseError) {
        console.error('Error fetching learning paths:', supabaseError)
        throw supabaseError
      }

      const formattedPaths: LearningPathFormatted[] = (data || []).map(path => ({
        id: path.id,
        title: path.title,
        description: path.description,
        level: path.level,
        duration: path.duration,
        courseCount: path.course_count,
        icon: path.icon,
        colorScheme: path.color_scheme,
        slug: path.slug,
        imageUrl: path.image_url,
        isFeatured: path.is_featured,
        isActive: path.is_active,
        displayOrder: path.display_order,
        createdAt: path.created_at,
        updatedAt: path.updated_at,
        href: `/tutorials/${path.slug}`
      }))

      setLearningPaths(formattedPaths)
    } catch (err) {
      console.error('useLearningPaths - Error loading learning paths:', err)
      setError('Error al cargar las rutas de aprendizaje')
      
      // Fallback a datos estáticos si hay error
      const fallbackPaths: LearningPathFormatted[] = [
        {
          id: '1',
          title: 'Fundamentos del Marketing Digital',
          description: 'Conceptos básicos, herramientas esenciales y primeras estrategias',
          level: 'Principiante',
          duration: '4 cursos • 20 horas',
          courseCount: 4,
          icon: '🎯',
          colorScheme: 'primary',
          slug: 'fundamentos-marketing',
          imageUrl: null,
          isFeatured: true,
          isActive: true,
          displayOrder: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          href: '/tutorials/fundamentos-marketing'
        },
        {
          id: '2',
          title: 'Marketing en Redes Sociales',
          description: 'Estrategias en Instagram, Facebook, TikTok y plataformas emergentes',
          level: 'Intermedio',
          duration: '5 cursos • 25 horas',
          courseCount: 5,
          icon: '📱',
          colorScheme: 'secondary',
          slug: 'marketing-redes-sociales',
          imageUrl: null,
          isFeatured: true,
          isActive: true,
          displayOrder: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          href: '/tutorials/marketing-redes-sociales'
        },
        {
          id: '3',
          title: 'Especialista en Casinos Online',
          description: 'Estrategias avanzadas, compliance y optimización de conversiones',
          level: 'Avanzado',
          duration: '6 cursos • 35 horas',
          courseCount: 6,
          icon: '🎰',
          colorScheme: 'tertiary',
          slug: 'casinos-online',
          imageUrl: null,
          isFeatured: true,
          isActive: true,
          displayOrder: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          href: '/tutorials/casinos-online'
        }
      ]
      setLearningPaths(fallbackPaths)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLearningPaths()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const featuredPaths = learningPaths.filter(path => path.isFeatured)

  return {
    learningPaths,
    featuredPaths,
    isLoading,
    error,
    refreshLearningPaths: fetchLearningPaths
  }
}
