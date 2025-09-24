"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Share2, Twitter, Facebook, MessageCircle, Link as LinkIcon, Copy } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
  title: string
  url: string
  excerpt?: string
}

export function ShareButtons({ title, url, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  const encodedExcerpt = excerpt ? encodeURIComponent(excerpt) : ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt || title,
          url: url,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground font-medium">Compartir:</span>

      <TooltipProvider>
        {/* Native Share API (if available) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="h-8 px-3"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Compartir</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Twitter */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.twitter, '_blank')}
              className="h-8 px-3"
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Compartir en Twitter</p>
          </TooltipContent>
        </Tooltip>

        {/* Facebook */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.facebook, '_blank')}
              className="h-8 px-3"
            >
              <Facebook className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Compartir en Facebook</p>
          </TooltipContent>
        </Tooltip>

        {/* WhatsApp */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(shareLinks.whatsapp, '_blank')}
              className="h-8 px-3"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Compartir en WhatsApp</p>
          </TooltipContent>
        </Tooltip>

        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 px-3"
            >
              {copied ? (
                <Copy className="h-4 w-4 text-green-600" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? '¡Copiado!' : 'Copiar enlace'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
