"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, CheckCircle2, AlertCircle, X, FileImage } from "lucide-react"
import { useImageUpload } from "@/lib/hooks/useImageUpload"
import Image from "next/image"

interface UploadFormProps {
  userEmail: string
}

interface FilePreview {
  file: File
  preview: string
  id: string
}

interface UploadedImage {
  id: number | string
  filename: string
  url: string
  size: number
  type: string
  created_at?: string
}

export function UploadForm({ userEmail }: UploadFormProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [lastUploadMessage, setLastUploadMessage] = useState<string | null>(null)
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)

  const { uploadImages, isUploading, error, clearError } = useImageUpload()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Create file previews
  const createFilePreviews = useCallback((incomingFiles: FileList | File[]) => {
    const imageFiles = Array.from(incomingFiles).filter((file) => file.type.startsWith("image/"))
    
    const newPreviews: FilePreview[] = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`
    }))

    setFilePreviews(prev => [...prev, ...newPreviews])
  }, [])

  // Remove file preview
  const removeFilePreview = useCallback((id: string) => {
    setFilePreviews(prev => {
      const preview = prev.find(p => p.id === id)
      if (preview) {
        URL.revokeObjectURL(preview.preview)
      }
      return prev.filter(p => p.id !== id)
    })
  }, [])

  // Clear all previews
  const clearAllPreviews = useCallback(() => {
    filePreviews.forEach(preview => {
      URL.revokeObjectURL(preview.preview)
    })
    setFilePreviews([])
  }, [filePreviews])

  // Format file size
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const processUpload = useCallback(async () => {
    if (!filePreviews.length) {
      return
    }

    if (!userEmail) {
      console.error("❌ No se encontró email de usuario al intentar subir imágenes")
      return
    }

    clearError()
    setUploadSuccess(false)
    setLastUploadMessage(null)
    setUploadProgress(0)

    const filesToUpload = filePreviews.map(preview => preview.file)

    console.log("🚀 Iniciando upload a Supabase Storage", {
      filesCount: filesToUpload.length,
      userEmail
    })

    // Simulate progress during upload
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    const result = await uploadImages({
      files: filesToUpload,
      user_email: userEmail
    })

    clearInterval(progressInterval)
    setUploadProgress(100)

    if (result.success) {
      const message = result.data?.message ?? `Se subieron ${filesToUpload.length} imagen${filesToUpload.length !== 1 ? "es" : ""}`
      console.log("🎉 Upload completado", { message })
      
      setUploadSuccess(true)
      setLastUploadMessage(message)
      
      // Store uploaded images info
      if (result.data?.images) {
        setUploadedImages(result.data.images)
      }
      
      // Clear previews after successful upload
      clearAllPreviews()
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0)
      }, 2000)
    }
  }, [filePreviews, clearError, uploadImages, userEmail, clearAllPreviews])

  const addFiles = useCallback((incomingFiles: FileList | File[]) => {
    const imageFiles = Array.from(incomingFiles).filter((file) => file.type.startsWith("image/"))

    if (!imageFiles.length) {
      return
    }

    createFilePreviews(imageFiles)
  }, [createFilePreviews])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files)
      e.target.value = ""
    }
  }, [addFiles])

  const handleFileSelectionClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }, [isUploading])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mensaje de éxito */}
      {uploadSuccess && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium">{lastUploadMessage ?? "¡Imágenes subidas exitosamente!"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje de error */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Subiendo imágenes a Supabase Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Previews */}
      {filePreviews.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Archivos Seleccionados</CardTitle>
                <CardDescription>
                  {filePreviews.length} imagen{filePreviews.length !== 1 ? 'es' : ''} lista{filePreviews.length !== 1 ? 's' : ''} para subir
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllPreviews}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
                <Button 
                  onClick={processUpload} 
                  disabled={isUploading || filePreviews.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filePreviews.map((preview) => (
                <div key={preview.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={preview.preview}
                      alt={preview.file.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => removeFilePreview(preview.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  {/* File info */}
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium truncate" title={preview.file.name}>
                      {preview.file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {preview.file.type.split('/')[1].toUpperCase()}
                      </Badge>
                      <span>{formatFileSize(preview.file.size)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Imágenes</CardTitle>
          <CardDescription>
            Arrastra y suelta tus imágenes aquí o haz clic para seleccionarlas. Se guardarán en Supabase Storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
              dragActive
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            aria-busy={isUploading}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  Arrastra tus imágenes aquí
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  o haz clic para seleccionarlas. Podrás previsualizarlas antes de subirlas a Supabase.
                </p>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFileSelectionClick}
                  className="bg-transparent border-secondary-300 text-secondary-600 hover:bg-secondary-50"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Seleccionar Archivos
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Formatos soportados: JPG, PNG, GIF, WebP (máx. 10MB cada una)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recently Uploaded Images */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Imágenes Subidas Recientemente</CardTitle>
            <CardDescription>
              Estas imágenes han sido guardadas en Supabase Storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {uploadedImages.map((image) => (
                <div key={image.id} className="space-y-2">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={image.url}
                      alt={image.filename}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {image.type.split('/')[1].toUpperCase()}
                      </Badge>
                      <span>{formatFileSize(image.size)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Subida a Supabase</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
