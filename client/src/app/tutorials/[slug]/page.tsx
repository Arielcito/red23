"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Target, Award, TrendingUp, BookOpen, Video, Clock, Users, Star } from "lucide-react"
import { useLearningPath } from "@/lib/hooks/useLearningPath"
import { ModuleCard } from "@/components/tutorials/ModuleCard"
import { LearningPathBreadcrumb } from "@/components/tutorials/LearningPathBreadcrumb"
import { cn } from "@/lib/utils"
import { LEVEL_COLORS } from "@/lib/types/tutorials"

export default function LearningPathPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const { learningPath, isLoading, error } = useLearningPath(slug)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const expandAllModules = () => {
    if (learningPath) {
      setExpandedModules(new Set(learningPath.modules.map(m => m.id)))
    }
  }

  const collapseAllModules = () => {
    setExpandedModules(new Set())
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Principiante':
        return Award
      case 'Intermedio':
        return TrendingUp
      case 'Avanzado':
        return Target
      default:
        return Award
    }
  }

  const getTotalVideos = () => {
    if (!learningPath) return 0
    return learningPath.modules.reduce((total, module) => total + module.videos.length, 0)
  }

  const getTotalDuration = () => {
    if (!learningPath) return 0
    return learningPath.modules.reduce((total, module) => {
      return total + module.videos.reduce((moduleTotal, video) => {
        if (video.duration) {
          const parts = video.duration.split(':')
          const minutes = parts.length === 2 ? 
            parseInt(parts[0]) + parseInt(parts[1]) / 60 :
            parseInt(parts[0]) * 60 + parseInt(parts[1]) + parseInt(parts[2]) / 60
          return moduleTotal + minutes
        }
        return moduleTotal
      }, 0)
    }, 0)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} minutos`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.round(minutes % 60)
    if (hours === 1) {
      return `${hours} hora ${remainingMinutes > 0 ? `y ${remainingMinutes} minutos` : ''}`
    }
    return `${hours} horas ${remainingMinutes > 0 ? `y ${remainingMinutes} minutos` : ''}`
  }

  if (isLoading) {
    return (
      <AppLayout title="Cargando..." subtitle="Obteniendo información de la ruta">
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-4 sm:mb-6 w-2/3"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-3 sm:mb-4">
                  <div className="h-5 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error || !learningPath) {
    return (
      <AppLayout title="Error" subtitle="Problema cargando la ruta">
        <div className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center space-y-3 sm:space-y-4">
                  <Target className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto" />
                  <h2 className="text-lg sm:text-xl font-semibold">Ruta no encontrada</h2>
                  <p className="text-sm sm:text-base text-muted-foreground px-2">
                    {error || 'La ruta de aprendizaje que buscas no existe o no está disponible.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" onClick={() => router.back()} className="text-sm sm:text-base">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver
                    </Button>
                    <Button onClick={() => router.push('/tutorials')} className="text-sm sm:text-base">
                      Ver todas las rutas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    )
  }

  const LevelIcon = getLevelIcon(learningPath.level)
  const totalVideos = getTotalVideos()
  const totalDuration = getTotalDuration()

  return (
    <AppLayout
      title={learningPath.title}
      subtitle={learningPath.description}
      badge={{
        text: learningPath.level,
        variant: "default",
        className: cn("text-xs", LEVEL_COLORS[learningPath.level])
      }}
    >
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Navigation */}
          <LearningPathBreadcrumb pathTitle={learningPath.title} />

          {/* Header Card */}
          <Card className="border-2 border-solid border-primary-200 bg-gradient-to-r">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="text-3xl sm:text-4xl flex-shrink-0">
                  {learningPath.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold break-words">{learningPath.title}</h1>
                    <Badge variant="outline" className={cn("text-xs shrink-0", LEVEL_COLORS[learningPath.level])}>
                      <LevelIcon className="h-3 w-3 mr-1" />
                      {learningPath.level}
                    </Badge>
                    {learningPath.isFeatured && (
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200 shrink-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Destacada
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 break-words">
                    {learningPath.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-500 flex-shrink-0" />
                      <span className="truncate">{learningPath.modules.length} módulos</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                      <span className="truncate">{totalVideos} videos</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-tertiary-500 flex-shrink-0" />
                      <span className="truncate">{formatDuration(totalDuration)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">Estudiantes activos</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress and Actions */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold">Progreso del curso</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">0% completado</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={expandAllModules}
                    className="text-xs sm:text-sm flex-1 sm:flex-initial"
                  >
                    Expandir todo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={collapseAllModules}
                    className="text-xs sm:text-sm flex-1 sm:flex-initial"
                  >
                    Contraer todo
                  </Button>
                </div>
              </div>
              <Progress value={0} className="h-2" />
            </CardContent>
          </Card>

          {/* Modules List */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold">Contenido del curso</h2>
              <Badge variant="secondary" className="text-xs w-fit">
                {learningPath.modules.length} módulos • {totalVideos} videos
              </Badge>
            </div>

            {learningPath.modules.length === 0 ? (
              <Card>
                <CardContent className="p-6 sm:p-12">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-base sm:text-lg font-semibold">Contenido próximamente</h3>
                    <p className="text-sm sm:text-base text-muted-foreground px-2">
                      Esta ruta de aprendizaje está en construcción. Los módulos y videos estarán disponibles pronto.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {learningPath.modules
                  .sort((a, b) => a.order - b.order)
                  .map((module, index) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      moduleNumber={index + 1}
                      isExpanded={expandedModules.has(module.id)}
                      onToggleExpand={() => toggleModule(module.id)}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}