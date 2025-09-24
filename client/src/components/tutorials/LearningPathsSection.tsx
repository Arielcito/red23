"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Award, TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LearningPathFormatted } from "@/lib/supabase/types"

interface LearningPathsSectionProps {
  learningPaths: LearningPathFormatted[]
  title?: string
  subtitle?: string
  showHeader?: boolean
  className?: string
  maxPaths?: number
  gridCols?: 'auto' | 2 | 3 | 4
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

const getLevelColorClasses = (colorScheme: string) => {
  switch (colorScheme) {
    case 'primary':
      return {
        badge: 'text-primary-600 border-primary-300',
        border: 'border-primary-200 hover:border-primary-400',
        icon: 'text-primary-500'
      }
    case 'secondary':
      return {
        badge: 'text-secondary-600 border-secondary-300',
        border: 'border-secondary-200 hover:border-secondary-400',
        icon: 'text-secondary-500'
      }
    case 'tertiary':
      return {
        badge: 'text-tertiary-600 border-tertiary-300',
        border: 'border-tertiary-200 hover:border-tertiary-400',
        icon: 'text-tertiary-500'
      }
    default:
      return {
        badge: 'text-primary-600 border-primary-300',
        border: 'border-primary-200 hover:border-primary-400',
        icon: 'text-primary-500'
      }
  }
}

export function LearningPathsSection({
  learningPaths,
  title = "Rutas de Aprendizaje",
  subtitle = "Elige tu camino y accede a cursos organizados por nivel",
  showHeader = true,
  className,
  maxPaths = 3,
  gridCols = 'auto'
}: LearningPathsSectionProps) {
  if (!learningPaths || learningPaths.length === 0) {
    return (
      <section className={cn("py-8", className)}>
        {showHeader && (
          <div className="container mx-auto px-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-8 w-8 text-primary-500" />
                <h2 className="text-3xl font-bold">{title}</h2>
              </div>
              <p className="text-muted-foreground">
                {subtitle}
              </p>
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No hay rutas de aprendizaje configuradas</p>
              </div>
            </div>
          </div>
        )}
      </section>
    )
  }

  const displayedPaths = learningPaths.slice(0, maxPaths)

  const getGridClasses = () => {
    if (gridCols === 'auto') {
      return displayedPaths.length === 1 
        ? 'grid-cols-1' 
        : displayedPaths.length === 2 
        ? 'grid-cols-1 md:grid-cols-2' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
    return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(gridCols, displayedPaths.length)}`
  }

  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-6">
        {showHeader && (
          <div className="text-center space-y-4 pb-8">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-8 w-8 text-primary-500" />
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        )}

        <div className={cn("grid gap-4 max-w-6xl mx-auto", getGridClasses())}>
          {displayedPaths.map((path) => {
            const IconComponent = getLevelIcon(path.level)
            const colorClasses = getLevelColorClasses(path.colorScheme)
            
            return (
              <Link key={path.id} href={path.href}>
                <Card className={cn(
                  "p-4 border-2 border-dashed transition-colors cursor-pointer h-full hover:shadow-md",
                  colorClasses.border
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={colorClasses.badge}>
                      {path.level}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{path.icon}</span>
                      <IconComponent className={cn("h-5 w-5", colorClasses.icon)} />
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    {path.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {path.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {path.duration}
                    </span>
                    <Button size="sm" variant="outline">
                      Ver Ruta
                    </Button>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
