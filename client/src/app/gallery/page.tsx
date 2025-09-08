"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, ArrowLeft, Grid3X3, List, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ImageScheduler, type ScheduleData } from "@/components/schedule/ImageScheduler"
import { useScheduledImages } from "@/lib/hooks/useScheduledImages"
import { useImagesApi } from "@/lib/hooks/useImagesApi"
import { useImageDownload } from "@/lib/hooks/useImageDownload"
// import { useImageStorage } from "@/lib/hooks/useImageStorage" // No se usa más
import type { ImageRecord } from "@/lib/types/imageGeneration"
import type { StoredImage } from "@/lib/hooks/useImageStorage"

// Tipo simplificado para la UI de la galería
interface GalleryImage {
  id: string
  url: string
  title: string
  prompt: string
  timestamp: Date
  tags: string[]
}

// Función para convertir ImageRecord (API) a GalleryImage
const convertApiImageToGalleryImage = (apiImage: ImageRecord): GalleryImage => {
  return {
    id: apiImage.id.toString(),
    url: apiImage.result_with_logo || apiImage.result, // Preferir imagen con logo
    title: apiImage.prompt.substring(0, 50) + "...", // Truncar prompt como título
    prompt: apiImage.prompt,
    timestamp: new Date(apiImage.created_at),
    tags: extractTagsFromPrompt(apiImage.prompt)
  }
}

// Función para convertir ImageRecord (API) a StoredImage cuando sea necesario
const convertApiImageToStoredImage = (apiImage: ImageRecord): StoredImage => {
  return {
    id: apiImage.id.toString(),
    url: apiImage.result_with_logo || apiImage.result,
    title: apiImage.prompt.substring(0, 50) + "...",
    prompt: apiImage.prompt,
    timestamp: new Date(apiImage.created_at),
    tags: extractTagsFromPrompt(apiImage.prompt),
    favorite: false,
    scheduled: false
  }
}

// Función auxiliar para extraer tags del prompt (similar a useImageStorage)
const extractTagsFromPrompt = (prompt: string): string[] => {
  const commonCasinoTerms = [
    'casino', 'jackpot', 'slots', 'poker', 'blackjack', 'roulette', 
    'bonus', 'vip', 'promoción', 'premio', 'winner', 'gold', 'luxury'
  ]
  
  const lowerPrompt = prompt.toLowerCase()
  const tags = commonCasinoTerms.filter(term => lowerPrompt.includes(term))
  
  // Add generic tags based on content
  if (lowerPrompt.includes('banner')) tags.push('banner')
  if (lowerPrompt.includes('tarjeta')) tags.push('tarjeta')
  if (lowerPrompt.includes('evento')) tags.push('evento')
  
  return [...new Set(tags)] // Remove duplicates
}
import { AppLayout } from "@/components/layout/AppLayout"

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [schedulerOpen, setSchedulerOpen] = useState(false)
  const [selectedImageForSchedule, setSelectedImageForSchedule] = useState<{ url: string; title: string } | null>(null)
  
  const { scheduleImage } = useScheduledImages()
  const { images: apiImages, isLoading: apiLoading, error: apiError, refreshImages } = useImagesApi()
  const { downloadImage, isDownloading } = useImageDownload()

  // Convertir imágenes de la API al formato GalleryImage
  const galleryImages: GalleryImage[] = apiImages.map(convertApiImageToGalleryImage)
  const isLoading = apiLoading

  // Convertir también a StoredImage para compatibilidad con funciones existentes
  const images: StoredImage[] = apiImages.map(convertApiImageToStoredImage)

  // Función de filtrado para GalleryImage
  const getFilteredImages = (filter: 'all' | 'favorites' | 'scheduled', searchTerm: string): GalleryImage[] => {
    let filtered = galleryImages

    // Apply filter (favorites y scheduled no implementados en API por ahora)
    if (filter === 'favorites' || filter === 'scheduled') {
      return [] // Por ahora retornar vacío para estos filtros
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(img =>
        img.title.toLowerCase().includes(term) ||
        img.prompt.toLowerCase().includes(term) ||
        img.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    return filtered
  }

  // Get filtered images
  const filteredImages = getFilteredImages(selectedFilter as 'all' | 'favorites' | 'scheduled', searchTerm)


  const handleDownload = async (imageId: string) => {
    const image = galleryImages.find(img => img.id === imageId)
    if (image) {
      try {
        await downloadImage(image.url, `${image.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.png`)
      } catch (error) {
        console.error('Error al descargar la imagen:', error)
        alert('Error al descargar la imagen')
      }
    }
  }

  const handleDelete = (imageId: string) => {
    // Las imágenes de la API no se pueden eliminar desde aquí
    alert('Las imágenes de la API no se pueden eliminar desde la galería')
  }

  return (
    <AppLayout
      title="Galería"
      subtitle={`${filteredImages.length} imágenes (API)`}
      showBackButton={true}
      backHref="/dashboard"
    >
      {/* View Controls */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-2">
        <div className="flex justify-end space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary-600 hover:bg-primary-700" : ""}
          >
            <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary-600 hover:bg-primary-700" : ""}
          >
            <List className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, prompt o etiquetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
              className={`text-xs sm:text-sm ${selectedFilter === "all" ? "bg-primary-600 hover:bg-primary-700" : ""}`}
            >
              Todas
            </Button>
            {/* Temporalmente oculto
            <Button
              variant={selectedFilter === "scheduled" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("scheduled")}
              className="text-xs sm:text-sm"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Programadas</span>
              <span className="sm:hidden">📅</span>
            </Button>
            */}
          </div>
        </div>

        {/* Error State de API */}
        {apiError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">
              <strong>Error:</strong> No se pudieron cargar las imágenes de la API. {apiError}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Cargando imágenes...</h3>
            <p className="text-gray-600 dark:text-gray-300">Un momento por favor</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">No se encontraron imágenes</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Intenta con otros términos de búsqueda o filtros</p>
            <Link href="/chat">
              <Button className="bg-primary-600 hover:bg-primary-700">Generar nueva imagen</Button>
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" : "space-y-3 sm:space-y-4"
            }
          >
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {viewMode === "grid" ? (
                  <div>
                    <div className="aspect-square bg-gray-100 overflow-hidden relative group">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary" onClick={() => handleDownload(image.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          {/* Temporalmente oculto
                          <Button size="sm" variant="secondary" onClick={() => handleSchedulePost(image.id)}>
                            <Calendar className="h-4 w-4" />
                          </Button>
                          */}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold mb-1">{image.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{image.prompt}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {image.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{image.timestamp.toLocaleDateString()}</p>
                    </CardContent>
                  </div>
                ) : (
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex space-x-3 sm:space-x-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{image.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{image.prompt}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {image.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">{image.timestamp.toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-1 ml-2 sm:ml-4">
                            <Button size="sm" variant="outline" className="hidden sm:flex" onClick={() => handleDownload(image.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            {/* Temporalmente oculto
                            <Button size="sm" variant="outline" onClick={() => handleSchedulePost(image.id)}>
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            */}
                            <Button size="sm" variant="outline" className="hidden sm:flex" onClick={() => handleDelete(image.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Temporalmente oculto
      <ImageScheduler
        isOpen={schedulerOpen}
        onOpenChange={setSchedulerOpen}
        imageUrl={selectedImageForSchedule?.url}
        imageTitle={selectedImageForSchedule?.title}
        onSchedule={handleScheduleConfirm}
      />
      */}
    </AppLayout>
  )
}
