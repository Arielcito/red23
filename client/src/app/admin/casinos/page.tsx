"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useCasinosData } from "@/lib/hooks/useCasinosData"
import type { CasinoWithFields, CasinoField } from "@/lib/supabase/types"
import { CASINO_POTENCIAL_VALUES } from "@/lib/supabase/types"
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Upload, 
  Crown,
  Table2,
  Columns3,
  AlertCircle
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function AdminCasinosPage() {
  const { 
    casinos, 
    topThree, 
    config, 
    isLoading, 
    error,
    updateCasino,
    setTopThree,
    updateTopThreeImage,
    addCustomField,
    updateCustomField,
    deleteCustomField,
    createCasino,
    deleteCasino
  } = useCasinosData()

  const [editingCasino, setEditingCasino] = useState<CasinoWithFields | null>(null)
  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "badge" | "percentage">("text")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCasinoForm, setNewCasinoForm] = useState({
    name: '',
    plataforma: '',
    tiempo: '',
    potencial_value: 'medium' as 'high' | 'medium' | 'low',
    similar: ''
  })
  const [imageUploading, setImageUploading] = useState(false)

  // Mock image upload - en producción se conectaría a un servicio real
  const handleImageUpload = async (casinoId: string, file: File) => {
    setImageUploading(true)
    try {
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockImageUrl = `/uploaded-${casinoId}-${Date.now()}.jpg`
      await updateTopThreeImage(casinoId, mockImageUrl)
      console.log('✅ Imagen subida para:', casinoId)
    } catch (err) {
      console.error('❌ Error subiendo imagen:', err)
    } finally {
      setImageUploading(false)
    }
  }

  const handleAddCustomField = async () => {
    if (!newFieldName.trim()) return
    
    try {
      await addCustomField({
        name: newFieldName,
        field_type: newFieldType,
        is_required: false,
        display_order: config.customFields.length + 1,
        is_active: true
      })
      setNewFieldName("")
      setNewFieldType("text")
    } catch (err) {
      console.error('❌ Error agregando campo:', err)
    }
  }

  const handleCreateCasino = async () => {
    if (!newCasinoForm.name.trim() || !newCasinoForm.plataforma.trim() || !newCasinoForm.tiempo.trim()) {
      console.error('❌ Faltan campos requeridos')
      return
    }

    try {
      const potencialConfig = CASINO_POTENCIAL_VALUES[newCasinoForm.potencial_value]
      
      await createCasino({
        name: newCasinoForm.name,
        plataforma: newCasinoForm.plataforma,
        tiempo: newCasinoForm.tiempo,
        potencial: potencialConfig,
        similar: newCasinoForm.similar || null,
        customFields: [],
        isTopThree: false
      })
      
      // Reset form
      setNewCasinoForm({
        name: '',
        plataforma: '',
        tiempo: '',
        potencial_value: 'medium',
        similar: ''
      })
      setShowCreateForm(false)
      
      console.log('✅ Casino creado exitosamente')
    } catch (err) {
      console.error('❌ Error creando casino:', err)
    }
  }

  const handleDeleteCasino = async (casinoId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este casino?')) {
      return
    }

    try {
      await deleteCasino(casinoId)
      console.log('✅ Casino eliminado exitosamente')
    } catch (err) {
      console.error('❌ Error eliminando casino:', err)
    }
  }

  const handleUpdateTopThree = async (casinoIds: string[]) => {
    try {
      await setTopThree(casinoIds)
    } catch (err) {
      console.error('❌ Error actualizando top 3:', err)
    }
  }

  if (error) {
    return (
      <AppLayout title="Error" subtitle="Problema cargando datos">
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
      title="Administración de Casinos"
      subtitle="Gestionar comparación y configuración"
      badge={{
        text: "Admin",
        variant: "secondary",
        className: "text-xs"
      }}
    >
      <div className="p-6 space-y-6">
        <Tabs defaultValue="top-three" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="top-three" className="gap-2">
              <Crown className="h-4 w-4" />
              Top 3
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <Table2 className="h-4 w-4" />
              Tabla
            </TabsTrigger>
            <TabsTrigger value="fields" className="gap-2">
              <Columns3 className="h-4 w-4" />
              Campos
            </TabsTrigger>
            <TabsTrigger value="casinos" className="gap-2">
              <Settings className="h-4 w-4" />
              Casinos
            </TabsTrigger>
          </TabsList>

          {/* Top 3 Management */}
          <TabsContent value="top-three" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Gestión Top 3
                </CardTitle>
                <CardDescription>
                  Administrar imágenes y orden de los 3 mejores casinos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {topThree.map((casino, index) => (
                  <div key={casino.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br",
                      index === 0 ? "from-yellow-400 to-yellow-600" :
                      index === 1 ? "from-gray-300 to-gray-500" : 
                      "from-orange-400 to-orange-600"
                    )}>
                      #{index + 1}
                    </div>
                    
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={casino.imageUrl}
                        alt={casino.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-casino.jpg'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{casino.name}</h3>
                      <p className="text-sm text-muted-foreground">{casino.plataforma}</p>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "text-xs mt-1",
                          casino.potencial.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                          casino.potencial.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        )}
                      >
                        {casino.potencial.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        className="w-40"
                        disabled={imageUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            await handleImageUpload(casino.id, file)
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={imageUploading}
                        className="w-40"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {imageUploading ? "Subiendo..." : "Cambiar imagen"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Table Data Management */}
          <TabsContent value="table" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Casinos en Tabla Comparativa</CardTitle>
                <CardDescription>
                  Gestionar casinos que aparecen en la tabla de comparación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {casinos.filter(c => !c.isTopThree).map((casino) => (
                    <div key={casino.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-sm font-bold">
                            {casino.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{casino.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {casino.plataforma} • {casino.tiempo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-xs",
                            casino.potencial.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                            casino.potencial.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          )}
                        >
                          {casino.potencial.label}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Fields Management */}
          <TabsContent value="fields" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campos Personalizados</CardTitle>
                <CardDescription>
                  Agregar y configurar campos dinámicos para la tabla
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add new field */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-2 border-dashed rounded-lg">
                  <div>
                    <Label htmlFor="field-name">Nombre del campo</Label>
                    <Input
                      id="field-name"
                      placeholder="Ej: Bonos, Rating..."
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="field-type">Tipo</Label>
                    <Select value={newFieldType} onValueChange={(value: any) => setNewFieldType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="badge">Badge</SelectItem>
                        <SelectItem value="percentage">Porcentaje</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <Button 
                      onClick={handleAddCustomField}
                      disabled={!newFieldName.trim()}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Campo
                    </Button>
                  </div>
                </div>

                {/* Existing fields */}
                <div className="space-y-3">
                  {config.customFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{field.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          Tipo: {field.field_type} • Orden: {field.display_order}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteCustomField(field.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Casino Management */}
          <TabsContent value="casinos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Casinos</CardTitle>
                <CardDescription>
                  Crear, editar y administrar todos los casinos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full md:w-auto"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {showCreateForm ? 'Cancelar' : 'Agregar Nuevo Casino'}
                  </Button>
                  
                  {/* Formulario de creación */}
                  {showCreateForm && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Crear Nuevo Casino</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="casino-name">Nombre del Casino</Label>
                            <Input
                              id="casino-name"
                              placeholder="Ej: Casino Royal"
                              value={newCasinoForm.name}
                              onChange={(e) => setNewCasinoForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="casino-plataforma">Plataforma</Label>
                            <Input
                              id="casino-plataforma"
                              placeholder="Ej: Web/Mobile"
                              value={newCasinoForm.plataforma}
                              onChange={(e) => setNewCasinoForm(prev => ({ ...prev, plataforma: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="casino-tiempo">Tiempo de Implementación</Label>
                            <Input
                              id="casino-tiempo"
                              placeholder="Ej: 2-4 semanas"
                              value={newCasinoForm.tiempo}
                              onChange={(e) => setNewCasinoForm(prev => ({ ...prev, tiempo: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="casino-potencial">Potencial</Label>
                            <Select 
                              value={newCasinoForm.potencial_value} 
                              onValueChange={(value: 'high' | 'medium' | 'low') => 
                                setNewCasinoForm(prev => ({ ...prev, potencial_value: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">Alto</SelectItem>
                                <SelectItem value="medium">Medio</SelectItem>
                                <SelectItem value="low">Bajo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="casino-similar">Casinos Similares</Label>
                            <Input
                              id="casino-similar"
                              placeholder="Ej: Bet365, 888casino"
                              value={newCasinoForm.similar}
                              onChange={(e) => setNewCasinoForm(prev => ({ ...prev, similar: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleCreateCasino}>
                            <Save className="h-4 w-4 mr-2" />
                            Crear Casino
                          </Button>
                          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Lista de casinos existentes */}
                  <div className="space-y-3">
                    {casinos.map((casino) => (
                      <div key={casino.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-sm font-bold">
                              {casino.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{casino.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {casino.plataforma} • {casino.tiempo}
                            </p>
                            {casino.isTopThree && (
                              <Badge variant="outline" className="text-xs mt-1">
                                <Crown className="h-3 w-3 mr-1" />
                                Top #{casino.topThreePosition}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            className={cn(
                              "text-xs",
                              casino.potencial.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                              casino.potencial.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            )}
                          >
                            {casino.potencial.label}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCasino(casino.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {casinos.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">No hay casinos registrados</p>
                      <p className="text-xs">Crea tu primer casino para comenzar</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}