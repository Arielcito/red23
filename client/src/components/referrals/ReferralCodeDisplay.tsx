"use client"

import { useState } from 'react'
import { Copy, Check, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ReferralCodeDisplayProps } from '@/lib/types/referrals'

export function ReferralCodeDisplay({ 
  code, 
  onCopy, 
  className 
}: ReferralCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const referralUrl = `${window.location.origin}/login?referral=${code}`
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      onCopy?.()

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Error copiando URL de referido:', error)
    }
  }

  const handleShare = async () => {
    const shareText = `¡Únete a Red23 con mi código de referido: ${code}!`
    const shareUrl = `${window.location.origin}/login?referral=${code}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Únete a Red23 - Código de Referido',
          text: shareText,
          url: shareUrl
        })
      } catch (error) {
        console.error('Error compartiendo:', error)
        // En caso de error, copiamos el link completo al portapapeles
        try {
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
          setCopied(true)
          onCopy?.()
          setTimeout(() => setCopied(false), 2000)
        } catch (clipboardError) {
          console.error('Error copiando al portapapeles:', clipboardError)
        }
      }
    } else {
      // Si no hay API de share nativa, copiamos el link completo
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        setCopied(true)
        onCopy?.()
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Error copiando link:', error)
      }
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Tu Enlace de Referido</CardTitle>
        <CardDescription>
          Comparte este enlace con tus amigos para ganar recompensas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-lg border-2 border-dashed border-primary/20">
            <span className="text-3xl font-mono font-bold text-primary tracking-wider">
              {code}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleCopy}
            variant="outline" 
            className="flex-1"
            disabled={!code}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Enlace
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleShare}
            variant="default" 
            className="flex-1"
            disabled={!code}
          >
            <Share className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          Cada referido exitoso te dará recompensas especiales
        </div>
      </CardContent>
    </Card>
  )
}