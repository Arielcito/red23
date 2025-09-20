"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, CheckCircle2, AlertCircle } from "lucide-react"
import { useImageUpload } from "@/lib/hooks/useImageUpload"

interface UploadFormProps {
  userEmail: string
}

export function UploadForm({ userEmail }: UploadFormProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [lastUploadMessage, setLastUploadMessage] = useState<string | null>(null)

  const { uploadImages, isUploading, error, clearError } = useImageUpload()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const processUpload = useCallback(async (incomingFiles: FileList | File[]) => {
    const imageFiles = Array.from(incomingFiles).filter((file) => file.type.startsWith("image/"))

    if (!imageFiles.length) {
      return
    }

    if (!userEmail) {
      console.error("❌ No se encontró email de usuario al intentar subir imágenes")
      return
    }

    clearError()
    setUploadSuccess(false)
    setLastUploadMessage(null)

    console.log("🚀 Iniciando upload directo", {
      filesCount: imageFiles.length,
      userEmail
    })

    const result = await uploadImages({
      files: imageFiles,
      user_email: userEmail
    })

    if (result.success) {
      const message = result.data?.message ?? `Se subieron ${imageFiles.length} imagen${imageFiles.length !== 1 ? "es" : ""}`
      console.log("🎉 Upload directo completado", { message })
      setUploadSuccess(true)
      setLastUploadMessage(message)
    }
  }, [clearError, uploadImages, userEmail])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      void processUpload(e.dataTransfer.files)
    }
  }, [processUpload])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void processUpload(e.target.files)
      e.target.value = ""
    }
  }, [processUpload])

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

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Imágenes</CardTitle>
          <CardDescription>
            Arrastra y suelta tus imágenes aquí o haz clic para seleccionarlas; las subiremos de inmediato
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
                  o haz clic para seleccionarlas y subiremos todo automáticamente
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
    </div>
  )
}
