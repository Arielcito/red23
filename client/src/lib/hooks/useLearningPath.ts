"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { LearningPathWithContent } from "@/lib/supabase/types"

interface UseLearningPathReturn {
  learningPath: LearningPathWithContent | null
  isLoading: boolean
  error: string | null
  refreshLearningPath: () => void
}

export function useLearningPath(slug: string): UseLearningPathReturn {
  const [learningPath, setLearningPath] = useState<LearningPathWithContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLearningPath = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔍 Fetching learning path with slug:', slug)

      // Get the learning path by slug
      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (pathError) {
        if (pathError.code === 'PGRST116') {
          console.error('❌ Learning path not found:', slug)
          setError('Ruta de aprendizaje no encontrada')
          return
        }
        console.error('❌ Error fetching learning path:', pathError)
        throw pathError
      }

      if (!pathData) {
        setError('Ruta de aprendizaje no encontrada')
        return
      }

      console.log('✅ Found learning path:', pathData.title)

      // Get modules for this path
      const { data: modulesData, error: modulesError } = await supabase
        .from('tutorial_modules')
        .select('*')
        .eq('learning_path_id', pathData.id)
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (modulesError) {
        console.error('❌ Error fetching modules:', modulesError)
        throw modulesError
      }

      const modules = modulesData || []
      console.log(`✅ Found ${modules.length} modules`)

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
            console.error('❌ Error fetching videos for module:', module.id, videosError)
            // Continue with empty videos array if there's an error
          }

          const videos = videosData || []
          console.log(`✅ Found ${videos.length} videos for module: ${module.title}`)

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

      const formattedPath: LearningPathWithContent = {
        id: pathData.id,
        title: pathData.title,
        description: pathData.description,
        level: pathData.level,
        duration: pathData.duration,
        courseCount: pathData.course_count,
        icon: pathData.icon,
        colorScheme: pathData.color_scheme,
        slug: pathData.slug,
        imageUrl: pathData.image_url,
        isFeatured: pathData.is_featured,
        isActive: pathData.is_active,
        displayOrder: pathData.display_order,
        createdAt: pathData.created_at,
        updatedAt: pathData.updated_at,
        href: `/tutorials/${pathData.slug}`,
        modules: modulesWithVideos
      }

      setLearningPath(formattedPath)
      console.log('✅ Learning path loaded successfully with content')
    } catch (err) {
      console.error('useLearningPath - Error loading learning path:', err)
      setError('Error al cargar la ruta de aprendizaje')
      setLearningPath(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchLearningPath()
    }
  }, [slug])

  return {
    learningPath,
    isLoading,
    error,
    refreshLearningPath: fetchLearningPath
  }
}