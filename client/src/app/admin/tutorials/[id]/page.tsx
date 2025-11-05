"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  Video,
  AlertCircle,
  Plus,
  Eye,
  EyeOff,
  PlayCircle,
  ExternalLink,
  Clock,
  Save
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LearningPathDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const {
    learningPaths,
    isLoading,
    error,
    updateLearningPath,
    deleteLearningPath,
    createModule,
    updateModule,
    deleteModule,
    createVideo,
    updateVideo,
    deleteVideo
  } = useTutorialsAdmin()

  const [learningPath, setLearningPath] = useState<LearningPathWithContent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingModule, setEditingModule] = useState<TutorialModule | null>(null)
  const [showCreateModuleForm, setShowCreateModuleForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<TutorialVideo | null>(null)
  const [showCreateVideoForm, setShowCreateVideoForm] = useState(false)
  const [selectedModuleForVideo, setSelectedModuleForVideo] = useState<TutorialModule | null>(null)

  // Find the learning path from the list
  useEffect(() => {
    if (learningPaths.length > 0) {
      const foundPath = learningPaths.find(path => path.id === params.id)
      setLearningPath(foundPath || null)
    }
  }, [learningPaths, params.id])

  // Handlers
  const handleUpdatePath = async (data: LearningPathFormData) => {
    if (!learningPath) return

    setIsSubmitting(true)
    try {
      await updateLearningPath(learningPath.id, data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating learning path:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePath = async () => {
    if (!learningPath) return
    if (!confirm('¿Estás seguro de que quieres eliminar esta ruta de aprendizaje? Se eliminarán todos sus módulos y videos.')) {
      return
    }

    try {
      await deleteLearningPath(learningPath.id)
      router.push('/admin/tutorials')
    } catch (error) {
      console.error('Error deleting learning path:', error)
    }
  }

  const handleCreateModule = async (data: ModuleFormData) => {
    if (!learningPath) return

    setIsSubmitting(true)
    try {
      await createModule(learningPath.id, data)
      setShowCreateModuleForm(false)
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

  if (isLoading) {
    return (
      <AppLayout title="Cargando..." subtitle="Ruta de Aprendizaje">
        <div className="p-6">
          <div className="text-center py-12">
            <p>Cargando ruta de aprendizaje...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout title="Error" subtitle="Problema cargando datos">
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>Error: {error}</p>
              </div>
            </CardContent>
          </Card>
          <Button
            variant="outline"
            onClick={() => router.push('/admin/tutorials')}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </AppLayout>
    )
  }

  if (!learningPath) {
    return (
      <AppLayout title="No encontrada" subtitle="Ruta de Aprendizaje">
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <AlertCircle className="h-5 w-5" />
                <p>No se encontró la ruta de aprendizaje solicitada.</p>
              </div>
            </CardContent>
          </Card>
          <Button
            variant="outline"
            onClick={() => router.push('/admin/tutorials')}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Rutas
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title={learningPath.title}
      subtitle="Gestión de Ruta de Aprendizaje"
      badge={{
        text: learningPath.level,
        variant: "secondary",
        className: "text-xs"
      }}
    >
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/tutorials')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Rutas
          </Button>

          <div className="flex gap-2">
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Ruta
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePath}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Form or Details */}
        {isEditing ? (
          <LearningPathForm
            learningPath={learningPath}
            onSubmit={handleUpdatePath}
            onCancel={() => setIsEditing(false)}
            isSubmitting={isSubmitting}
          />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{learningPath.icon}</div>
                <div>
                  <CardTitle>{learningPath.title}</CardTitle>
                  <CardDescription>{learningPath.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nivel</p>
                  <Badge variant="outline" className={cn("mt-1", LEVEL_COLORS[learningPath.level])}>
                    {learningPath.level}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duración</p>
                  <p className="text-sm mt-1">{learningPath.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Número de Cursos</p>
                  <p className="text-sm mt-1">{learningPath.courseCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <div className="flex gap-2 mt-1">
                    {learningPath.isFeatured && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Destacada
                      </Badge>
                    )}
                    <Badge variant="outline" className={learningPath.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
                      {learningPath.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Modules and Videos */}
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="modules" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Módulos ({learningPath.modules.length})</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Video className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Videos</span>
            </TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Módulos</h3>
              <Button
                onClick={() => setShowCreateModuleForm(!showCreateModuleForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showCreateModuleForm ? 'Cancelar' : 'Nuevo Módulo'}
              </Button>
            </div>

            {showCreateModuleForm && (
              <Card>
                <CardContent className="pt-6">
                  <ModuleForm
                    learningPathTitle={learningPath.title}
                    onSubmit={handleCreateModule}
                    onCancel={() => setShowCreateModuleForm(false)}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
              </Card>
            )}

            {editingModule && (
              <Card>
                <CardHeader>
                  <CardTitle>Editar Módulo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ModuleForm
                    module={editingModule}
                    onSubmit={handleUpdateModule}
                    onCancel={() => setEditingModule(null)}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
              </Card>
            )}

            {learningPath.modules.length === 0 && !showCreateModuleForm ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay módulos en esta ruta</p>
                  <p className="text-sm text-muted-foreground">Crea el primer módulo para comenzar</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {learningPath.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module) => (
                  <Card key={module.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5" />
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
                              <p className="text-sm text-muted-foreground mt-1">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            <h3 className="text-lg font-semibold">Videos por Módulo</h3>

            {showCreateVideoForm && selectedModuleForVideo && (
              <Card>
                <CardHeader>
                  <CardTitle>Nuevo Video - {selectedModuleForVideo.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoForm
                    moduleTitle={selectedModuleForVideo.title}
                    onSubmit={handleCreateVideo}
                    onCancel={() => {
                      setShowCreateVideoForm(false)
                      setSelectedModuleForVideo(null)
                    }}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
              </Card>
            )}

            {editingVideo && (
              <Card>
                <CardHeader>
                  <CardTitle>Editar Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoForm
                    video={editingVideo}
                    onSubmit={handleUpdateVideo}
                    onCancel={() => setEditingVideo(null)}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
              </Card>
            )}

            {learningPath.modules.every(m => m.videos.length === 0) ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <PlayCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No hay videos en esta ruta</p>
                  <p className="text-sm text-muted-foreground">Crea módulos y agrega videos a cada uno</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {learningPath.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{module.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {module.videos.length} videos
                        </Badge>
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
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
