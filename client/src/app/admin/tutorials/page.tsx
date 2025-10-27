"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useTutorialsAdmin } from "@/lib/hooks/useTutorialsAdmin"
import { LearningPathForm } from "@/components/admin/tutorials/LearningPathForm"
import { ModuleForm } from "@/components/admin/tutorials/ModuleForm"
import { VideoForm } from "@/components/admin/tutorials/VideoForm"
import type { 
  LearningPathWithContent, 
  TutorialModule, 
  TutorialVideo,
  LearningPathFormData,
  ModuleFormData,
  VideoFormData
} from "@/lib/types/tutorials"
import { LEVEL_COLORS } from "@/lib/types/tutorials"
import {
  Target,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Video,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  PlayCircle,
  ExternalLink,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminTutorialsPage() {
  const { 
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
    deleteVideo
  } = useTutorialsAdmin()

  // Form states
  const [showCreatePathForm, setShowCreatePathForm] = useState(false)
  const [editingPath, setEditingPath] = useState<LearningPathWithContent | null>(null)
  const [showCreateModuleForm, setShowCreateModuleForm] = useState(false)
  const [selectedPathForModule, setSelectedPathForModule] = useState<LearningPathWithContent | null>(null)
  const [editingModule, setEditingModule] = useState<TutorialModule | null>(null)
  const [showCreateVideoForm, setShowCreateVideoForm] = useState(false)
  const [selectedModuleForVideo, setSelectedModuleForVideo] = useState<TutorialModule | null>(null)
  const [editingVideo, setEditingVideo] = useState<TutorialVideo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Collapsible states for modules
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  const togglePathExpansion = (pathId: string) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pathId)) {
        newSet.delete(pathId)
      } else {
        newSet.add(pathId)
      }
      return newSet
    })
  }

  // Learning Path handlers
  const handleCreatePath = async (data: LearningPathFormData) => {
    setIsSubmitting(true)
    try {
      await createLearningPath(data)
      setShowCreatePathForm(false)
    } catch (error) {
      console.error('Error creating learning path:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdatePath = async (data: LearningPathFormData) => {
    if (!editingPath) return
    
    setIsSubmitting(true)
    try {
      await updateLearningPath(editingPath.id, data)
      setEditingPath(null)
    } catch (error) {
      console.error('Error updating learning path:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePath = async (pathId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ruta de aprendizaje? Se eliminarán todos sus módulos y videos.')) {
      return
    }

    try {
      await deleteLearningPath(pathId)
    } catch (error) {
      console.error('Error deleting learning path:', error)
    }
  }

  // Module handlers
  const handleCreateModule = async (data: ModuleFormData) => {
    if (!selectedPathForModule) return

    setIsSubmitting(true)
    try {
      await createModule(selectedPathForModule.id, data)
      setShowCreateModuleForm(false)
      setSelectedPathForModule(null)
    } catch (error) {
      console.error('Error creating module:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateModule = async (data: ModuleFormData) => {
    if (!editingModule) return
    
    setIsSubmitting(true)
    try {
      await updateModule(editingModule.id, data)
      setEditingModule(null)
    } catch (error) {
      console.error('Error updating module:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este módulo? Se eliminarán todos sus videos.')) {
      return
    }

    try {
      await deleteModule(moduleId)
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  // Video handlers
  const handleCreateVideo = async (data: VideoFormData) => {
    if (!selectedModuleForVideo) return

    setIsSubmitting(true)
    try {
      await createVideo(selectedModuleForVideo.id, data)
      setShowCreateVideoForm(false)
      setSelectedModuleForVideo(null)
    } catch (error) {
      console.error('Error creating video:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateVideo = async (data: VideoFormData) => {
    if (!editingVideo) return
    
    setIsSubmitting(true)
    try {
      await updateVideo(editingVideo.id, data)
      setEditingVideo(null)
    } catch (error) {
      console.error('Error updating video:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este video?')) {
      return
    }

    try {
      await deleteVideo(videoId)
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  if (error) {
    return (
      <AppLayout title="Error" subtitle="Problema cargando datos">
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <p className="text-destructive">Error: {error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Recargar página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Administración de Rutas de Aprendizaje"
      subtitle="Gestionar rutas de aprendizaje, módulos y videos"
      badge={{
        text: "Admin",
        variant: "secondary",
        className: "text-xs"
      }}
    >
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <Tabs defaultValue="learning-paths" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="learning-paths" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Rutas</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Módulos</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Video className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Videos</span>
            </TabsTrigger>
          </TabsList>

          {/* Learning Paths Tab */}
          <TabsContent value="learning-paths" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary-500" />
                  Rutas de Aprendizaje
                </CardTitle>
                <CardDescription>
                  Gestionar las rutas principales de aprendizaje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowCreatePathForm(!showCreatePathForm)}
                    className="w-full md:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {showCreatePathForm ? 'Cancelar' : 'Nueva Ruta de Aprendizaje'}
                  </Button>

                  {/* Create Path Form */}
                  {showCreatePathForm && (
                    <LearningPathForm
                      onSubmit={handleCreatePath}
                      onCancel={() => setShowCreatePathForm(false)}
                      isSubmitting={isSubmitting}
                    />
                  )}

                  {/* Learning Paths List */}
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="text-center py-8">
                        <p>Cargando rutas de aprendizaje...</p>
                      </div>
                    ) : learningPaths.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No hay rutas de aprendizaje registradas</p>
                        <p className="text-xs">Crea tu primera ruta para comenzar</p>
                      </div>
                    ) : (
                      learningPaths.map((path) => (
                        <Card key={path.id} className="border-2">
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                <div className="text-xl sm:text-2xl">{path.icon}</div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                    <h3 className="font-medium text-sm sm:text-base">{path.title}</h3>
                                    <Badge 
                                      variant="outline" 
                                      className={cn("text-xs", LEVEL_COLORS[path.level])}
                                    >
                                      {path.level}
                                    </Badge>
                                    {path.isFeatured && (
                                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                                        Destacada
                                      </Badge>
                                    )}
                                    {!path.isActive && (
                                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-200">
                                        Inactiva
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{path.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {path.modules.length} módulos • {path.duration}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingPath(path)}
                                  className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeletePath(path.id)}
                                  className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => togglePathExpansion(path.id)}
                                  className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                                >
                                  <ChevronDown className={cn(
                                    "h-3 w-3 sm:h-4 sm:w-4 transition-transform",
                                    expandedPaths.has(path.id) && "rotate-180"
                                  )} />
                                </Button>
                              </div>
                            </div>
                            
                            {expandedPaths.has(path.id) && (
                              <div className="border-t pt-4 mt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-medium text-sm">Módulos ({path.modules.length})</h4>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedPathForModule(path)
                                      setShowCreateModuleForm(true)
                                    }}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Módulo
                                  </Button>
                                </div>
                                
                                {path.modules.length === 0 ? (
                                  <p className="text-xs text-muted-foreground py-2">
                                    No hay módulos en esta ruta
                                  </p>
                                ) : (
                                  <div className="space-y-2">
                                    {path.modules
                                      .sort((a, b) => a.order - b.order)
                                      .map((module) => (
                                      <div key={module.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                                        <div className="flex items-center gap-2">
                                          <BookOpen className="h-3 w-3" />
                                          <span className="font-medium">{module.title}</span>
                                          <Badge variant="outline" className="text-xs">
                                            {module.videos.length} videos
                                          </Badge>
                                          {!module.isActive && (
                                            <EyeOff className="h-3 w-3 text-muted-foreground" />
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setEditingModule(module)}
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteModule(module.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary-500" />
                  Gestión de Módulos
                </CardTitle>
                <CardDescription>
                  Administrar módulos dentro de las rutas de aprendizaje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPaths.map((path) => (
                    <Card key={path.id} className="border-l-4 border-l-secondary-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{path.icon}</span>
                            <CardTitle className="text-base">{path.title}</CardTitle>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPathForModule(path)
                              setShowCreateModuleForm(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Módulo
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {path.modules.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4">
                            No hay módulos en esta ruta
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {path.modules
                              .sort((a, b) => a.order - b.order)
                              .map((module) => (
                              <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <BookOpen className="h-4 w-4" />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{module.title}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        Orden {module.order}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {module.videos.length} videos
                                      </Badge>
                                      {!module.isActive && (
                                        <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                                          Inactivo
                                        </Badge>
                                      )}
                                    </div>
                                    {module.description && (
                                      <p className="text-sm text-muted-foreground">
                                        {module.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedModuleForVideo(module)
                                      setShowCreateVideoForm(true)
                                    }}
                                  >
                                    <Video className="h-4 w-4 mr-1" />
                                    Video
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingModule(module)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteModule(module.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-tertiary-500" />
                  Gestión de Videos
                </CardTitle>
                <CardDescription>
                  Administrar videos dentro de los módulos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPaths.map((path) =>
                    path.modules.map((module) => (
                      <Card key={module.id} className="border-l-4 border-l-tertiary-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{path.icon}</span>
                                <span className="text-sm text-muted-foreground">{path.title}</span>
                              </div>
                              <CardTitle className="text-base">{module.title}</CardTitle>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedModuleForVideo(module)
                                setShowCreateVideoForm(true)
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Nuevo Video
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {module.videos.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4">
                              No hay videos en este módulo
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {module.videos
                                .sort((a, b) => a.order - b.order)
                                .map((video) => (
                                <div key={video.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <PlayCircle className="h-4 w-4" />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{video.title}</h4>
                                        <Badge variant="outline" className="text-xs">
                                          Orden {video.order}
                                        </Badge>
                                        {video.duration && (
                                          <Badge variant="outline" className="text-xs">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {video.duration}
                                          </Badge>
                                        )}
                                        {!video.isActive && (
                                          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                                            Inactivo
                                          </Badge>
                                        )}
                                      </div>
                                      {video.description && (
                                        <p className="text-sm text-muted-foreground">
                                          {video.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(video.videoUrl, '_blank')}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingVideo(video)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteVideo(video.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Learning Path Sheet */}
      <Sheet open={!!editingPath} onOpenChange={(open) => !open && setEditingPath(null)}>
        <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editar Ruta de Aprendizaje</SheetTitle>
            <SheetDescription>
              {editingPath?.title}
            </SheetDescription>
          </SheetHeader>
          
          {editingPath && (
            <div className="py-4">
              <LearningPathForm
                learningPath={editingPath}
                onSubmit={handleUpdatePath}
                onCancel={() => setEditingPath(null)}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Module Sheet */}
      <Sheet open={showCreateModuleForm} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModuleForm(false)
          setSelectedPathForModule(null)
        }
      }}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Nuevo Módulo</SheetTitle>
            <SheetDescription>
              {selectedPathForModule?.title}
            </SheetDescription>
          </SheetHeader>
          
          {selectedPathForModule && (
            <div className="py-4">
              <ModuleForm
                learningPathTitle={selectedPathForModule.title}
                onSubmit={handleCreateModule}
                onCancel={() => {
                  setShowCreateModuleForm(false)
                  setSelectedPathForModule(null)
                }}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Module Sheet */}
      <Sheet open={!!editingModule} onOpenChange={(open) => !open && setEditingModule(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Editar Módulo</SheetTitle>
            <SheetDescription>
              {editingModule?.title}
            </SheetDescription>
          </SheetHeader>
          
          {editingModule && (
            <div className="py-4">
              <ModuleForm
                module={editingModule}
                onSubmit={handleUpdateModule}
                onCancel={() => setEditingModule(null)}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Video Sheet */}
      <Sheet open={showCreateVideoForm} onOpenChange={(open) => {
        if (!open) {
          setShowCreateVideoForm(false)
          setSelectedModuleForVideo(null)
        }
      }}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Nuevo Video</SheetTitle>
            <SheetDescription>
              {selectedModuleForVideo?.title}
            </SheetDescription>
          </SheetHeader>
          
          {selectedModuleForVideo && (
            <div className="py-4">
              <VideoForm
                moduleTitle={selectedModuleForVideo.title}
                onSubmit={handleCreateVideo}
                onCancel={() => {
                  setShowCreateVideoForm(false)
                  setSelectedModuleForVideo(null)
                }}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Video Sheet */}
      <Sheet open={!!editingVideo} onOpenChange={(open) => !open && setEditingVideo(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Editar Video</SheetTitle>
            <SheetDescription>
              {editingVideo?.title}
            </SheetDescription>
          </SheetHeader>
          
          {editingVideo && (
            <div className="py-4">
              <VideoForm
                video={editingVideo}
                onSubmit={handleUpdateVideo}
                onCancel={() => setEditingVideo(null)}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  )
}