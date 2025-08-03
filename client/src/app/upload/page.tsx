"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, ImageIcon, X, Calendar } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logic to upload files and save metadata
    console.log("Uploading files:", uploadedFiles)
    console.log("Metadata:", { title, description, tags })
    alert("Imágenes subidas exitosamente!")
  }

  const handleSchedulePost = (file: File) => {
    alert(`Imagen ${file.name} programada para WhatsApp!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subir Imágenes</h1>
              <p className="text-gray-600 dark:text-gray-300">Añade tus propias imágenes a la galería</p>
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Imágenes</CardTitle>
            <CardDescription>Arrastra y suelta tus imágenes aquí o haz clic para seleccionar</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-primary-500" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Arrastra tus imágenes aquí</p>
                  <p className="text-gray-600 dark:text-gray-300">o haz clic para seleccionar archivos</p>
                </div>
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outline"
                      className="cursor-pointer bg-transparent border-secondary-300 text-secondary-600 hover:bg-secondary-50"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Seleccionar Archivos
                    </Button>
                  </label>
                </div>
                <p className="text-sm text-gray-500">Formatos soportados: JPG, PNG, GIF, WebP (máx. 10MB cada una)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Imágenes Seleccionadas ({uploadedFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => handleSchedulePost(file)}>
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata Form */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Información de las Imágenes</CardTitle>
              <CardDescription>
                Añade títulos, descripciones y etiquetas para organizar mejor tus imágenes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título (opcional)</Label>
                      <Input
                        id="title"
                        placeholder="Ej: Paisajes de montaña"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción (opcional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe el contenido de las imágenes..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tags">Etiquetas (opcional)</Label>
                      <Input
                        id="tags"
                        placeholder="paisaje, naturaleza, montaña"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-600 mt-1">Separa las etiquetas con comas</p>
                    </div>

                    <div className="space-y-3">
                      <Label>Opciones adicionales</Label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Añadir a favoritas</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Programar para WhatsApp</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Hacer públicas en galería</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setUploadedFiles([])}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir {uploadedFiles.length} imagen{uploadedFiles.length !== 1 ? "es" : ""}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Consejos para mejores resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Calidad de imagen</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Usa imágenes de alta resolución (mín. 1024x1024)</li>
                  <li>• Evita imágenes borrosas o pixeladas</li>
                  <li>• Formatos JPG y PNG funcionan mejor</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Organización</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Usa etiquetas descriptivas</li>
                  <li>• Agrupa imágenes similares</li>
                  <li>• Añade descripciones detalladas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
