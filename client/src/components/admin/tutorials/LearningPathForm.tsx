"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, X } from "lucide-react"
import type { LearningPathFormData, LearningPathWithContent } from "@/lib/types/tutorials"
import { DEFAULT_LEARNING_PATH_FORM, COLOR_SCHEME_OPTIONS } from "@/lib/types/tutorials"
import { cn } from "@/lib/utils"

interface LearningPathFormProps {
  learningPath?: LearningPathWithContent | null
  onSubmit: (data: LearningPathFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function LearningPathForm({ learningPath, onSubmit, onCancel, isSubmitting = false }: LearningPathFormProps) {
  const [formData, setFormData] = useState<LearningPathFormData>(() => {
    if (learningPath) {
      return {
        title: learningPath.title,
        description: learningPath.description,
        level: learningPath.level,
        duration: learningPath.duration,
        courseCount: learningPath.courseCount,
        icon: learningPath.icon,
        colorScheme: learningPath.colorScheme,
        slug: learningPath.slug,
        imageUrl: learningPath.imageUrl,
        isFeatured: learningPath.isFeatured,
        isActive: learningPath.isActive,
        displayOrder: learningPath.displayOrder
      }
    }
    return DEFAULT_LEARNING_PATH_FORM
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'La duración es requerida'
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es requerido'
    }
    if (formData.courseCount < 0) {
      newErrors.courseCount = 'El número de cursos debe ser mayor o igual a 0'
    }
    if (formData.displayOrder < 1) {
      newErrors.displayOrder = 'El orden debe ser mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const updateField = <K extends keyof LearningPathFormData>(
    field: K,
    value: LearningPathFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-generate slug from title
    if (field === 'title' && typeof value === 'string') {
      const newSlug = generateSlug(value)
      setFormData(prev => ({ ...prev, slug: newSlug }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {learningPath ? 'Editar Ruta de Aprendizaje' : 'Nueva Ruta de Aprendizaje'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ej: Fundamentos del Marketing Digital"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Descripción detallada de la ruta de aprendizaje..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={errors.description ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Nivel */}
            <div>
              <Label htmlFor="level">Nivel *</Label>
              <Select 
                value={formData.level} 
                onValueChange={(value: 'Principiante' | 'Intermedio' | 'Avanzado') => 
                  updateField('level', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Principiante">Cajeor</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Esquema de color */}
            <div>
              <Label htmlFor="colorScheme">Esquema de Color *</Label>
              <Select 
                value={formData.colorScheme} 
                onValueChange={(value: 'primary' | 'secondary' | 'tertiary') => 
                  updateField('colorScheme', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_SCHEME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", option.color)} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duración */}
            <div>
              <Label htmlFor="duration">Duración *</Label>
              <Input
                id="duration"
                placeholder="Ej: 4 módulos • 20 horas"
                value={formData.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>

            {/* Número de cursos */}
            <div>
              <Label htmlFor="courseCount">Número de Cursos *</Label>
              <Input
                id="courseCount"
                type="number"
                min="0"
                value={formData.courseCount}
                onChange={(e) => updateField('courseCount', parseInt(e.target.value) || 0)}
                className={errors.courseCount ? 'border-red-500' : ''}
              />
              {errors.courseCount && <p className="text-red-500 text-sm mt-1">{errors.courseCount}</p>}
            </div>

            {/* Ícono */}
            <div>
              <Label htmlFor="icon">Ícono *</Label>
              <Input
                id="icon"
                placeholder="Ej: 🎯"
                value={formData.icon}
                onChange={(e) => updateField('icon', e.target.value)}
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usa un emoji que represente la ruta
              </p>
            </div>

            {/* Orden de visualización */}
            <div>
              <Label htmlFor="displayOrder">Orden de Visualización *</Label>
              <Input
                id="displayOrder"
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) => updateField('displayOrder', parseInt(e.target.value) || 1)}
                className={errors.displayOrder ? 'border-red-500' : ''}
              />
              {errors.displayOrder && <p className="text-red-500 text-sm mt-1">{errors.displayOrder}</p>}
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                placeholder="fundamentos-marketing-digital"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className={errors.slug ? 'border-red-500' : ''}
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                Se genera automáticamente desde el título, pero puedes modificarlo
              </p>
            </div>

            {/* URL de imagen */}
            <div className="md:col-span-2">
              <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
              <Input
                id="imageUrl"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.imageUrl || ''}
                onChange={(e) => updateField('imageUrl', e.target.value || null)}
              />
            </div>

            {/* Switches */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => updateField('isFeatured', checked)}
                />
                <Label htmlFor="isFeatured">Ruta Destacada</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => updateField('isActive', checked)}
                />
                <Label htmlFor="isActive">Activa</Label>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : learningPath ? 'Actualizar' : 'Crear'}
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