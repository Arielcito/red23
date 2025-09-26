"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronDown, ChevronRight, PlayCircle, Clock, Video } from "lucide-react"
import { cn } from "@/lib/utils"
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
    <Card className="border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors">
      <CardHeader 
        className="cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                Módulo {moduleNumber}: {module.title}
              </CardTitle>
              {module.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {module.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Video className="h-3 w-3 mr-1" />
                  {totalVideos} video{totalVideos !== 1 ? 's' : ''}
                </Badge>
                {totalDuration > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(totalDuration)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
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
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            {module.videos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No hay videos en este módulo</p>
              </div>
            ) : (
              <div className="space-y-3">
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