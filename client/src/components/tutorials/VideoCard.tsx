"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, Clock, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TutorialVideoFormatted } from "@/lib/supabase/types"

interface VideoCardProps {
  video: TutorialVideoFormatted
  videoNumber: number
  className?: string
}

export function VideoCard({ video, videoNumber, className }: VideoCardProps) {
  const handleWatchVideo = () => {
    window.open(video.videoUrl, '_blank', 'noopener,noreferrer')
  }

  const getVideoThumbnail = (url: string) => {
    // Extract YouTube video ID and create thumbnail URL
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`
    }
    
    // For other video services, use a placeholder
    return '/placeholder-video.jpg'
  }

  const isYouTubeVideo = video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')

  return (
    <Card className={cn("group hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Video Thumbnail */}
          <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
            {isYouTubeVideo ? (
              <img
                src={getVideoThumbnail(video.videoUrl)}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-video.jpg'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlayCircle className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors flex items-center justify-center">
              <PlayCircle className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight">
                  {videoNumber}. {video.title}
                </h4>
                {video.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {video.duration && (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Video {videoNumber}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWatchVideo}
                  className="text-xs"
                >
                  <PlayCircle className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWatchVideo}
                  className="p-2"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}