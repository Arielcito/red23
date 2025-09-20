"use client"

import { useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ReferralInputProps } from '@/lib/types/referrals'

export function ReferralInput({
  onSubmit,
  isLoading = false,
  error,
  placeholder = "Ingresa el código de referido",
  className
}: ReferralInputProps) {
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code.trim()) {
      return
    }

    setIsValidating(true)
    
    try {
      await onSubmit(code.trim().toUpperCase())
    } catch (error) {
      console.error('Error en envío de código:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const formatCode = (value: string) => {
    // Solo permitir letras y números, máximo 8 caracteres
    return value.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 8)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCode = formatCode(e.target.value)
    setCode(formattedCode)
  }

  const isSubmitting = isLoading || isValidating

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg">¿Tienes un código de referido?</CardTitle>
        <CardDescription>
          Ingresa el código para obtener beneficios especiales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral-code">Código de Referido</Label>
            <Input
              id="referral-code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder={placeholder}
              className={cn(
                "font-mono tracking-wider",
                error && "border-red-500 focus-visible:ring-red-500"
              )}
              disabled={isSubmitting}
              autoComplete="off"
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!code.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isValidating ? 'Validando...' : 'Registrando...'}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Aplicar Código
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            El código debe tener entre 6 y 8 caracteres alfanuméricos
          </div>
        </form>
      </CardContent>
    </Card>
  )
}