"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Heart, ArrowLeft, Grid3X3, List, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ImageScheduler, type ScheduleData } from "@/components/schedule/ImageScheduler"
import { useScheduledImages } from "@/lib/hooks/useScheduledImages"
import { AppLayout } from "@/components/layout/AppLayout"

export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [schedulerOpen, setSchedulerOpen] = useState(false)
  const [selectedImageForSchedule, setSelectedImageForSchedule] = useState<{ url: string; title: string } | null>(null)
  
  const { scheduleImage } = useScheduledImages()

  // Mock data - replace with real data from your backend
  const images = [
    {
      id: 1,
      url: "/placeholder.svg?height=300&width=300",
      title: "Arte Digital Abstracto",
      prompt: "Arte digital abstracto con colores vibrantes y formas geométricas",
      date: "2024-01-15",
      tags: ["abstracto", "digital", "colorido"],
      favorite: true,
      scheduled: false,
    },
    {
      id: 2,
      url: "/placeholder.svg?height=300&width=300",
      title: "Paisaje Montañoso",
      prompt: "Paisaje montañoso al amanecer con niebla y colores cálidos",
      date: "2024-01-14",
      tags: ["paisaje", "montaña", "amanecer"],
      favorite: false,
      scheduled: true,
    },
    {
      id: 3,
      url: "/placeholder.svg?height=300&width=300",
      title: "Retrato Artístico",
      prompt: "Retrato de mujer en estilo acuarela con tonos suaves",
      date: "2024-01-13",
      tags: ["retrato", "acuarela", "mujer"],
      favorite: true,
      scheduled: false,
    },
    {
      id: 4,
      url: "/placeholder.svg?height=300&width=300",
      title: "Gato Astronauta",
      prompt: "Gato astronauta flotando en el espacio con estrellas de fondo",
      date: "2024-01-12",
      tags: ["gato", "espacio", "astronauta"],
      favorite: false,
      scheduled: false,
    },
    {
      id: 5,
      url: "/placeholder.svg?height=300&width=300",
      title: "Logo Geométrico",
      prompt: "Logo minimalista con formas geométricas en azul y blanco",
      date: "2024-01-11",
      tags: ["logo", "geométrico", "minimalista"],
      favorite: false,
      scheduled: true,
    },
    {
      id: 6,
      url: "/placeholder.svg?height=300&width=300",
      title: "Dragón Fantástico",
      prompt: "Dragón majestuoso volando sobre un castillo medieval",
      date: "2024-01-10",
      tags: ["dragón", "fantasía", "medieval"],
      favorite: true,
      scheduled: false,
    },
  ]

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "favorites" && image.favorite) ||
      (selectedFilter === "scheduled" && image.scheduled)

    return matchesSearch && matchesFilter
  })

  const handleSchedulePost = (imageId: number) => {
    const image = images.find(img => img.id === imageId)
    if (image) {
      setSelectedImageForSchedule({
        url: image.url,
        title: image.title
      })
      setSchedulerOpen(true)
    }
  }

  const handleScheduleConfirm = (scheduleData: ScheduleData) => {
    try {
      scheduleImage(
        scheduleData.imageUrl || "",
        scheduleData.imageTitle || "",
        scheduleData.date,
        scheduleData.time,
        scheduleData.caption
      )
      alert("¡Imagen programada exitosamente para WhatsApp!")
    } catch (error) {
      alert("Error al programar la imagen")
    }
  }

  const handleToggleFavorite = (imageId: number) => {
    // Logic to toggle favorite
    console.log(`Toggle favorite for image ${imageId}`)
  }

  return (
    <AppLayout
      title="Galería"
      subtitle={`${filteredImages.length} imágenes`}
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
            <Button
              variant={selectedFilter === "favorites" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("favorites")}
              className="text-xs sm:text-sm"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Favoritas</span>
              <span className="sm:hidden">♥</span>
            </Button>
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
          </div>
        </div>

        {/* Images Grid/List */}
        {filteredImages.length === 0 ? (
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
                          <Button size="sm" variant="secondary">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleToggleFavorite(image.id)}>
                            <Heart className={`h-4 w-4 ${image.favorite ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleSchedulePost(image.id)}>
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {image.scheduled && (
                        <Badge className="absolute top-2 right-2 bg-tertiary-500 hover:bg-tertiary-600">
                          Programada
                        </Badge>
                      )}
                      {image.favorite && (
                        <Heart className="absolute top-2 left-2 h-5 w-5 fill-primary-500 text-primary-500" />
                      )}
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
                      <p className="text-xs text-gray-500">{image.date}</p>
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
                            <p className="text-xs text-gray-500">{image.date}</p>
                          </div>
                          <div className="flex space-x-1 ml-2 sm:ml-4">
                            <Button size="sm" variant="outline" className="hidden sm:flex">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleToggleFavorite(image.id)}>
                              <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${image.favorite ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleSchedulePost(image.id)}>
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="hidden sm:flex">
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
      
      <ImageScheduler
        isOpen={schedulerOpen}
        onOpenChange={setSchedulerOpen}
        imageUrl={selectedImageForSchedule?.url}
        imageTitle={selectedImageForSchedule?.title}
        onSchedule={handleScheduleConfirm}
      />
    </AppLayout>
  )
}
