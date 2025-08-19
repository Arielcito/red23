"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, X, CheckCircle } from "lucide-react"
import { useScheduledImages } from "@/lib/hooks/useScheduledImages"

export function ScheduledImagesList() {
  const { 
    scheduledImages, 
    cancelScheduledImage, 
    updateImageStatus,
    getUpcomingImages 
  } = useScheduledImages()

  const upcomingImages = getUpcomingImages()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'published':
        return 'Publicado'
      case 'failed':
        return 'Error'
      default:
        return 'Desconocido'
    }
  }

  if (scheduledImages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Imágenes Programadas</span>
          </CardTitle>
          <CardDescription>
            Aquí aparecerán las imágenes que programes para WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">No hay imágenes programadas</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Imágenes Programadas</span>
          </div>
          <Badge variant="secondary">
            {scheduledImages.length} total
          </Badge>
        </CardTitle>
        <CardDescription>
          {upcomingImages.length} próximas publicaciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {scheduledImages
            .sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.time}`)
              const dateB = new Date(`${b.date}T${b.time}`)
              return dateA.getTime() - dateB.getTime()
            })
            .map((image) => (
              <div
                key={image.id}
                className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={image.imageUrl}
                    alt={image.imageTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{image.imageTitle}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(image.date)}</span>
                    <Clock className="h-3 w-3" />
                    <span>{image.time}</span>
                  </div>
                  {image.caption && (
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {image.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(image.status)}`}
                  >
                    {getStatusText(image.status)}
                  </Badge>
                  
                  {image.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => cancelScheduledImage(image.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {image.status === 'failed' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateImageStatus(image.id, 'pending')}
                      className="h-8 w-8 p-0 text-green-500 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}