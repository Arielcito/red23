"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, RefreshCw, Users, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReferralSetupProps {
  isSettingUp: boolean
  hasSetupError: boolean
  error: string | null
  onRetry: () => void
  className?: string
}

export function ReferralSetup({ 
  isSettingUp, 
  hasSetupError, 
  error, 
  onRetry,
  className 
}: ReferralSetupProps) {
  if (isSettingUp) {
    return (
      <Card className={cn('max-w-md mx-auto', className)}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Users className="h-16 w-16 text-primary" />
              <Loader2 className="h-6 w-6 text-primary animate-spin absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-xl">Configurando tu Sistema de Referidos</CardTitle>
          <CardDescription>
            Estamos generando tu código único de referido...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-center w-6 h-6">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300">Generando código único...</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg opacity-50">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs">2</span>
              </div>
              <span className="text-sm text-muted-foreground">Configurando estadísticas</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg opacity-50">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs">3</span>
              </div>
              <span className="text-sm text-muted-foreground">Finalizando configuración</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Este proceso solo toma unos segundos...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (hasSetupError) {
    return (
      <Card className={cn('max-w-md mx-auto border-red-200 dark:border-red-800', className)}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-xl text-red-700 dark:text-red-400">
            Error en Configuración
          </CardTitle>
          <CardDescription>
            No pudimos configurar tu sistema de referidos
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">
              {error || 'Error desconocido durante la configuración'}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Puedes intentar nuevamente o contactar soporte si el problema persiste.
            </p>
            
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar Nuevamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Estado de éxito (se muestra brevemente antes de cargar el dashboard)
  return (
    <Card className={cn('max-w-md mx-auto border-green-200 dark:border-green-800', className)}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-xl text-green-700 dark:text-green-400">
          ¡Sistema Configurado!
        </CardTitle>
        <CardDescription>
          Tu código de referido está listo para usar
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Código único generado
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Sistema activado
            </span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Cargando tu dashboard de referidos...
        </p>
        
        <div className="flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}