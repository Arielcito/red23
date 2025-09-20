"use client"

import { AppLayout } from "@/components/layout/AppLayout"
import { UploadForm } from "./components/UploadForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/hooks/useUser"
import { Loader2 } from "lucide-react"

export default function UploadPage() {
  const { user, isLoading } = useUser()
  const userEmail = user?.email ?? ""

  return (
    <AppLayout
      title="Subir Imágenes"
      subtitle="Añade tus propias imágenes a la galería"
      showBackButton={true}
      backHref="/dashboard"
    >
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center space-x-3 py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cargando tu información...</p>
            </CardContent>
          </Card>
        ) : userEmail ? (
          <UploadForm userEmail={userEmail} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Inicia sesión para subir imágenes</CardTitle>
              <CardDescription>Necesitamos tu cuenta de Clerk para asociar las imágenes que subas.</CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Consejos para mejores resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
    </AppLayout>
  )
}
