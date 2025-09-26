"use client"

import { useState, useEffect } from "react"
import { TutorialsAdminService } from "@/lib/services/tutorialsAdminService"
import type { 
  TutorialsAdminHook, 
  LearningPathFormData,
  ModuleFormData,
  VideoFormData
} from "@/lib/types/tutorials"
import type { 
  LearningPathWithContent,
  TutorialModuleFormatted as TutorialModule,
  TutorialVideoFormatted as TutorialVideo
} from "@/lib/supabase/types"

export function useTutorialsAdmin(): TutorialsAdminHook {
  const [learningPaths, setLearningPaths] = useState<LearningPathWithContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLearningPaths = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const paths = await TutorialsAdminService.getAllLearningPaths()
      setLearningPaths(paths)
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
      
      const newPath = await TutorialsAdminService.createLearningPath(data)
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
      
      const updatedPath = await TutorialsAdminService.updateLearningPath(id, updates)
      
      setLearningPaths(prev => prev.map(path => 
        path.id === id ? updatedPath : path
      ))
      
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
      await TutorialsAdminService.deleteLearningPath(id)
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
      
      const newModule = await TutorialsAdminService.createModule(learningPathId, data)

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
      
      const updatedModule = await TutorialsAdminService.updateModule(moduleId, updates)
      
      setLearningPaths(prev => prev.map(path => ({
        ...path,
        modules: path.modules.map(module => 
          module.id === moduleId ? updatedModule : module
        ),
        updatedAt: path.modules.some(m => m.id === moduleId) ? new Date().toISOString() : path.updatedAt
      })))
      
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
      
      await TutorialsAdminService.deleteModule(moduleId)
      
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
      
      const newVideo = await TutorialsAdminService.createVideo(moduleId, data)

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
      
      const updatedVideo = await TutorialsAdminService.updateVideo(videoId, updates)
      
      setLearningPaths(prev => prev.map(path => ({
        ...path,
        modules: path.modules.map(module => ({
          ...module,
          videos: module.videos.map(video => 
            video.id === videoId ? updatedVideo : video
          ),
          updatedAt: module.videos.some(v => v.id === videoId) ? new Date().toISOString() : module.updatedAt
        })),
        updatedAt: path.modules.some(m => m.videos.some(v => v.id === videoId)) ? new Date().toISOString() : path.updatedAt
      })))
      
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
      
      await TutorialsAdminService.deleteVideo(videoId)
      
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