import { useEffect, useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Send, Upload, X } from "lucide-react"
import { useUserLogo } from "@/lib/hooks/useUserLogo"
import { useUser } from "@/lib/hooks/useUser"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isGenerating: boolean
  quickPrompts: string[]
  onQuickPrompt: (prompt: string) => void
  logoUrl: string
  onLogoUrlChange: (value: string) => void
  logoPosition: string
  onLogoPositionChange: (value: string) => void
  aspectRatio: "9:16" | "16:9" | "1:1"
  onAspectRatioChange: (value: "9:16" | "16:9" | "1:1") => void
}

export const ChatInput = ({
  value,
  onChange,
  onSend,
  isGenerating,
  quickPrompts,
  onQuickPrompt,
  logoUrl,
  onLogoUrlChange,
  logoPosition,
  onLogoPositionChange,
  aspectRatio,
  onAspectRatioChange,
}: ChatInputProps) => {
  const [logoOptionsOpen, setLogoOptionsOpen] = useState(() => Boolean(logoUrl || logoPosition))
  const [useManualUrl, setUseManualUrl] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { logo, uploadLogo, deleteLogo, error: logoError } = useUserLogo()
  const { user } = useUser()

  useEffect(() => {
    if (logo && !useManualUrl) {
      onLogoUrlChange(logo.logo_url)
    }
  }, [logo, useManualUrl, onLogoUrlChange])

  useEffect(() => {
    if (!logoUrl && !logoPosition) {
      setLogoOptionsOpen(false)
    }
  }, [logoUrl, logoPosition])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.email) return

    try {
      setIsUploadingLogo(true)
      await uploadLogo(file, user.email)
      setUseManualUrl(false)
    } catch (error) {
      console.error('Error subiendo logo:', error)
    } finally {
      setIsUploadingLogo(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteLogo = async () => {
    try {
      setIsUploadingLogo(true)
      await deleteLogo()
      onLogoUrlChange('')
      setUseManualUrl(false)
    } catch (error) {
      console.error('Error eliminando logo:', error)
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const logoPositions = Array.from({ length: 9 }, (_, index) => (index + 1).toString())
  const aspectRatioOptions = [
    { value: "1:1" as const, label: "Cuadrado (1:1)" },
    { value: "9:16" as const, label: "Vertical (9:16)" },
    { value: "16:9" as const, label: "Horizontal (16:9)" }
  ]
  const requiresFullLogoInfo = (logoOptionsOpen || logoUrl || logoPosition)

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-3">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              onClick={() => onQuickPrompt(prompt)}
              className="whitespace-nowrap text-xs"
            >
              {prompt}
            </Button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Opciones del logo
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[10px]"
            onClick={() => setLogoOptionsOpen((open) => !open)}
          >
            {logoOptionsOpen ? "Ocultar" : "Agregar logo (opcional)"}
          </Button>
        </div>
        {logoOptionsOpen && (
          <div className="space-y-4">
            {logoError && (
              <div className="text-[10px] text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                {logoError}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Logo del casino
                  </Label>
                  {logo && !useManualUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[10px] h-6 px-2"
                      onClick={() => setUseManualUrl(true)}
                    >
                      Usar URL manual
                    </Button>
                  )}
                </div>

                {!useManualUrl && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {!logo ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingLogo}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploadingLogo ? 'Subiendo...' : 'Subir mi logo'}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                          <img
                            src={logo.logo_url}
                            alt="Tu logo"
                            className="max-h-16 max-w-full object-contain mx-auto"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="flex-1"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Cambiar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteLogo}
                            disabled={isUploadingLogo}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {useManualUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="url"
                        placeholder="https://tucasino.com/logo.png"
                        value={logoUrl}
                        onChange={(e) => onLogoUrlChange(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUseManualUrl(false)
                          if (logo) {
                            onLogoUrlChange(logo.logo_url)
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {logoUrl && (
                      <div className="mt-2">
                        <div className="text-[10px] text-muted-foreground mb-1">Previsualización:</div>
                        <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                          <img
                            src={logoUrl}
                            alt="Preview del logo"
                            className="max-h-16 max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                          <div className="hidden text-[10px] text-red-500">No se pudo cargar la imagen</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Posición del logo (1-9)
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {logoPositions.map((position) => (
                    <Button
                      key={position}
                      type="button"
                      variant={logoPosition === position ? "default" : "outline"}
                      onClick={() => onLogoPositionChange(position)}
                      className={cn(
                        "h-9",
                        logoPosition === position && "shadow-md"
                      )}
                    >
                      {position}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Tamaño de imagen
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Relación de aspecto
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {aspectRatioOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={aspectRatio === option.value ? "default" : "outline"}
                onClick={() => onAspectRatioChange(option.value)}
                className={cn(
                  "h-10 text-[10px]",
                  aspectRatio === option.value && "shadow-md"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe la imagen promocional de casino que quieres generar..."
            className="flex-1 resize-none text-[10px]"
            rows={2}
            onKeyPress={handleKeyPress}
          />
          <Button
            onClick={onSend}
            disabled={Boolean(
              !value.trim() ||
              isGenerating ||
              (requiresFullLogoInfo && (!logoUrl.trim() || !logoPosition))
            )
            }
            className="px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
