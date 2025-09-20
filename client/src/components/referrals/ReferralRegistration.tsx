"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useReferrals } from '@/lib/hooks/useReferrals'
import { ReferralInput } from './ReferralInput'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReferralRegistrationProps {
  onComplete?: (success: boolean) => void
  onSkip?: () => void
  className?: string
  autoRegister?: boolean
}

export function ReferralRegistration({
  onComplete,
  onSkip,
  className,
  autoRegister = true
}: ReferralRegistrationProps) {
  const { user, isAuthenticated } = useAuth()
  const { registerWithReferral } = useReferrals()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [skipped, setSkipped] = useState(false)

  // Auto-registrar usuario sin código de referido al cargar
  useEffect(() => {
    if (autoRegister && isAuthenticated && user?.id && !success && !skipped) {
      handleAutoRegister()
    }
  }, [autoRegister, isAuthenticated, user?.id, success, skipped])

  const handleAutoRegister = async () => {
    try {
      console.log('[ReferralRegistration] Auto-registrando usuario sin código')
      const result = await registerWithReferral()
      if (result) {
        setSuccess(true)
        onComplete?.(true)
      }
    } catch (error) {
      console.error('[ReferralRegistration] Error en auto-registro:', error)
    }
  }

  const handleSubmit = async (referralCode: string) => {
    if (!user?.id) {
      setError('Usuario no encontrado')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      console.log('[ReferralRegistration] Registrando con código:', referralCode)
      
      const result = await registerWithReferral(referralCode || undefined)
      
      if (result) {
        setSuccess(true)
        onComplete?.(true)
      } else {
        setError('Error al registrar el código de referido')
      }
    } catch (error) {
      console.error('[ReferralRegistration] Error registrando:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    setSkipped(true)
    onSkip?.()
    onComplete?.(false)
  }

  if (!isAuthenticated || !user?.id) {
    return null
  }

  if (success) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">¡Registro Exitoso!</CardTitle>
          <CardDescription>
            Tu cuenta ha sido configurada en el sistema de referidos
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Ya puedes empezar a compartir tu código de referido y ganar recompensas
          </p>
        </CardContent>
      </Card>
    )
  }

  if (skipped) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      <ReferralInput
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={error || undefined}
        placeholder="Código de referido (opcional)"
      />
      
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-sm"
        >
          <X className="h-4 w-4 mr-2" />
          Continuar sin código
        </Button>
      </div>
    </div>
  )
}