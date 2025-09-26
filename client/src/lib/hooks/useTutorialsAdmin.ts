"use client"

import { useState, useEffect } from "react"
import type { 
  TutorialsAdminHook, 
  LearningPathWithContent, 
  LearningPathFormData,
  ModuleFormData,
  VideoFormData,
  TutorialModule,
  TutorialVideo
} from "@/lib/types/tutorials"

export function useTutorialsAdmin(): TutorialsAdminHook {
  const [learningPaths, setLearningPaths] = useState<LearningPathWithContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLearningPaths = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulamos datos estáticos por ahora, ya que no hay API específica
      // En el futuro esto se conectará con la API real
      const mockPaths: LearningPathWithContent[] = [
        {
          id: '1',
          title: 'Fundamentos del Marketing Digital',
          description: 'Conceptos básicos, herramientas esenciales y primeras estrategias',
          level: 'Principiante',
          duration: '4 módulos • 20 horas',
          courseCount: 4,
          icon: '🎯',
          colorScheme: 'primary',
          slug: 'fundamentos-marketing',
          imageUrl: null,
          isFeatured: true,
          isActive: true,
          displayOrder: 1,
          modules: [
            {
              id: 'mod1',
              learningPathId: '1',
              title: 'Introducción al Marketing Digital',
              description: 'Conceptos básicos y fundamentos del marketing online',
              order: 1,
              isActive: true,
              videos: [
                {
                  id: 'vid1',
                  title: '¿Qué es el Marketing Digital?',
                  description: 'Una introducción completa al mundo del marketing digital',
                  videoUrl: 'https://www.youtube.com/watch?v=example1',
                  duration: '15:30',
                  order: 1,
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                },
                {
                  id: 'vid2',
                  title: 'Principales Canales Digitales',
                  description: 'Exploración de los canales más importantes',
                  videoUrl: 'https://www.youtube.com/watch?v=example2',
                  duration: '22:45',
                  order: 2,
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 'mod2',
              learningPathId: '1',
              title: 'Herramientas Esenciales',
              description: 'Las herramientas que todo marketero digital debe conocer',
              order: 2,
              isActive: true,
              videos: [
                {
                  id: 'vid3',
                  title: 'Google Analytics para Principiantes',
                  description: 'Configuración y conceptos básicos de Analytics',
                  videoUrl: 'https://www.youtube.com/watch?v=example3',
                  duration: '28:12',
                  order: 1,
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Marketing en Redes Sociales',
          description: 'Estrategias en Instagram, Facebook, TikTok y plataformas emergentes',
          level: 'Intermedio',
          duration: '5 módulos • 25 horas',
          courseCount: 5,
          icon: '📱',
          colorScheme: 'secondary',
          slug: 'marketing-redes-sociales',
          imageUrl: null,
          isFeatured: true,
          isActive: true,
          displayOrder: 2,
          modules: [
            {
              id: 'mod3',
              learningPathId: '2',
              title: 'Estrategias en Instagram',
              description: 'Domina Instagram para tu marca',
              order: 1,
              isActive: true,
              videos: [
                {
                  id: 'vid4',
                  title: 'Optimización de Perfil en Instagram',
                  description: 'Cómo crear un perfil que convierta',
                  videoUrl: 'https://www.youtube.com/watch?v=example4',
                  duration: '18:30',
                  order: 1,
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      setLearningPaths(mockPaths)
    } catch (err) {
      console.error('useTutorialsAdmin - Error loading learning paths:', err)
      setError('Error al cargar las rutas de aprendizaje')
      setLearningPaths([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLearningPaths()
  }, [])

  // Learning Path operations
  const createLearningPath = async (data: LearningPathFormData): Promise<LearningPathWithContent> => {
    try {
      console.log('🆕 Creando nueva ruta de aprendizaje:', data)
      
      const newPath: LearningPathWithContent = {
        id: `path_${Date.now()}`,
        ...data,
        modules: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setLearningPaths(prev => [...prev, newPath])
      console.log('✅ Ruta de aprendizaje creada exitosamente')
      return newPath
    } catch (err) {
      console.error('❌ Error creando ruta de aprendizaje:', err)
      throw new Error('Error al crear la ruta de aprendizaje')
    }
  }

  const updateLearningPath = async (id: string, updates: Partial<LearningPathFormData>): Promise<LearningPathWithContent> => {
    try {
      console.log('✏️ Actualizando ruta de aprendizaje:', id, updates)
      
      const updatedPaths = learningPaths.map(path => 
        path.id === id 
          ? { ...path, ...updates, updatedAt: new Date().toISOString() }
          : path
      )
      
      setLearningPaths(updatedPaths)
      
      const updatedPath = updatedPaths.find(path => path.id === id)
      if (!updatedPath) {
        throw new Error('Ruta de aprendizaje no encontrada')
      }
      
      console.log('✅ Ruta de aprendizaje actualizada exitosamente')
      return updatedPath
    } catch (err) {
      console.error('❌ Error actualizando ruta de aprendizaje:', err)
      throw new Error('Error al actualizar la ruta de aprendizaje')
    }
  }

  const deleteLearningPath = async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Eliminando ruta de aprendizaje:', id)
      setLearningPaths(prev => prev.filter(path => path.id !== id))
      console.log('✅ Ruta de aprendizaje eliminada exitosamente')
    } catch (err) {
      console.error('❌ Error eliminando ruta de aprendizaje:', err)
      throw new Error('Error al eliminar la ruta de aprendizaje')
    }
  }

  // Module operations
  const createModule = async (learningPathId: string, data: ModuleFormData): Promise<TutorialModule> => {
    try {
      console.log('🆕 Creando nuevo módulo:', learningPathId, data)
      
      const newModule: TutorialModule = {
        id: `module_${Date.now()}`,
        learningPathId,
        ...data,
        videos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setLearningPaths(prev => prev.map(path => 
        path.id === learningPathId 
          ? { 
              ...path, 
              modules: [...path.modules, newModule],
              courseCount: path.modules.length + 1,
              updatedAt: new Date().toISOString()
            }
          : path
      ))

      console.log('✅ Módulo creado exitosamente')
      return newModule
    } catch (err) {
      console.error('❌ Error creando módulo:', err)
      throw new Error('Error al crear el módulo')
    }
  }

  const updateModule = async (moduleId: string, updates: Partial<ModuleFormData>): Promise<TutorialModule> => {
    try {
      console.log('✏️ Actualizando módulo:', moduleId, updates)
      
      let updatedModule: TutorialModule | null = null
      
      setLearningPaths(prev => prev.map(path => ({
        ...path,
        modules: path.modules.map(module => {
          if (module.id === moduleId) {
            updatedModule = { ...module, ...updates, updatedAt: new Date().toISOString() }
            return updatedModule
          }
          return module
        }),
        updatedAt: path.modules.some(m => m.id === moduleId) ? new Date().toISOString() : path.updatedAt
      })))
      
      if (!updatedModule) {
        throw new Error('Módulo no encontrado')
      }
      
      console.log('✅ Módulo actualizado exitosamente')
      return updatedModule
    } catch (err) {
      console.error('❌ Error actualizando módulo:', err)
      throw new Error('Error al actualizar el módulo')
    }
  }

  const deleteModule = async (moduleId: string): Promise<void> => {
    try {
      console.log('🗑️ Eliminando módulo:', moduleId)
      
      setLearningPaths(prev => prev.map(path => ({
        ...path,
        modules: path.modules.filter(module => module.id !== moduleId),
        courseCount: Math.max(0, path.modules.length - 1),
        updatedAt: path.modules.some(m => m.id === moduleId) ? new Date().toISOString() : path.updatedAt
      })))
      
      console.log('✅ Módulo eliminado exitosamente')
    } catch (err) {
      console.error('❌ Error eliminando módulo:', err)
      throw new Error('Error al eliminar el módulo')
    }
  }

  // Video operations
  const createVideo = async (moduleId: string, data: VideoFormData): Promise<TutorialVideo> => {
    try {
      console.log('🆕 Creando nuevo video:', moduleId, data)
      
      const newVideo: TutorialVideo = {
        id: `video_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setLearningPaths(prev => prev.map(path => ({
        ...path,
        modules: path.modules.map(module => 
          module.id === moduleId 
            ? { 
                ...module, 
                videos: [...module.videos, newVideo],
                updatedAt: new Date().toISOString()
              }
            : module
        ),
        updatedAt: path.modules.some(m => m.id === moduleId) ? new Date().toISOString() : path.updatedAt
      })))

      console.log('✅ Video creado exitosamente')
      return newVideo
    } catch (err) {
      console.error('❌ Error creando video:', err)
      throw new Error('Error al crear el video')
    }
  }

  const updateVideo = async (videoId: string, updates: Partial<VideoFormData>): Promise<TutorialVideo> => {
    try {
      console.log('✏️ Actualizando video:', videoId, updates)
      
      let updatedVideo: TutorialVideo | null = null
      
      setLearningPaths(prev => prev.map(path => ({
        ...path,
        modules: path.modules.map(module => ({
          ...module,
          videos: module.videos.map(video => {
            if (video.id === videoId) {
              updatedVideo = { ...video, ...updates, updatedAt: new Date().toISOString() }
              return updatedVideo
            }
            return video
          }),
          updatedAt: module.videos.some(v => v.id === videoId) ? new Date().toISOString() : module.updatedAt
        })),
        updatedAt: path.modules.some(m => m.videos.some(v => v.id === videoId)) ? new Date().toISOString() : path.updatedAt
      })))
      
      if (!updatedVideo) {
        throw new Error('Video no encontrado')
      }
      
      console.log('✅ Video actualizado exitosamente')
      return updatedVideo
    } catch (err) {
      console.error('❌ Error actualizando video:', err)
      throw new Error('Error al actualizar el video')
    }
  }

  const deleteVideo = async (videoId: string): Promise<void> => {
    try {
      console.log('🗑️ Eliminando video:', videoId)
      
      setLearningPaths(prev => prev.map(path => ({
        ...path,
        modules: path.modules.map(module => ({
          ...module,
          videos: module.videos.filter(video => video.id !== videoId),
          updatedAt: module.videos.some(v => v.id === videoId) ? new Date().toISOString() : module.updatedAt
        })),
        updatedAt: path.modules.some(m => m.videos.some(v => v.id === videoId)) ? new Date().toISOString() : path.updatedAt
      })))
      
      console.log('✅ Video eliminado exitosamente')
    } catch (err) {
      console.error('❌ Error eliminando video:', err)
      throw new Error('Error al eliminar el video')
    }
  }

  const refreshData = async (): Promise<void> => {
    await fetchLearningPaths()
  }

  const clearError = (): void => {
    setError(null)
  }

  return {
    learningPaths,
    isLoading,
    error,
    createLearningPath,
    updateLearningPath,
    deleteLearningPath,
    createModule,
    updateModule,
    deleteModule,
    createVideo,
    updateVideo,
    deleteVideo,
    refreshData,
    clearError
  }
}