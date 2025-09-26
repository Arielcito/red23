/**
 * Componente de prueba para validar la sincronización entre admin y frontend
 * Debe eliminarse después de validar que todo funciona
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTutorialsAdmin } from "@/lib/hooks/useTutorialsAdmin"
import { useLearningPaths } from "@/lib/hooks/useLearningPaths"

export function TestSyncComponent() {
  const { 
    learningPaths: adminPaths, 
    createLearningPath,
    isLoading: adminLoading 
  } = useTutorialsAdmin()
  
  const { 
    learningPaths: publicPaths, 
    refreshLearningPaths,
    isLoading: publicLoading 
  } = useLearningPaths()

  const [testing, setTesting] = useState(false)

  const testSyncronization = async () => {
    setTesting(true)
    try {
      // Crear una ruta de prueba en admin
      console.log('🧪 Creando ruta de prueba...')
      await createLearningPath({
        title: `Test Sync ${Date.now()}`,
        description: 'Ruta de prueba para validar sincronización',
        level: 'Principiante',
        duration: '1 módulo • 5 minutos',
        courseCount: 1,
        icon: '🧪',
        colorScheme: 'primary',
        slug: `test-sync-${Date.now()}`,
        imageUrl: null,
        isFeatured: false,
        isActive: true,
        displayOrder: 999
      })

      // Refrescar datos públicos para ver si aparece
      console.log('🔄 Refrescando datos públicos...')
      await refreshLearningPaths()

      console.log('✅ Test de sincronización completado')
    } catch (error) {
      console.error('❌ Error en test de sincronización:', error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="border-2 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">🧪 Test de Sincronización</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Admin Hook</h4>
            <p className="text-sm text-muted-foreground">
              {adminLoading ? 'Cargando...' : `${adminPaths.length} rutas cargadas`}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Público Hook</h4>
            <p className="text-sm text-muted-foreground">
              {publicLoading ? 'Cargando...' : `${publicPaths.length} rutas cargadas`}
            </p>
          </div>
        </div>

        <Button 
          onClick={testSyncronization}
          disabled={testing || adminLoading || publicLoading}
          className="w-full"
        >
          {testing ? 'Probando sincronización...' : 'Probar Sincronización'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Este botón crea una ruta de prueba y verifica que aparezca en ambos hooks.
          Revisar la consola para logs detallados.
        </p>
      </CardContent>
    </Card>
  )
}