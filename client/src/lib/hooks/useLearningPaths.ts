"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { LearningPathFormatted, LearningPathWithContent } from "@/lib/supabase/types"

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

      // Get learning paths with modules and videos
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (pathsError) {
        console.error('Error fetching learning paths:', pathsError)
        throw pathsError
      }

      const paths = pathsData || []

      // For each path, get its modules and videos
      const pathsWithContent: LearningPathWithContent[] = await Promise.all(
        paths.map(async (path) => {
          // Get modules for this path
          const { data: modulesData, error: modulesError } = await supabase
            .from('tutorial_modules')
            .select('*')
            .eq('learning_path_id', path.id)
            .eq('is_active', true)
            .order('order_index', { ascending: true })

          if (modulesError) {
            console.error('Error fetching modules:', modulesError)
            // Continue with empty modules array if there's an error
          }

          const modules = modulesData || []

          // For each module, get its videos
          const modulesWithVideos = await Promise.all(
            modules.map(async (module) => {
              const { data: videosData, error: videosError } = await supabase
                .from('tutorial_videos')
                .select('*')
                .eq('module_id', module.id)
                .eq('is_active', true)
                .order('order_index', { ascending: true })

              if (videosError) {
                console.error('Error fetching videos:', videosError)
                // Continue with empty videos array if there's an error
              }

              const videos = videosData || []

              return {
                id: module.id,
                learningPathId: module.learning_path_id,
                title: module.title,
                description: module.description,
                order: module.order_index,
                isActive: module.is_active,
                videos: videos.map(video => ({
                  id: video.id,
                  title: video.title,
                  description: video.description,
                  videoUrl: video.video_url,
                  duration: video.duration,
                  order: video.order_index,
                  isActive: video.is_active,
                  createdAt: video.created_at,
                  updatedAt: video.updated_at
                })),
                createdAt: module.created_at,
                updatedAt: module.updated_at
              }
            })
          )

          const formattedPath: LearningPathFormatted = {
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
          }

          return {
            ...formattedPath,
            modules: modulesWithVideos
          }
        })
      )

      // Extract just the basic formatted paths for compatibility
      const formattedPaths: LearningPathFormatted[] = pathsWithContent.map(({ modules, ...path }) => path)
      
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
          level: 'Cajero',
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
          level: 'Administrador',
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
          level: 'Proveedor',
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
