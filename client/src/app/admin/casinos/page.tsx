"use client"

import { useState, useEffect } from "react"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useCasinosData } from "@/lib/hooks/useCasinosData"
import type { CasinoWithFields, NewsFormatted } from "@/lib/supabase/types"
import { CASINO_PRECIO_VALUES } from "@/lib/supabase/types"
import { NewsService } from "@/lib/services/newsService"
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Crown,
  AlertCircle,
  Newspaper,
  Star,
  Eye,
  EyeOff,
  ArrowUpDown,
  GripVertical
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/lib/hooks/useNotifications"
import { uploadImage, validateImageFile, replaceImage } from "@/lib/services/imageService"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const getCasinoInitial = (name?: string | null) => {
  if (!name) return "?"
  const initial = name.trim().charAt(0)
  return initial ? initial.toUpperCase() : "?"
}

interface SortableCasinoItemProps {
  casino: CasinoWithFields
  onEdit: (casino: CasinoWithFields) => void
  onDelete: (casinoId: string) => void
  isDragging?: boolean
}

function SortableCasinoItem({ casino, onEdit, onDelete, isDragging }: SortableCasinoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: itemIsDragging,
  } = useSortable({ id: casino.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: itemIsDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-background transition-all duration-200 gap-3",
        itemIsDragging && "shadow-lg z-50 ring-2 ring-primary/20 scale-105"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className={cn(
              "cursor-grab active:cursor-grabbing p-1 rounded transition-all duration-200",
              "hover:bg-muted hover:text-primary hover:scale-110",
              itemIsDragging && "cursor-grabbing scale-110"
            )}
            title="Arrastrar para reordenar"
          >
            <GripVertical className={cn(
              "h-4 w-4 transition-colors",
              itemIsDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">
              {casino.position || "?"}
            </span>
          </div>
        </div>

        <div className="relative w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          {casino.logo ? (
            <Image
              src={casino.logo}
              alt={casino.casinoName}
              fill
              className="object-contain p-1"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<span class="text-sm font-bold">${getCasinoInitial(casino.casinoName)}</span>`
                }
              }}
            />
          ) : (
            <span className="text-sm font-bold">
              {getCasinoInitial(casino.casinoName)}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-medium">{casino.casinoName}</h3>
          <p className="text-sm text-muted-foreground">
            Antigüedad: {casino.antiguedad} • RTP: {casino.rtp}%
          </p>
          {casino.position && (
            <Badge variant="outline" className="text-xs mt-1">
              <Crown className="h-3 w-3 mr-1" />
              Posición #{casino.position}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            casino.precio === 'muy barato' ? 'bg-green-100 text-green-800 border-green-200' :
            casino.precio === 'barato' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
            'bg-red-100 text-red-800 border-red-200'
          )}
        >
          {CASINO_PRECIO_VALUES[casino.precio].label}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(casino)}
          className="h-8 w-8 sm:h-9 sm:w-9 p-0"
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(casino.id)}
          className="h-8 w-8 sm:h-9 sm:w-9 p-0"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function AdminCasinosPage() {
  const {
    casinos,
    topThree,
    isLoading,
    error,
    updateCasino,
    createCasino,
    deleteCasino,
    reorderCasinos,
    revertCasinoReorder
  } = useCasinosData()

  const [editingCasino, setEditingCasino] = useState<CasinoWithFields | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({})
  const [editCoverImageFile, setEditCoverImageFile] = useState<File | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [newCasinoForm, setNewCasinoForm] = useState({
    casinoName: '',
    antiguedad: '',
    precio: 'medio' as 'medio' | 'barato' | 'muy barato',
    rtp: 0,
    platSimilar: '',
    position: null as number | null,
    coverImageFile: null as File | null,
    isRegulated: false
  })
  
  // News management state
  const [news, setNews] = useState<NewsFormatted[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [showCreateNewsForm, setShowCreateNewsForm] = useState(false)
  const [newNewsForm, setNewNewsForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageFile: null as File | null,
    author: 'Admin',
    category: 'general',
    isFeatured: false,
    isPublished: true
  })
  const [newsFormErrors, setNewsFormErrors] = useState<Record<string, string>>({})

  // News editing state
  const [editingNews, setEditingNews] = useState<NewsFormatted | null>(null)
  const [editNewsImageFile, setEditNewsImageFile] = useState<File | null>(null)
  const [editNewsFormErrors, setEditNewsFormErrors] = useState<Record<string, string>>({})
  const [isEditingNews, setIsEditingNews] = useState(false)

  const { createNotification } = useNotifications()

  // Sensors para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Función para manejar el fin del arrastre con actualización optimista
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = casinos.findIndex((casino) => casino.id === active.id)
      const newIndex = casinos.findIndex((casino) => casino.id === over.id)

      // Crear nueva lista ordenada
      const newCasinos = arrayMove(casinos, oldIndex, newIndex)

      // Calcular nuevas posiciones (UI First - actualizar inmediatamente)
      const updatedCasinos = newCasinos.map((casino, index) => ({
        ...casino,
        position: index + 1
      }))

      // El estado se actualiza inmediatamente en reorderCasinos (UI First)

      try {
        console.log('🔄 Reordenando casinos (UI first)...')
        await reorderCasinos(updatedCasinos)
        console.log('✅ Casinos reordenados exitosamente')
      } catch (err) {
        console.error('❌ Error reordenando casinos:', err)

        // Revertir el estado local en caso de error
        try {
          revertCasinoReorder()
          createNotification(
            'error',
            'Error al reordenar',
            'No se pudieron actualizar las posiciones. Se ha revertido el cambio.',
            { duration: 5000 }
          )
        } catch (revertError) {
          console.error('❌ Error revirtiendo cambios:', revertError)
          createNotification(
            'error',
            'Error al reordenar',
            'No se pudieron actualizar las posiciones. Recarga la página.',
            { duration: 5000 }
          )
        }
      }
    }
  }



  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!newCasinoForm.casinoName.trim()) {
      errors.casinoName = 'El nombre del casino es requerido'
    }
    if (!newCasinoForm.antiguedad.trim()) {
      errors.antiguedad = 'La antigüedad es requerida'
    }
    if (newCasinoForm.rtp < 0 || newCasinoForm.rtp > 100) {
      errors.rtp = 'El RTP debe estar entre 0 y 100'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateCasino = async () => {
    if (!validateForm()) {
      console.error('❌ Errores en el formulario')
      return
    }

    setIsSubmitting(true)
    try {
      let coverImageUrl: string | undefined

      // Subir imagen si se seleccionó una
      if (newCasinoForm.coverImageFile) {
        try {
          const validation = validateImageFile(newCasinoForm.coverImageFile)
          if (!validation.valid) {
            setFormErrors({ coverImage: validation.error || 'Archivo inválido' })
            return
          }
          
          console.log('📤 Subiendo imagen de portada...')
          coverImageUrl = await uploadImage(newCasinoForm.coverImageFile, 'casinos')
        } catch (error) {
          console.error('❌ Error subiendo imagen:', error)
          setFormErrors({ coverImage: 'Error subiendo la imagen. Intenta nuevamente.' })
          return
        }
      }

      await createCasino({
        casinoName: newCasinoForm.casinoName,
        antiguedad: newCasinoForm.antiguedad,
        precio: newCasinoForm.precio,
        rtp: newCasinoForm.rtp,
        platSimilar: newCasinoForm.platSimilar || null,
        position: newCasinoForm.position,
        logo: coverImageUrl, // Guardar la imagen en la columna 'logo'
        imageUrl: undefined,
        isRegulated: newCasinoForm.isRegulated
      })
      
      // Reset form
      setNewCasinoForm({
        casinoName: '',
        antiguedad: '',
        precio: 'medio',
        rtp: 0,
        platSimilar: '',
        position: null,
        coverImageFile: null,
        isRegulated: false
      })
      setFormErrors({})
      setShowCreateForm(false)
      
      console.log('✅ Casino creado exitosamente')
    } catch (err) {
      console.error('❌ Error creando casino:', err)
      setFormErrors({ general: 'Error al crear el casino. Intenta nuevamente.' })
    } finally {
      setIsSubmitting(false)
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

  // News management functions
  const loadNews = async () => {
    try {
      setNewsLoading(true)
      const newsData = await NewsService.getAllNewsForAdmin()
      setNews(newsData)
    } catch (err) {
      console.error('❌ Error cargando noticias:', err)
    } finally {
      setNewsLoading(false)
    }
  }

  // Load news on component mount
  useEffect(() => {
    const loadInitialNews = async () => {
      try {
        setNewsLoading(true)
        const newsData = await NewsService.getAllNewsForAdmin()
        setNews(newsData)
      } catch (err) {
        console.error('❌ Error cargando noticias:', err)
      } finally {
        setNewsLoading(false)
      }
    }
    
    loadInitialNews()
  }, [])

  const handleCreateNews = async () => {
    if (!newNewsForm.title.trim()) {
      setNewsFormErrors({ title: 'El título es requerido' })
      console.error('❌ El título es requerido')
      return
    }

    try {
      let imageUrl: string | null = null

      // Subir imagen si se seleccionó una
      if (newNewsForm.imageFile) {
        try {
          const validation = validateImageFile(newNewsForm.imageFile)
          if (!validation.valid) {
            setNewsFormErrors({ image: validation.error || 'Archivo inválido' })
            return
          }
          
          console.log('📤 Subiendo imagen de la noticia...')
          imageUrl = await uploadImage(newNewsForm.imageFile, 'news')
        } catch (error) {
          console.error('❌ Error subiendo imagen:', error)
          setNewsFormErrors({ image: 'Error subiendo la imagen. Intenta nuevamente.' })
          return
        }
      }

      const createdNews = await NewsService.createNews({
        title: newNewsForm.title,
        excerpt: newNewsForm.excerpt || null,
        content: newNewsForm.content || null,
        image_url: imageUrl,
        author: newNewsForm.author,
        category: newNewsForm.category,
        is_featured: newNewsForm.isFeatured,
        is_published: newNewsForm.isPublished
      })

      createNotification(
        'info',
        'Nueva novedad publicada',
        `Ya podés leer "${createdNews.title}"`,
        {
          actionUrl: `/novedades/${createdNews.id}`,
          actionLabel: 'Ver noticia'
        }
      )

      // Broadcast persistent notification to all users
      try {
        console.log('📢 Broadcasting notification to all users...')
        const response = await fetch('/api/admin/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'info',
            title: 'Nueva novedad publicada',
            message: `Ya podés leer "${createdNews.title}"`,
            data: {
              actionUrl: `/novedades/${createdNews.id}`,
              actionLabel: 'Ver noticia'
            }
          })
        })

        if (!response.ok) {
          console.error('❌ Failed to broadcast notification:', await response.text())
        } else {
          const result = await response.json()
          console.log(`✅ Notification broadcast to ${result.data.broadcastCount} users`)
        }
      } catch (error) {
        // Non-blocking - log but don't fail news creation
        console.error('❌ Error broadcasting notification:', error)
      }

      // Reset form
      setNewNewsForm({
        title: '',
        excerpt: '',
        content: '',
        imageFile: null,
        author: 'Admin',
        category: 'general',
        isFeatured: false,
        isPublished: true
      })
      setNewsFormErrors({})
      setShowCreateNewsForm(false)
      
      // Reload news
      await loadNews()
      
      console.log('✅ Noticia creada exitosamente')
    } catch (err) {
      console.error('❌ Error creando noticia:', err)
      setNewsFormErrors({ general: 'Error al crear la noticia. Intenta nuevamente.' })
    }
  }

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      return
    }

    try {
      await NewsService.deleteNews(newsId)
      await loadNews()
      console.log('✅ Noticia eliminada exitosamente')
    } catch (err) {
      console.error('❌ Error eliminando noticia:', err)
    }
  }

  const handleToggleNewsStatus = async (newsId: string, currentStatus: boolean) => {
    try {
      await NewsService.updateNews(newsId, { isPublished: !currentStatus })
      await loadNews()
      console.log(`✅ Noticia ${!currentStatus ? 'publicada' : 'despublicada'} exitosamente`)
    } catch (err) {
      console.error('❌ Error actualizando estado de noticia:', err)
    }
  }

  const handleToggleNewsFeatured = async (newsId: string, currentStatus: boolean) => {
    try {
      await NewsService.updateNews(newsId, { isFeatured: !currentStatus })
      await loadNews()
      console.log(`✅ Noticia ${!currentStatus ? 'marcada como destacada' : 'desmarcada como destacada'} exitosamente`)
    } catch (err) {
      console.error('❌ Error actualizando estado destacado de noticia:', err)
    }
  }

  const handleEditNews = (news: NewsFormatted) => {
    setEditingNews(news)
    setEditNewsFormErrors({})
    setEditNewsImageFile(null)
    console.log('📝 Opening edit form for news:', news.title)
  }

  const validateEditNewsForm = (news: NewsFormatted) => {
    const errors: Record<string, string> = {}

    if (!news.title.trim()) {
      errors.title = 'El título es requerido'
    }

    setEditNewsFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveNews = async () => {
    if (!editingNews) return

    if (!validateEditNewsForm(editingNews)) {
      console.error('❌ Errores en el formulario de edición')
      return
    }

    setIsEditingNews(true)
    try {
      let imageUrl = editingNews.imageUrl

      // Handle image upload/replacement
      if (editNewsImageFile) {
        try {
          const validation = validateImageFile(editNewsImageFile)
          if (!validation.valid) {
            setEditNewsFormErrors({ image: validation.error || 'Archivo inválido' })
            setIsEditingNews(false)
            return
          }

          console.log('📤 Subiendo nueva imagen de la noticia...')

          // Replace if existing, upload if new
          if (editingNews.imageUrl) {
            imageUrl = await replaceImage(editingNews.imageUrl, editNewsImageFile, 'news')
          } else {
            imageUrl = await uploadImage(editNewsImageFile, 'news')
          }
        } catch (error) {
          console.error('❌ Error subiendo imagen:', error)
          setEditNewsFormErrors({ image: 'Error subiendo la imagen. Intenta nuevamente.' })
          setIsEditingNews(false)
          return
        }
      }

      // Update via NewsService
      await NewsService.updateNews(editingNews.id, {
        title: editingNews.title,
        excerpt: editingNews.excerpt,
        content: editingNews.content,
        imageUrl: imageUrl,
        author: editingNews.author,
        category: editingNews.category,
        isFeatured: editingNews.isFeatured,
        isPublished: editingNews.isPublished
      })

      // Close sheet and refresh
      setEditingNews(null)
      setEditNewsFormErrors({})
      setEditNewsImageFile(null)
      await loadNews()

      console.log('✅ Noticia actualizada exitosamente')

    } catch (err) {
      console.error('❌ Error actualizando noticia:', err)
      setEditNewsFormErrors({ general: 'Error al actualizar la noticia. Intenta nuevamente.' })
    } finally {
      setIsEditingNews(false)
    }
  }


  const handleEditCasino = (casino: CasinoWithFields) => {
    setEditingCasino(casino)
    setEditFormErrors({})
    setEditCoverImageFile(null)
  }

  const validateEditForm = (casino: CasinoWithFields) => {
    const errors: Record<string, string> = {}
    
    if (!casino.casinoName.trim()) {
      errors.casinoName = 'El nombre del casino es requerido'
    }
    if (!casino.antiguedad.trim()) {
      errors.antiguedad = 'La antigüedad es requerida'
    }
    if (casino.rtp < 0 || casino.rtp > 100) {
      errors.rtp = 'El RTP debe estar entre 0 y 100'
    }
    
    setEditFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveCasino = async () => {
    if (!editingCasino) return
    
    if (!validateEditForm(editingCasino)) {
      console.error('❌ Errores en el formulario de edición')
      return
    }

    setIsEditing(true)
    try {
      let logoUrl = editingCasino.logo

      // Subir nueva imagen si se seleccionó una
      if (editCoverImageFile) {
        try {
          const validation = validateImageFile(editCoverImageFile)
          if (!validation.valid) {
            setEditFormErrors({ coverImage: validation.error || 'Archivo inválido' })
            return
          }

          console.log('📤 Subiendo nueva imagen de logo...')

          // Si había una imagen anterior, la reemplazamos; si no, subimos una nueva
          if (editingCasino.logo) {
            logoUrl = await replaceImage(
              editingCasino.logo,
              editCoverImageFile,
              'casinos'
            )
          } else {
            logoUrl = await uploadImage(editCoverImageFile, 'casinos')
          }
        } catch (error) {
          console.error('❌ Error subiendo imagen:', error)
          setEditFormErrors({ coverImage: 'Error subiendo la imagen. Intenta nuevamente.' })
          return
        }
      }

      await updateCasino(editingCasino.id, {
        casinoName: editingCasino.casinoName,
        antiguedad: editingCasino.antiguedad,
        precio: editingCasino.precio,
        rtp: editingCasino.rtp,
        platSimilar: editingCasino.platSimilar,
        logo: logoUrl, // Guardar la imagen en la columna 'logo'
        position: editingCasino.position,
        isRegulated: editingCasino.isRegulated
      })
      setEditingCasino(null)
      setEditFormErrors({})
      setEditCoverImageFile(null)
      console.log('✅ Casino actualizado exitosamente')
    } catch (err) {
      console.error('❌ Error actualizando casino:', err)
      setEditFormErrors({ general: 'Error al actualizar el casino. Intenta nuevamente.' })
    } finally {
      setIsEditing(false)
    }
  }

  const handleSwapTopThreePositions = async (casino1: { id: string; position: number }, casino2: { id: string; position: number }) => {
    try {
      const pos1 = casino1.position
      const pos2 = casino2.position
      
      // Intercambiar posiciones
      await updateCasino(casino1.id, {
        position: pos2
      })
      
      await updateCasino(casino2.id, {
        position: pos1
      })
      
      console.log('✅ Posiciones intercambiadas exitosamente')
    } catch (err) {
      console.error('❌ Error intercambiando posiciones:', err)
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
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <Tabs defaultValue="top-three" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="top-three" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Top 3</span>
              <span className="xs:hidden">Top</span>
            </TabsTrigger>
            <TabsTrigger value="casinos" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Casinos</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Newspaper className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Noticias</span>
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
                      {casino.logo ? (
                        <Image
                          src={casino.logo}
                          alt={casino.casinoName}
                          fill
                          className="object-contain p-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.innerHTML = `<span class="text-2xl font-bold">${casino.casinoName.charAt(0)}</span>`
                            }
                          }}
                        />
                      ) : (
                        <span className="text-2xl font-bold">
                          {casino.casinoName.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{casino.casinoName}</h3>
                      <p className="text-sm text-muted-foreground">Antigüedad: {casino.antiguedad}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-xs",
                            casino.precio === 'muy barato' ? 'bg-green-100 text-green-800 border-green-200' :
                            casino.precio === 'barato' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          )}
                        >
                          {CASINO_PRECIO_VALUES[casino.precio].label}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          RTP: {casino.rtp}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Para cambiar el logo, usa el botón "Editar casino"
                        </p>
                      </div>
                      
                      {/* Botones de reordenamiento */}
                      <div className="flex flex-col gap-1">
                        {index > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const prevCasino = topThree[index - 1]
                              handleSwapTopThreePositions(casino, prevCasino)
                            }}
                            className="p-2"
                          >
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const casinoToEdit = casinos.find(c => c.id === casino.id)
                            if (casinoToEdit) handleEditCasino(casinoToEdit)
                          }}
                          className="p-2"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label htmlFor="casino-name">Nombre del Casino *</Label>
                            <Input
                              id="casino-name"
                              placeholder="Ej: Casino Royal"
                              value={newCasinoForm.casinoName}
                              onChange={(e) => {
                                setNewCasinoForm(prev => ({ ...prev, casinoName: e.target.value }))
                                if (formErrors.casinoName) {
                                  setFormErrors(prev => ({ ...prev, casinoName: '' }))
                                }
                              }}
                              className={formErrors.casinoName ? 'border-red-500' : ''}
                            />
                            {formErrors.casinoName && <p className="text-red-500 text-sm mt-1">{formErrors.casinoName}</p>}
                          </div>
                          <div>
                            <Label htmlFor="casino-antiguedad">Antigüedad *</Label>
                            <Input
                              id="casino-antiguedad"
                              placeholder="Ej: 5 años"
                              value={newCasinoForm.antiguedad}
                              onChange={(e) => {
                                setNewCasinoForm(prev => ({ ...prev, antiguedad: e.target.value }))
                                if (formErrors.antiguedad) {
                                  setFormErrors(prev => ({ ...prev, antiguedad: '' }))
                                }
                              }}
                              className={formErrors.antiguedad ? 'border-red-500' : ''}
                            />
                            {formErrors.antiguedad && <p className="text-red-500 text-sm mt-1">{formErrors.antiguedad}</p>}
                          </div>
                          <div>
                            <Label htmlFor="casino-precio">Precio *</Label>
                            <Select 
                              value={newCasinoForm.precio} 
                              onValueChange={(value: 'medio' | 'barato' | 'muy barato') => 
                                setNewCasinoForm(prev => ({ ...prev, precio: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="muy barato">Muy Barato</SelectItem>
                                <SelectItem value="barato">Barato</SelectItem>
                                <SelectItem value="medio">Medio</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="casino-rtp">RTP (%) *</Label>
                            <Input
                              id="casino-rtp"
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="Ej: 96.5"
                              value={newCasinoForm.rtp}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0
                                setNewCasinoForm(prev => ({ ...prev, rtp: value }))
                                if (formErrors.rtp) {
                                  setFormErrors(prev => ({ ...prev, rtp: '' }))
                                }
                              }}
                              className={formErrors.rtp ? 'border-red-500' : ''}
                            />
                            {formErrors.rtp && <p className="text-red-500 text-sm mt-1">{formErrors.rtp}</p>}
                          </div>
                          <div>
                            <Label htmlFor="casino-position">Posición (Opcional)</Label>
                            <Input
                              id="casino-position"
                              type="number"
                              min="1"
                              placeholder="Ej: 1, 2, 3..."
                              value={newCasinoForm.position || ''}
                              onChange={(e) => 
                                setNewCasinoForm(prev => ({ 
                                  ...prev, 
                                  position: e.target.value ? parseInt(e.target.value) : null 
                                }))
                              }
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Los 3 casinos con menor posición aparecerán en el Top 3
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="casino-plat-similar">Plat. Similar</Label>
                            <Input
                              id="casino-plat-similar"
                              placeholder="Ej: Bet365, 888casino"
                              value={newCasinoForm.platSimilar}
                              onChange={(e) => setNewCasinoForm(prev => ({ ...prev, platSimilar: e.target.value }))}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="casino-regulated"
                              checked={newCasinoForm.isRegulated}
                              onCheckedChange={(checked) =>
                                setNewCasinoForm(prev => ({ ...prev, isRegulated: checked }))
                              }
                            />
                            <Label htmlFor="casino-regulated">Casino Regulado</Label>
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="casino-cover-image">Imagen de Portada (opcional)</Label>
                            <Input
                              id="casino-cover-image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                setNewCasinoForm(prev => ({ ...prev, coverImageFile: file }))
                                if (formErrors.coverImage) {
                                  setFormErrors(prev => ({ ...prev, coverImage: '' }))
                                }
                              }}
                              className={formErrors.coverImage ? 'border-red-500' : ''}
                            />
                            {formErrors.coverImage && <p className="text-red-500 text-sm mt-1">{formErrors.coverImage}</p>}
                            <p className="text-xs text-muted-foreground mt-1">
                              Formatos soportados: JPG, PNG, WebP, GIF. Máximo 5MB.
                            </p>
                            {newCasinoForm.coverImageFile && (
                              <p className="text-xs text-green-600 mt-1">
                                ✓ Archivo seleccionado: {newCasinoForm.coverImageFile.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {formErrors.general && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{formErrors.general}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleCreateCasino}
                            disabled={isSubmitting}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? 'Creando...' : 'Crear Casino'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowCreateForm(false)
                              setFormErrors({})
                            }}
                            disabled={isSubmitting}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Lista de casinos ordenable con drag and drop */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <GripVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Arrastra los casinos para cambiar su orden</span>
                        <span className="sm:hidden">Arrastra para reordenar</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {casinos.length} casinos
                      </Badge>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={casinos.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {casinos
                            .sort((a, b) => (a.position || 999) - (b.position || 999))
                            .map((casino) => (
                              <SortableCasinoItem
                                key={casino.id}
                                casino={casino}
                                onEdit={handleEditCasino}
                                onDelete={handleDeleteCasino}
                              />
                            ))}
                        </div>
                      </SortableContext>
                    </DndContext>
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

          {/* News Management */}
          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Noticias</CardTitle>
                <CardDescription>
                  Crear y administrar noticias para la página de novedades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full md:w-auto"
                    onClick={() => setShowCreateNewsForm(!showCreateNewsForm)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {showCreateNewsForm ? 'Cancelar' : 'Agregar Nueva Noticia'}
                  </Button>
                  
                  {/* Formulario de creación */}
                  {showCreateNewsForm && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Crear Nueva Noticia</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="news-title">Título de la Noticia</Label>
                            <Input
                              id="news-title"
                              placeholder="Ej: Nuevos casinos agregados"
                              value={newNewsForm.title}
                              onChange={(e) => {
                                setNewNewsForm(prev => ({ ...prev, title: e.target.value }))
                                if (newsFormErrors.title) {
                                  setNewsFormErrors(prev => ({ ...prev, title: '' }))
                                }
                              }}
                              className={newsFormErrors.title ? 'border-red-500' : ''}
                            />
                            {newsFormErrors.title && <p className="text-red-500 text-sm mt-1">{newsFormErrors.title}</p>}
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="news-excerpt">Extracto</Label>
                            <Textarea
                              id="news-excerpt"
                              placeholder="Breve descripción de la noticia..."
                              value={newNewsForm.excerpt}
                              onChange={(e) => setNewNewsForm(prev => ({ ...prev, excerpt: e.target.value }))}
                              rows={2}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="news-content">Contenido</Label>
                            <Textarea
                              id="news-content"
                              placeholder="Contenido completo de la noticia..."
                              value={newNewsForm.content}
                              onChange={(e) => setNewNewsForm(prev => ({ ...prev, content: e.target.value }))}
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label htmlFor="news-category">Categoría</Label>
                            <Select 
                              value={newNewsForm.category} 
                              onValueChange={(value) => 
                                setNewNewsForm(prev => ({ ...prev, category: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="announcements">Anuncios</SelectItem>
                                <SelectItem value="guides">Guías</SelectItem>
                                <SelectItem value="promotions">Promociones</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="news-author">Autor</Label>
                            <Input
                              id="news-author"
                              placeholder="Autor de la noticia"
                              value={newNewsForm.author}
                              onChange={(e) => setNewNewsForm(prev => ({ ...prev, author: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="news-image">Imagen de la Noticia</Label>
                            <Input
                              id="news-image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                setNewNewsForm(prev => ({ ...prev, imageFile: file }))
                                if (newsFormErrors.image) {
                                  setNewsFormErrors(prev => ({ ...prev, image: '' }))
                                }
                              }}
                              className={newsFormErrors.image ? 'border-red-500' : ''}
                            />
                            {newsFormErrors.image && <p className="text-red-500 text-sm mt-1">{newsFormErrors.image}</p>}
                            <p className="text-xs text-muted-foreground mt-1">
                              Formatos soportados: JPG, PNG, WebP, GIF. Máximo 5MB.
                            </p>
                            {newNewsForm.imageFile && (
                              <p className="text-xs text-green-600 mt-1">
                                ✓ Archivo seleccionado: {newNewsForm.imageFile.name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="news-featured"
                              checked={newNewsForm.isFeatured}
                              onCheckedChange={(checked) => 
                                setNewNewsForm(prev => ({ ...prev, isFeatured: checked }))
                              }
                            />
                            <Label htmlFor="news-featured">Noticia Destacada</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="news-published"
                              checked={newNewsForm.isPublished}
                              onCheckedChange={(checked) => 
                                setNewNewsForm(prev => ({ ...prev, isPublished: checked }))
                              }
                            />
                            <Label htmlFor="news-published">Publicar Inmediatamente</Label>
                          </div>
                        </div>
                        {newsFormErrors.general && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{newsFormErrors.general}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button onClick={handleCreateNews}>
                            <Save className="h-4 w-4 mr-2" />
                            Crear Noticia
                          </Button>
                          <Button variant="outline" onClick={() => {
                            setShowCreateNewsForm(false)
                            setNewsFormErrors({})
                          }}>
                            Cancelar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Lista de noticias existentes */}
                  <div className="space-y-3">
                    {newsLoading ? (
                      <div className="text-center py-4">
                        <p>Cargando noticias...</p>
                      </div>
                    ) : news.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Newspaper className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No hay noticias registradas</p>
                        <p className="text-xs">Crea tu primera noticia para comenzar</p>
                      </div>
                    ) : (
                      news.map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <Newspaper className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{article.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {article.excerpt || 'Sin extracto'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {article.category}
                                </Badge>
                                {article.isFeatured && (
                                  <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                                    <Star className="h-3 w-3 mr-1" />
                                    Destacada
                                  </Badge>
                                )}
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs",
                                    article.isPublished 
                                      ? "bg-green-100 text-green-800 border-green-200" 
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  )}
                                >
                                  {article.isPublished ? 'Publicada' : 'Borrador'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleNewsFeatured(article.id, article.isFeatured)}
                              title={article.isFeatured ? 'Quitar de destacadas' : 'Marcar como destacada'}
                            >
                              <Star className={cn("h-4 w-4", article.isFeatured && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleNewsStatus(article.id, article.isPublished)}
                              title={article.isPublished ? 'Despublicar' : 'Publicar'}
                            >
                              {article.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditNews(article)}
                              title="Editar noticia"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteNews(article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Casino Edit Drawer */}
      <Sheet open={!!editingCasino} onOpenChange={(open) => {
        if (!open) {
          setEditingCasino(null)
          setEditFormErrors({})
          setEditCoverImageFile(null)
        }
      }}>
        <SheetContent className="w-[90vw] sm:w-[600px] md:w-[700px] lg:w-[800px] overflow-y-auto p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>Editar Casino</SheetTitle>
            <SheetDescription>
              {editingCasino?.casinoName}
            </SheetDescription>
          </SheetHeader>

          {editingCasino && (
            <div className="space-y-6 pb-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="edit-casino-name">Nombre del Casino *</Label>
                  <Input
                    id="edit-casino-name"
                    value={editingCasino.casinoName}
                    onChange={(e) => {
                      setEditingCasino(prev => prev ? { ...prev, casinoName: e.target.value } : null)
                      if (editFormErrors.casinoName) {
                        setEditFormErrors(prev => ({ ...prev, casinoName: '' }))
                      }
                    }}
                    className={editFormErrors.casinoName ? 'border-red-500' : ''}
                  />
                  {editFormErrors.casinoName && <p className="text-red-500 text-sm mt-1">{editFormErrors.casinoName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="edit-casino-antiguedad">Antigüedad *</Label>
                  <Input
                    id="edit-casino-antiguedad"
                    value={editingCasino.antiguedad}
                    onChange={(e) => {
                      setEditingCasino(prev => prev ? { ...prev, antiguedad: e.target.value } : null)
                      if (editFormErrors.antiguedad) {
                        setEditFormErrors(prev => ({ ...prev, antiguedad: '' }))
                      }
                    }}
                    className={editFormErrors.antiguedad ? 'border-red-500' : ''}
                  />
                  {editFormErrors.antiguedad && <p className="text-red-500 text-sm mt-1">{editFormErrors.antiguedad}</p>}
                </div>
                
                <div>
                  <Label htmlFor="edit-casino-precio">Precio *</Label>
                  <Select 
                    value={editingCasino.precio} 
                    onValueChange={(value: 'medio' | 'barato' | 'muy barato') => {
                      setEditingCasino(prev => prev ? { ...prev, precio: value } : null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="muy barato">Muy Barato</SelectItem>
                      <SelectItem value="barato">Barato</SelectItem>
                      <SelectItem value="medio">Medio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-casino-rtp">RTP (%) *</Label>
                  <Input
                    id="edit-casino-rtp"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editingCasino.rtp}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setEditingCasino(prev => prev ? { ...prev, rtp: value } : null)
                      if (editFormErrors.rtp) {
                        setEditFormErrors(prev => ({ ...prev, rtp: '' }))
                      }
                    }}
                    className={editFormErrors.rtp ? 'border-red-500' : ''}
                  />
                  {editFormErrors.rtp && <p className="text-red-500 text-sm mt-1">{editFormErrors.rtp}</p>}
                </div>
                
                <div>
                  <Label htmlFor="edit-casino-position">Posición</Label>
                  <Input
                    id="edit-casino-position"
                    type="number"
                    min="1"
                    placeholder="Ej: 1, 2, 3..."
                    value={editingCasino.position || ''}
                    onChange={(e) => 
                      setEditingCasino(prev => prev ? { 
                        ...prev, 
                        position: e.target.value ? parseInt(e.target.value) : null
                      } : null)
                    }
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Los 3 casinos con menor posición aparecerán en el Top 3
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="edit-casino-plat-similar">Plat. Similar</Label>
                  <Input
                    id="edit-casino-plat-similar"
                    value={editingCasino.platSimilar || ''}
                    onChange={(e) => setEditingCasino(prev => prev ? { ...prev, platSimilar: e.target.value } : null)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-casino-regulated"
                    checked={editingCasino.isRegulated}
                    onCheckedChange={(checked) =>
                      setEditingCasino(prev => prev ? { ...prev, isRegulated: checked } : null)
                    }
                  />
                  <Label htmlFor="edit-casino-regulated">Casino Regulado</Label>
                </div>

                <div>
                  <Label htmlFor="edit-casino-cover-image">Logo del Casino</Label>

                  {/* Preview del logo actual */}
                  {editingCasino.logo && !editCoverImageFile && (
                    <div className="mt-2 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted-foreground">Logo actual:</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCasino(prev => prev ? { ...prev, logo: null } : null)
                          }}
                          className="h-7 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Quitar imagen
                        </Button>
                      </div>
                      <div className="relative w-32 h-32 rounded-lg border-2 border-muted bg-muted/10 overflow-hidden">
                        <Image
                          src={editingCasino.logo}
                          alt={editingCasino.casinoName}
                          fill
                          className="object-contain p-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Preview de la nueva imagen seleccionada */}
                  {editCoverImageFile && (
                    <div className="mt-2 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-green-600">
                          ✓ Nueva imagen seleccionada: {editCoverImageFile.name}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditCoverImageFile(null)
                          }}
                          className="h-7 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                      <div className="relative w-32 h-32 rounded-lg border-2 border-green-500 bg-muted/10 overflow-hidden">
                        <Image
                          src={URL.createObjectURL(editCoverImageFile)}
                          alt="Preview"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  )}

                  <Input
                    id="edit-casino-cover-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setEditCoverImageFile(file)
                      if (editFormErrors.coverImage) {
                        setEditFormErrors(prev => ({ ...prev, coverImage: '' }))
                      }
                    }}
                    className={editFormErrors.coverImage ? 'border-red-500' : ''}
                  />
                  {editFormErrors.coverImage && <p className="text-red-500 text-sm mt-1">{editFormErrors.coverImage}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos soportados: JPG, PNG, WebP, GIF. Máximo 5MB.
                  </p>
                </div>
              </div>
              
              {editFormErrors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{editFormErrors.general}</p>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSaveCasino}
                  disabled={isEditing}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingCasino(null)
                    setEditFormErrors({})
                    setEditCoverImageFile(null)
                  }}
                  disabled={isEditing}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* News Edit Drawer */}
      <Sheet open={!!editingNews} onOpenChange={(open) => {
        if (!open) {
          setEditingNews(null)
          setEditNewsFormErrors({})
          setEditNewsImageFile(null)
        }
      }}>
        <SheetContent className="w-[90vw] sm:w-[600px] md:w-[700px] lg:w-[800px] overflow-y-auto p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>Editar Noticia</SheetTitle>
            <SheetDescription>
              {editingNews?.title}
            </SheetDescription>
          </SheetHeader>

          {editingNews && (
            <div className="space-y-6 pb-6">
              <div className="space-y-6">
                {/* Title Field */}
                <div>
                  <Label htmlFor="edit-news-title">Título *</Label>
                  <Input
                    id="edit-news-title"
                    value={editingNews.title}
                    onChange={(e) => {
                      setEditingNews(prev => prev ? { ...prev, title: e.target.value } : null)
                      if (editNewsFormErrors.title) {
                        setEditNewsFormErrors(prev => ({ ...prev, title: '' }))
                      }
                    }}
                    className={editNewsFormErrors.title ? 'border-red-500' : ''}
                  />
                  {editNewsFormErrors.title && <p className="text-red-500 text-sm mt-1">{editNewsFormErrors.title}</p>}
                </div>

                {/* Excerpt Field */}
                <div>
                  <Label htmlFor="edit-news-excerpt">Extracto</Label>
                  <Input
                    id="edit-news-excerpt"
                    value={editingNews.excerpt || ''}
                    onChange={(e) => {
                      setEditingNews(prev => prev ? { ...prev, excerpt: e.target.value } : null)
                    }}
                    placeholder="Resumen breve de la noticia"
                  />
                </div>

                {/* Content Field */}
                <div>
                  <Label htmlFor="edit-news-content">Contenido</Label>
                  <Textarea
                    id="edit-news-content"
                    value={editingNews.content || ''}
                    onChange={(e) => {
                      setEditingNews(prev => prev ? { ...prev, content: e.target.value } : null)
                    }}
                    placeholder="Contenido completo de la noticia"
                    rows={6}
                  />
                </div>

                {/* Author Field */}
                <div>
                  <Label htmlFor="edit-news-author">Autor</Label>
                  <Input
                    id="edit-news-author"
                    value={editingNews.author}
                    onChange={(e) => {
                      setEditingNews(prev => prev ? { ...prev, author: e.target.value } : null)
                    }}
                  />
                </div>

                {/* Category Field */}
                <div>
                  <Label htmlFor="edit-news-category">Categoría</Label>
                  <Select
                    value={editingNews.category}
                    onValueChange={(value) => {
                      setEditingNews(prev => prev ? { ...prev, category: value } : null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="announcements">Anuncios</SelectItem>
                      <SelectItem value="guides">Guías</SelectItem>
                      <SelectItem value="promotions">Promociones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload Field */}
                <div>
                  <Label htmlFor="edit-news-image">Imagen</Label>

                  {/* Preview current image */}
                  {editingNews.imageUrl && !editNewsImageFile && (
                    <div className="mt-2 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted-foreground">Imagen actual:</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingNews(prev => prev ? { ...prev, imageUrl: null } : null)
                          }}
                          className="h-7 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Quitar imagen
                        </Button>
                      </div>
                      <div className="relative w-full h-48 rounded-lg border-2 border-muted bg-muted/10 overflow-hidden">
                        <Image
                          src={editingNews.imageUrl}
                          alt={editingNews.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Preview new image selected */}
                  {editNewsImageFile && (
                    <div className="mt-2 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-green-600">
                          ✓ Nueva imagen seleccionada: {editNewsImageFile.name}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditNewsImageFile(null)
                          }}
                          className="h-7 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                      <div className="relative w-full h-48 rounded-lg border-2 border-green-500 bg-muted/10 overflow-hidden">
                        <Image
                          src={URL.createObjectURL(editNewsImageFile)}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <Input
                    id="edit-news-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setEditNewsImageFile(file)
                      if (editNewsFormErrors.image) {
                        setEditNewsFormErrors(prev => ({ ...prev, image: '' }))
                      }
                    }}
                    className={editNewsFormErrors.image ? 'border-red-500' : ''}
                  />
                  {editNewsFormErrors.image && <p className="text-red-500 text-sm mt-1">{editNewsFormErrors.image}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos soportados: JPG, PNG, WebP, GIF. Máximo 5MB.
                  </p>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-news-featured"
                    checked={editingNews.isFeatured}
                    onCheckedChange={(checked) =>
                      setEditingNews(prev => prev ? { ...prev, isFeatured: checked } : null)
                    }
                  />
                  <Label htmlFor="edit-news-featured">Marcar como destacada</Label>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-news-published"
                    checked={editingNews.isPublished}
                    onCheckedChange={(checked) =>
                      setEditingNews(prev => prev ? { ...prev, isPublished: checked } : null)
                    }
                  />
                  <Label htmlFor="edit-news-published">Publicada</Label>
                </div>
              </div>

              {editNewsFormErrors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{editNewsFormErrors.general}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSaveNews}
                  disabled={isEditingNews}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditingNews ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingNews(null)
                    setEditNewsFormErrors({})
                    setEditNewsImageFile(null)
                  }}
                  disabled={isEditingNews}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  )
}
