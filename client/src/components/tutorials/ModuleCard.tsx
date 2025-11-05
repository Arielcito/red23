"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronDown, ChevronRight, Clock, Video } from "lucide-react"
import type { TutorialModuleFormatted } from "@/lib/supabase/types"
import { VideoCard } from "./VideoCard"

interface ModuleCardProps {
  module: TutorialModuleFormatted
  moduleNumber: number
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function ModuleCard({ 
  module, 
  moduleNumber, 
  isExpanded = false, 
  onToggleExpand 
}: ModuleCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  
  const expanded = onToggleExpand !== undefined ? isExpanded : internalExpanded
  const toggleExpand = onToggleExpand || (() => setInternalExpanded(!internalExpanded))

  const totalVideos = module.videos.length
  const totalDuration = module.videos.reduce((total, video) => {
    if (video.duration) {
      // Parse duration like "15:30" or "1:15:30"
      const parts = video.duration.split(':')
      const minutes = parts.length === 2 ? 
        parseInt(parts[0]) + parseInt(parts[1]) / 60 :
        parseInt(parts[0]) * 60 + parseInt(parts[1]) + parseInt(parts[2]) / 60
      return total + minutes
    }
    return total
  }, 0)

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.round(minutes % 60)
    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <Card className="border border-solid border-gray-200 hover:border-primary-300 transition-colors bg-gray-50 dark:bg-transparent">
      <CardHeader 
        className="cursor-pointer p-4 sm:p-6"
        onClick={toggleExpand}
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg leading-tight break-words">
                <span className="text-muted-foreground text-xs sm:text-sm">Módulo {moduleNumber}:</span>{' '}
                {module.title}
              </CardTitle>
              {module.description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 break-words">
                  {module.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-2">
                <Badge variant="outline" className="text-xs shrink-0">
                  <Video className="h-3 w-3 mr-1" />
                  {totalVideos} video{totalVideos !== 1 ? 's' : ''}
                </Badge>
                {totalDuration > 0 && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(totalDuration)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 p-4 sm:p-6">
          <div className="border-t pt-3 sm:pt-4">
            {module.videos.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <Video className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs sm:text-sm">No hay videos en este módulo</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {module.videos
                  .sort((a, b) => a.order - b.order)
                  .map((video, index) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      videoNumber={index + 1}
                    />
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}