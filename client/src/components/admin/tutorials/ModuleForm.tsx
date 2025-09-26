"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, X } from "lucide-react"
import type { ModuleFormData, TutorialModule } from "@/lib/types/tutorials"
import { DEFAULT_MODULE_FORM } from "@/lib/types/tutorials"

interface ModuleFormProps {
  module?: TutorialModule | null
  learningPathTitle?: string
  onSubmit: (data: ModuleFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ModuleForm({ 
  module, 
  learningPathTitle, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: ModuleFormProps) {
  const [formData, setFormData] = useState<ModuleFormData>(() => {
    if (module) {
      return {
        title: module.title,
        description: module.description,
        order: module.order,
        isActive: module.isActive
      }
    }
    return DEFAULT_MODULE_FORM
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }
    if (formData.order < 1) {
      newErrors.order = 'El orden debe ser mayor a 0'
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
      console.error('Error submitting module form:', error)
    }
  }

  const updateField = <K extends keyof ModuleFormData>(
    field: K,
    value: ModuleFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {module ? 'Editar Módulo' : 'Nuevo Módulo'}
        </CardTitle>
        {learningPathTitle && (
          <p className="text-sm text-muted-foreground">
            Ruta: {learningPathTitle}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <Label htmlFor="module-title">Título del Módulo *</Label>
            <Input
              id="module-title"
              placeholder="Ej: Introducción al Marketing Digital"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="module-description">Descripción (opcional)</Label>
            <Textarea
              id="module-description"
              placeholder="Descripción del contenido del módulo..."
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value || null)}
              rows={3}
            />
          </div>

          {/* Orden */}
          <div>
            <Label htmlFor="module-order">Orden *</Label>
            <Input
              id="module-order"
              type="number"
              min="1"
              placeholder="1"
              value={formData.order}
              onChange={(e) => updateField('order', parseInt(e.target.value) || 1)}
              className={errors.order ? 'border-red-500' : ''}
            />
            {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Los módulos se ordenarán según este número
            </p>
          </div>

          {/* Estado activo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="module-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => updateField('isActive', checked)}
            />
            <Label htmlFor="module-active">Módulo Activo</Label>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : module ? 'Actualizar' : 'Crear'}
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