// =============================================
// TUTORIALS ADMIN SYSTEM TYPES
// =============================================

// Video/Class types
export interface TutorialVideo {
  id: string
  title: string
  description?: string | null
  videoUrl: string
  duration?: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface NewTutorialVideo {
  title: string
  description?: string | null
  videoUrl: string
  duration?: string | null
  order?: number
  isActive?: boolean
}

// Module types
export interface TutorialModule {
  id: string
  learningPathId: string
  title: string
  description?: string | null
  order: number
  isActive: boolean
  videos: TutorialVideo[]
  createdAt: string
  updatedAt: string
}

export interface NewTutorialModule {
  learningPathId: string
  title: string
  description?: string | null
  order?: number
  isActive?: boolean
}

// Extended Learning Path with modules and videos
export interface LearningPathWithContent {
  id: string
  title: string
  description: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  duration: string
  courseCount: number
  icon: string
  colorScheme: 'primary' | 'secondary' | 'tertiary'
  slug: string
  imageUrl?: string | null
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
  modules: TutorialModule[]
  createdAt: string
  updatedAt: string
}

// Form types for admin interface
export interface LearningPathFormData {
  title: string
  description: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  duration: string
  courseCount: number
  icon: string
  colorScheme: 'primary' | 'secondary' | 'tertiary'
  slug: string
  imageUrl?: string | null
  isFeatured: boolean
  isActive: boolean
  displayOrder: number
}

export interface ModuleFormData {
  title: string
  description?: string | null
  order: number
  isActive: boolean
}

export interface VideoFormData {
  title: string
  description?: string | null
  videoUrl: string
  duration?: string | null
  order: number
  isActive: boolean
}

// Hook return types for admin functionality
export interface TutorialsAdminHook {
  // Learning Paths
  learningPaths: LearningPathWithContent[]
  isLoading: boolean
  error: string | null

  // Learning Path operations
  createLearningPath: (data: LearningPathFormData) => Promise<LearningPathWithContent>
  updateLearningPath: (id: string, updates: Partial<LearningPathFormData>) => Promise<LearningPathWithContent>
  deleteLearningPath: (id: string) => Promise<void>

  // Module operations
  createModule: (learningPathId: string, data: ModuleFormData) => Promise<TutorialModule>
  updateModule: (moduleId: string, updates: Partial<ModuleFormData>) => Promise<TutorialModule>
  deleteModule: (moduleId: string) => Promise<void>

  // Video operations
  createVideo: (moduleId: string, data: VideoFormData) => Promise<TutorialVideo>
  updateVideo: (videoId: string, updates: Partial<VideoFormData>) => Promise<TutorialVideo>
  deleteVideo: (videoId: string) => Promise<void>

  // Utility functions
  refreshData: () => Promise<void>
  clearError: () => void
}

// API Response types
export interface TutorialsApiResponse {
  success: boolean
  data: LearningPathWithContent[]
  meta?: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface TutorialApiResponse {
  success: boolean
  data: LearningPathWithContent
}

export interface ModuleApiResponse {
  success: boolean
  data: TutorialModule
}

export interface VideoApiResponse {
  success: boolean
  data: TutorialVideo
}

// Default form values
export const DEFAULT_LEARNING_PATH_FORM: LearningPathFormData = {
  title: '',
  description: '',
  level: 'Principiante',
  duration: '',
  courseCount: 0,
  icon: '🎯',
  colorScheme: 'primary',
  slug: '',
  imageUrl: null,
  isFeatured: false,
  isActive: true,
  displayOrder: 1
}

export const DEFAULT_MODULE_FORM: ModuleFormData = {
  title: '',
  description: null,
  order: 1,
  isActive: true
}

export const DEFAULT_VIDEO_FORM: VideoFormData = {
  title: '',
  description: null,
  videoUrl: '',
  duration: null,
  order: 1,
  isActive: true
}

// Level color mapping
export const LEVEL_COLORS = {
  'Principiante': 'text-green-600 bg-green-100 border-green-200',
  'Intermedio': 'text-yellow-600 bg-yellow-100 border-yellow-200',
  'Avanzado': 'text-red-600 bg-red-100 border-red-200'
} as const

// Color scheme options
export const COLOR_SCHEME_OPTIONS = [
  { value: 'primary', label: 'Primario', color: 'bg-primary-500' },
  { value: 'secondary', label: 'Secundario', color: 'bg-secondary-500' },
  { value: 'tertiary', label: 'Terciario', color: 'bg-tertiary-500' }
] as const