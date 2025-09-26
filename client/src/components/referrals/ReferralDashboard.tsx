"use client"

import { useReferralsWithAutoSetup } from '@/lib/hooks/useReferralsWithAutoSetup'
import { ReferralCodeDisplay } from './ReferralCodeDisplay'
import { ReferralStats } from './ReferralStats'
import { ReferralList } from './ReferralList'
import { ReferralSetup } from './ReferralSetup'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReferralDashboardProps {
  className?: string
}

export function ReferralDashboard({ className }: ReferralDashboardProps) {
  const {
    stats,
    myReferrals,
    isLoading,
    isSettingUp,
    hasSetupError,
    error,
    refreshStats,
    retrySetup
  } = useReferralsWithAutoSetup()

  console.log('📊 ReferralDashboard state:', {
    isLoading,
    isSettingUp,
    hasSetupError,
    hasStats: !!stats
  })

  const handleRefresh = async () => {
    await refreshStats()
  }

  // Mostrar componente de setup durante configuración inicial o errores
  if (isSettingUp || hasSetupError) {
    return (
      <div className={cn('flex items-center justify-center min-h-[50vh]', className)}>
        <ReferralSetup
          isSettingUp={isSettingUp}
          hasSetupError={hasSetupError}
          error={error}
          onRetry={retrySetup}
        />
      </div>
    )
  }

  // Error general (después de setup exitoso)
  if (error && !stats && !isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Error en Sistema de Referidos
          </CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Referidos</h2>
          <p className="text-muted-foreground">
            Refiere amigos y gana recompensas especiales
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Actualizar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Código de referido */}
        <ReferralCodeDisplay 
          code={stats?.myReferralCode || ''}
          onCopy={() => console.log('Código copiado')}
          onCodeUpdated={(newCode) => {
            console.log('Código actualizado:', newCode)
            refreshStats() // Refrescar datos después de actualizar el código
          }}
        />

        {/* Lista de referidos */}
        <ReferralList 
          referrals={myReferrals}
          isLoading={isLoading}
        />
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">¿Cómo funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-2">1️⃣</div>
              <h4 className="font-semibold mb-1">Comparte tu código</h4>
              <p className="text-sm text-muted-foreground">
                Envía tu código único a tus amigos
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-2">2️⃣</div>
              <h4 className="font-semibold mb-1">Ellos se registran</h4>
              <p className="text-sm text-muted-foreground">
                Usan tu código al crear su cuenta
              </p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl mb-2">3️⃣</div>
              <h4 className="font-semibold mb-1">Ganas recompensas</h4>
              <p className="text-sm text-muted-foreground">
                Obtienes beneficios por cada referido exitoso
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}