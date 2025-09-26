"use client"

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  X, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReferralCodeEditorProps } from '@/lib/types/referrals'
import { useReferralCodeEditor } from '@/lib/hooks/useReferralCodeEditor'

export function ReferralCodeEditor({
  currentCode,
  onSave,
  onCancel,
  isOpen,
  isLoading = false,
  className
}: ReferralCodeEditorProps) {
  const {
    newCode,
    isValidating,
    isSaving,
    validationError,
    isAvailable,
    suggestions,
    setNewCode,
    saveCode,
    checkAvailability
  } = useReferralCodeEditor({
    currentCode,
    onCodeUpdated: (code) => onSave(code)
  })

  const [localCode, setLocalCode] = useState('')

  // Sincronizar código local con el estado del hook
  useEffect(() => {
    if (isOpen) {
      setLocalCode(currentCode)
      setNewCode(currentCode)
    }
  }, [isOpen, currentCode, setNewCode])

  const handleCodeChange = (value: string) => {
    const cleanCode = value.toUpperCase().replace(/[^A-Z0-9_-]/g, '')
    setLocalCode(cleanCode)
    setNewCode(cleanCode)
  }

  const handleSave = async () => {
    const success = await saveCode()
    if (success) {
      onCancel() // Cerrar modal después de guardar exitosamente
    }
  }

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    }
    if (!localCode || localCode === currentCode) {
      return null
    }
    if (validationError) {
      return <X className="h-4 w-4 text-red-500" />
    }
    if (isAvailable === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    if (isAvailable === false) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    return null
  }

  const getValidationMessage = () => {
    if (!localCode || localCode === currentCode) {
      return null
    }
    if (isValidating) {
      return { type: 'info', message: 'Verificando disponibilidad...' }
    }
    if (validationError) {
      return { type: 'error', message: validationError }
    }
    if (isAvailable === true) {
      return { type: 'success', message: '¡Código disponible!' }
    }
    return null
  }

  const canSave = localCode && 
                 localCode !== currentCode && 
                 isAvailable === true && 
                 !isValidating && 
                 !isSaving

  const validationMessage = getValidationMessage()

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <DialogTitle>Personalizar Código de Referido</DialogTitle>
          <DialogDescription>
            Cambia tu código de referido por uno que sea más fácil de recordar y compartir.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de entrada */}
          <div className="space-y-2">
            <Label htmlFor="referral-code">Nuevo código de referido</Label>
            <div className="relative">
              <Input
                id="referral-code"
                value={localCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="MI-CODIGO-123"
                maxLength={15}
                className={cn(
                  "pr-10 font-mono text-lg tracking-wider uppercase",
                  validationError && "border-red-500 focus:border-red-500",
                  isAvailable === true && "border-green-500 focus:border-green-500"
                )}
                disabled={isLoading || isSaving}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getValidationIcon()}
              </div>
            </div>
            
            {/* Contador de caracteres */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3-15 caracteres (letras, números, - y _)</span>
              <span>{localCode.length}/15</span>
            </div>
          </div>

          {/* Mensaje de validación */}
          {validationMessage && (
            <Card className={cn(
              "p-3",
              validationMessage.type === 'error' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
              validationMessage.type === 'success' && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
              validationMessage.type === 'info' && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
            )}>
              <div className="flex items-center gap-2">
                {validationMessage.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                {validationMessage.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {validationMessage.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                <div className="text-sm">
                  {validationMessage.message}
                </div>
              </div>
            </Card>
          )}

          {/* Sugerencias */}
          {suggestions.length > 0 && (
            <Card className="p-3 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sugerencias:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestions.map((suggestion, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900"
                        onClick={() => handleCodeChange(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Información del código actual */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Código actual:</div>
            <div className="font-mono text-lg font-bold">{currentCode}</div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="min-w-[100px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}