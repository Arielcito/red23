"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminPrompts } from "@/lib/hooks/useAdminPrompts"
import type { AutomaticPrompt } from "@/lib/supabase/types"
import { 
  MessageCircle,
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  GripVertical,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminPromptsPage() {
  const { 
    prompts, 
    isLoading, 
    error,
    createPrompt,
    updatePrompt,
    deletePrompt,
    reorderPrompts
  } = useAdminPrompts()

  const [editingPrompt, setEditingPrompt] = useState<AutomaticPrompt | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    is_active: true
  })

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "general", 
      is_active: true
    })
    setEditingPrompt(null)
    setIsCreating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingPrompt) {
        await updatePrompt(editingPrompt.id, formData)
      } else {
        await createPrompt(formData)
      }
      resetForm()
    } catch (err) {
      console.error('❌ Error saving prompt:', err)
    }
  }

  const handleEdit = (prompt: AutomaticPrompt) => {
    setFormData({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      is_active: prompt.is_active
    })
    setEditingPrompt(prompt)
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este prompt?')) {
      await deletePrompt(id)
    }
  }

  const handleToggleActive = async (prompt: AutomaticPrompt) => {
    await updatePrompt(prompt.id, {
      ...prompt,
      is_active: !prompt.is_active
    })
  }

  if (error) {
    return (
      <AppLayout title="Error" subtitle="Problema cargando prompts">
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <p className="text-destructive">Error: {error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Recargar página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Administración de Prompts"
      subtitle="Gestionar prompts automáticos del chat"
      badge={{
        text: "Admin",
        variant: "secondary",
        className: "text-xs"
      }}
    >
      <div className="p-6 space-y-6">
        {/* Create/Edit Form */}
        {(isCreating || editingPrompt) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {editingPrompt ? 'Editar Prompt' : 'Crear Nuevo Prompt'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Ej: Banner promocional..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="bonos">Bonos</SelectItem>
                        <SelectItem value="jackpots">Jackpots</SelectItem>
                        <SelectItem value="eventos">Eventos</SelectItem>
                        <SelectItem value="slots">Slots</SelectItem>
                        <SelectItem value="blackjack">Blackjack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="content">Contenido del Prompt</Label>
                  <Textarea
                    id="content"
                    placeholder="Describe el prompt que aparecerá en el chat..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="active">Prompt activo</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingPrompt ? 'Actualizar' : 'Crear'} Prompt
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Prompts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Prompts Automáticos ({prompts.length})
              </span>
              {!isCreating && !editingPrompt && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Prompt
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Administra los prompts que aparecen como sugerencias en el chat
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando prompts...</p>
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No hay prompts creados</p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer prompt
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium truncate">{prompt.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {prompt.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {prompt.category}
                            </Badge>
                            <Badge 
                              variant={prompt.is_active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {prompt.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Switch
                            checked={prompt.is_active}
                            onCheckedChange={() => handleToggleActive(prompt)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(prompt)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(prompt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}