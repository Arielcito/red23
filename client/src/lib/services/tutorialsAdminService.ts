import { supabase } from "@/lib/supabase/client"
import type { 
  LearningPath,
  NewLearningPath,
  TutorialModule,
  NewTutorialModule,
  TutorialVideo,
  NewTutorialVideo,
  LearningPathFormatted,
  TutorialModuleFormatted,
  TutorialVideoFormatted,
  LearningPathWithContent
} from "@/lib/supabase/types"
import type { LearningPathFormData } from "@/lib/types/tutorials"

// =============================================
// LEARNING PATHS OPERATIONS
// =============================================

export const TutorialsAdminService = {
  // Learning Paths
  async getAllLearningPaths(): Promise<LearningPathWithContent[]> {
    console.log('🔍 Fetching all learning paths with content...')
    
    try {
      // First get all learning paths
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*')
        .order('display_order', { ascending: true })

      if (pathsError) {
        console.error('❌ Error fetching learning paths:', pathsError)
        throw pathsError
      }

      const paths = pathsData || []
      console.log(`✅ Found ${paths.length} learning paths`)

      // For each path, get its modules and videos
      const pathsWithContent: LearningPathWithContent[] = await Promise.all(
        paths.map(async (path) => {
          const modules = await this.getModulesByLearningPath(path.id)
          
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
            modules
          }
        })
      )

      console.log('✅ Successfully fetched learning paths with content')
      return pathsWithContent
    } catch (error) {
      console.error('❌ TutorialsAdminService.getAllLearningPaths error:', error)
      throw error
    }
  },

  async createLearningPath(data: LearningPathFormData): Promise<LearningPathWithContent> {
    console.log('🆕 Creating learning path:', data.title)
    
    try {
      const newPath: NewLearningPath = {
        title: data.title,
        description: data.description,
        level: data.level,
        duration: data.duration,
        course_count: data.courseCount,
        icon: data.icon,
        color_scheme: data.colorScheme,
        slug: data.slug,
        image_url: data.imageUrl,
        is_featured: data.isFeatured,
        is_active: data.isActive,
        display_order: data.displayOrder
      }

      const { data: createdData, error } = await supabase
        .from('learning_paths')
        .insert([newPath])
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating learning path:', error)
        throw error
      }

      console.log('✅ Learning path created successfully')
      
      // Return the created path with empty modules array
      const formattedPath: LearningPathWithContent = {
        id: createdData.id,
        title: createdData.title,
        description: createdData.description,
        level: createdData.level,
        duration: createdData.duration,
        courseCount: createdData.course_count,
        icon: createdData.icon,
        colorScheme: createdData.color_scheme,
        slug: createdData.slug,
        imageUrl: createdData.image_url,
        isFeatured: createdData.is_featured,
        isActive: createdData.is_active,
        displayOrder: createdData.display_order,
        createdAt: createdData.created_at,
        updatedAt: createdData.updated_at,
        href: `/tutorials/${createdData.slug}`,
        modules: []
      }

      return formattedPath
    } catch (error) {
      console.error('❌ TutorialsAdminService.createLearningPath error:', error)
      throw error
    }
  },

  async updateLearningPath(id: string, updates: Partial<LearningPathFormData>): Promise<LearningPathWithContent> {
    console.log('✏️ Updating learning path:', id)
    
    try {
      const updateData: Partial<LearningPath> = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.level !== undefined) updateData.level = updates.level
      if (updates.duration !== undefined) updateData.duration = updates.duration
      if (updates.courseCount !== undefined) updateData.course_count = updates.courseCount
      if (updates.icon !== undefined) updateData.icon = updates.icon
      if (updates.colorScheme !== undefined) updateData.color_scheme = updates.colorScheme
      if (updates.slug !== undefined) updateData.slug = updates.slug
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl
      if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive
      if (updates.displayOrder !== undefined) updateData.display_order = updates.displayOrder

      const { data: updatedData, error } = await supabase
        .from('learning_paths')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating learning path:', error)
        throw error
      }

      console.log('✅ Learning path updated successfully')
      
      // Get modules for the updated path
      const modules = await this.getModulesByLearningPath(id)
      
      const formattedPath: LearningPathWithContent = {
        id: updatedData.id,
        title: updatedData.title,
        description: updatedData.description,
        level: updatedData.level,
        duration: updatedData.duration,
        courseCount: updatedData.course_count,
        icon: updatedData.icon,
        colorScheme: updatedData.color_scheme,
        slug: updatedData.slug,
        imageUrl: updatedData.image_url,
        isFeatured: updatedData.is_featured,
        isActive: updatedData.is_active,
        displayOrder: updatedData.display_order,
        createdAt: updatedData.created_at,
        updatedAt: updatedData.updated_at,
        href: `/tutorials/${updatedData.slug}`,
        modules
      }

      return formattedPath
    } catch (error) {
      console.error('❌ TutorialsAdminService.updateLearningPath error:', error)
      throw error
    }
  },

  async deleteLearningPath(id: string): Promise<void> {
    console.log('🗑️ Deleting learning path:', id)
    
    try {
      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error deleting learning path:', error)
        throw error
      }

      console.log('✅ Learning path deleted successfully')
    } catch (error) {
      console.error('❌ TutorialsAdminService.deleteLearningPath error:', error)
      throw error
    }
  },

  // =============================================
  // MODULES OPERATIONS
  // =============================================

  async getModulesByLearningPath(learningPathId: string): Promise<TutorialModuleFormatted[]> {
    try {
      const { data: modulesData, error } = await supabase
        .from('tutorial_modules')
        .select('*')
        .eq('learning_path_id', learningPathId)
        .order('order_index', { ascending: true })

      if (error) {
        console.error('❌ Error fetching modules:', error)
        throw error
      }

      const modules = modulesData || []
      
      // For each module, get its videos
      const modulesWithVideos: TutorialModuleFormatted[] = await Promise.all(
        modules.map(async (module) => {
          const videos = await this.getVideosByModule(module.id)
          
          return {
            id: module.id,
            learningPathId: module.learning_path_id,
            title: module.title,
            description: module.description,
            order: module.order_index,
            isActive: module.is_active,
            videos,
            createdAt: module.created_at,
            updatedAt: module.updated_at
          }
        })
      )

      return modulesWithVideos
    } catch (error) {
      console.error('❌ TutorialsAdminService.getModulesByLearningPath error:', error)
      throw error
    }
  },

  async createModule(learningPathId: string, data: {
    title: string
    description?: string | null
    order: number
    isActive: boolean
  }): Promise<TutorialModuleFormatted> {
    console.log('🆕 Creating module:', data.title)
    
    try {
      const newModule: NewTutorialModule = {
        learning_path_id: learningPathId,
        title: data.title,
        description: data.description,
        order_index: data.order,
        is_active: data.isActive
      }

      const { data: createdData, error } = await supabase
        .from('tutorial_modules')
        .insert([newModule])
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating module:', error)
        throw error
      }

      console.log('✅ Module created successfully')
      
      return {
        id: createdData.id,
        learningPathId: createdData.learning_path_id,
        title: createdData.title,
        description: createdData.description,
        order: createdData.order_index,
        isActive: createdData.is_active,
        videos: [],
        createdAt: createdData.created_at,
        updatedAt: createdData.updated_at
      }
    } catch (error) {
      console.error('❌ TutorialsAdminService.createModule error:', error)
      throw error
    }
  },

  async updateModule(moduleId: string, updates: Partial<{
    title: string
    description: string | null
    order: number
    isActive: boolean
  }>): Promise<TutorialModuleFormatted> {
    console.log('✏️ Updating module:', moduleId)
    
    try {
      const updateData: Partial<TutorialModule> = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.order !== undefined) updateData.order_index = updates.order
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive

      const { data: updatedData, error } = await supabase
        .from('tutorial_modules')
        .update(updateData)
        .eq('id', moduleId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating module:', error)
        throw error
      }

      console.log('✅ Module updated successfully')
      
      // Get videos for the updated module
      const videos = await this.getVideosByModule(moduleId)
      
      return {
        id: updatedData.id,
        learningPathId: updatedData.learning_path_id,
        title: updatedData.title,
        description: updatedData.description,
        order: updatedData.order_index,
        isActive: updatedData.is_active,
        videos,
        createdAt: updatedData.created_at,
        updatedAt: updatedData.updated_at
      }
    } catch (error) {
      console.error('❌ TutorialsAdminService.updateModule error:', error)
      throw error
    }
  },

  async deleteModule(moduleId: string): Promise<void> {
    console.log('🗑️ Deleting module:', moduleId)
    
    try {
      const { error } = await supabase
        .from('tutorial_modules')
        .delete()
        .eq('id', moduleId)

      if (error) {
        console.error('❌ Error deleting module:', error)
        throw error
      }

      console.log('✅ Module deleted successfully')
    } catch (error) {
      console.error('❌ TutorialsAdminService.deleteModule error:', error)
      throw error
    }
  },

  // =============================================
  // VIDEOS OPERATIONS
  // =============================================

  async getVideosByModule(moduleId: string): Promise<TutorialVideoFormatted[]> {
    try {
      const { data: videosData, error } = await supabase
        .from('tutorial_videos')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true })

      if (error) {
        console.error('❌ Error fetching videos:', error)
        throw error
      }

      const videos = videosData || []
      
      return videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: video.video_url,
        duration: video.duration,
        order: video.order_index,
        isActive: video.is_active,
        createdAt: video.created_at,
        updatedAt: video.updated_at
      }))
    } catch (error) {
      console.error('❌ TutorialsAdminService.getVideosByModule error:', error)
      throw error
    }
  },

  async createVideo(moduleId: string, data: {
    title: string
    description?: string | null
    videoUrl: string
    duration?: string | null
    order: number
    isActive: boolean
  }): Promise<TutorialVideoFormatted> {
    console.log('🆕 Creating video:', data.title)
    
    try {
      const newVideo: NewTutorialVideo = {
        module_id: moduleId,
        title: data.title,
        description: data.description,
        video_url: data.videoUrl,
        duration: data.duration,
        order_index: data.order,
        is_active: data.isActive
      }

      const { data: createdData, error } = await supabase
        .from('tutorial_videos')
        .insert([newVideo])
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating video:', error)
        throw error
      }

      console.log('✅ Video created successfully')
      
      return {
        id: createdData.id,
        title: createdData.title,
        description: createdData.description,
        videoUrl: createdData.video_url,
        duration: createdData.duration,
        order: createdData.order_index,
        isActive: createdData.is_active,
        createdAt: createdData.created_at,
        updatedAt: createdData.updated_at
      }
    } catch (error) {
      console.error('❌ TutorialsAdminService.createVideo error:', error)
      throw error
    }
  },

  async updateVideo(videoId: string, updates: Partial<{
    title: string
    description: string | null
    videoUrl: string
    duration: string | null
    order: number
    isActive: boolean
  }>): Promise<TutorialVideoFormatted> {
    console.log('✏️ Updating video:', videoId)
    
    try {
      const updateData: Partial<TutorialVideo> = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.videoUrl !== undefined) updateData.video_url = updates.videoUrl
      if (updates.duration !== undefined) updateData.duration = updates.duration
      if (updates.order !== undefined) updateData.order_index = updates.order
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive

      const { data: updatedData, error } = await supabase
        .from('tutorial_videos')
        .update(updateData)
        .eq('id', videoId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating video:', error)
        throw error
      }

      console.log('✅ Video updated successfully')
      
      return {
        id: updatedData.id,
        title: updatedData.title,
        description: updatedData.description,
        videoUrl: updatedData.video_url,
        duration: updatedData.duration,
        order: updatedData.order_index,
        isActive: updatedData.is_active,
        createdAt: updatedData.created_at,
        updatedAt: updatedData.updated_at
      }
    } catch (error) {
      console.error('❌ TutorialsAdminService.updateVideo error:', error)
      throw error
    }
  },

  async deleteVideo(videoId: string): Promise<void> {
    console.log('🗑️ Deleting video:', videoId)
    
    try {
      const { error } = await supabase
        .from('tutorial_videos')
        .delete()
        .eq('id', videoId)

      if (error) {
        console.error('❌ Error deleting video:', error)
        throw error
      }

      console.log('✅ Video deleted successfully')
    } catch (error) {
      console.error('❌ TutorialsAdminService.deleteVideo error:', error)
      throw error
    }
  }
}
