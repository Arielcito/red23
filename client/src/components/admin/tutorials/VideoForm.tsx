"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, X, ExternalLink } from "lucide-react"
import type { VideoFormData, TutorialVideo } from "@/lib/types/tutorials"
import { DEFAULT_VIDEO_FORM } from "@/lib/types/tutorials"

interface VideoFormProps {
  video?: TutorialVideo | null
  moduleTitle?: string
  onSubmit: (data: VideoFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function VideoForm({ 
  video, 
  moduleTitle, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: VideoFormProps) {
  const [formData, setFormData] = useState<VideoFormData>(() => {
    if (video) {
      return {
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        duration: video.duration,
        order: video.order,
        isActive: video.isActive
      }
    }
    return DEFAULT_VIDEO_FORM
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }
    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'La URL del video es requerida'
    } else if (!isValidVideoUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'La URL del video no es válida'
    }
    if (formData.order < 1) {
      newErrors.order = 'El orden debe ser mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidVideoUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      // Acepta URLs de YouTube, Vimeo, y otros dominios comunes de video
      const validDomains = [
        'youtube.com', 'www.youtube.com', 'youtu.be',
        'vimeo.com', 'www.vimeo.com',
        'wistia.com', 'fast.wistia.net',
        'loom.com', 'www.loom.com'
      ]
      return validDomains.some(domain => urlObj.hostname.includes(domain)) || 
             urlObj.protocol === 'https:' // Para otros dominios HTTPS
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting video form:', error)
    }
  }

  const updateField = <K extends keyof VideoFormData>(
    field: K,
    value: VideoFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatDuration = (input: string): string => {
    // Auto-format duration as mm:ss
    const numbers = input.replace(/\D/g, '')
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, -2)}:${numbers.slice(-2)}`
    } else {
      return `${numbers.slice(0, -4)}:${numbers.slice(-4, -2)}:${numbers.slice(-2)}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {video ? 'Editar Video' : 'Nuevo Video'}
        </CardTitle>
        {moduleTitle && (
          <p className="text-sm text-muted-foreground">
            Módulo: {moduleTitle}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <Label htmlFor="video-title">Título del Video *</Label>
            <Input
              id="video-title"
              placeholder="Ej: ¿Qué es el Marketing Digital?"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="video-description">Descripción (opcional)</Label>
            <Textarea
              id="video-description"
              placeholder="Descripción del contenido del video..."
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value || null)}
              rows={3}
            />
          </div>

          {/* URL del Video */}
          <div>
            <Label htmlFor="video-url">URL del Video *</Label>
            <div className="flex gap-2">
              <Input
                id="video-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) => updateField('videoUrl', e.target.value)}
                className={errors.videoUrl ? 'border-red-500' : ''}
              />
              {formData.videoUrl && isValidVideoUrl(formData.videoUrl) && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(formData.videoUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Soporta YouTube, Vimeo, Loom, Wistia y otros servicios HTTPS
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duración */}
            <div>
              <Label htmlFor="video-duration">Duración (opcional)</Label>
              <Input
                id="video-duration"
                placeholder="15:30"
                value={formData.duration || ''}
                onChange={(e) => {
                  const formatted = formatDuration(e.target.value)
                  updateField('duration', formatted || null)
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formato: mm:ss o hh:mm:ss
              </p>
            </div>

            {/* Orden */}
            <div>
              <Label htmlFor="video-order">Orden *</Label>
              <Input
                id="video-order"
                type="number"
                min="1"
                placeholder="1"
                value={formData.order}
                onChange={(e) => updateField('order', parseInt(e.target.value) || 1)}
                className={errors.order ? 'border-red-500' : ''}
              />
              {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order}</p>}
            </div>
          </div>

          {/* Estado activo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="video-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => updateField('isActive', checked)}
            />
            <Label htmlFor="video-active">Video Activo</Label>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : video ? 'Actualizar' : 'Crear'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}