"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { useAdminRewardsSettings, RewardsBannerSettings, RewardsBannerTheme } from "@/lib/hooks/useAdminRewardsSettings"
import { RewardsBanner } from "@/components/rewards/RewardsBanner"
import { AlertTriangle, Loader2, Paintbrush, Calendar, DollarSign, Image as ImageIcon, HelpCircle } from "lucide-react"
import Image from "next/image"
import { convertDriveUrlToDirect, isValidImageUrl } from "@/lib/utils"

const THEME_OPTIONS: { value: RewardsBannerTheme; label: string; description: string }[] = [
  { value: "emerald", label: "Esmeralda", description: "Ideal para destacar premios principales" },
  { value: "indigo", label: "Índigo", description: "Resalta lanzamientos o anuncios especiales" },
  { value: "amber", label: "Ámbar", description: "Perfecto para promociones urgentes" }
]

export default function AdminRewardsPage() {
  const { settings, updateSettings, resetSettings, isLoaded, error } = useAdminRewardsSettings()
  const [formState, setFormState] = useState<RewardsBannerSettings>(() => ({
    ...settings,
    theme: settings.theme && ['emerald', 'indigo', 'amber'].includes(settings.theme) ? settings.theme : 'emerald',
    useImage: settings.useImage ?? false
  }))
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  console.log('⚙️ Admin rewards page loaded:', { isLoaded, hasError: !!error })

  useEffect(() => {
    console.log('🔄 Updating formState from settings:', settings)
    console.log('🎨 Theme in settings:', settings.theme, 'Type:', typeof settings.theme)

    // Ensure theme always has a valid value
    const safeSettings = {
      ...settings,
      theme: settings.theme && ['emerald', 'indigo', 'amber'].includes(settings.theme) ? settings.theme : 'emerald'
    }

    console.log('🛡️ Safe settings after theme validation:', safeSettings)

    setFormState(safeSettings)
    setHasChanges(false)
  }, [settings])

  // Helper functions to convert between Date objects and ISO strings
  const isoStringToDate = (isoString: string | null | undefined): Date | undefined => {
    return isoString ? new Date(isoString) : undefined
  }

  // Safe conversion that ensures we always return string | null
  const safeDateToISOString = (date: Date | undefined): string | null => {
    if (!date) {
      return null
    }
    try {
      const isoString = date.toISOString()
      return typeof isoString === 'string' ? isoString : null
    } catch {
      return null
    }
  }

  // Wrapper that guarantees string | null type
  const ensureStringOrNull = (value: string | null | undefined): string | null => {
    return value ?? null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    console.log('🔥 Submitting form with current formState:', formState)
    console.log('🎨 Current theme value:', formState.theme, 'Type:', typeof formState.theme)

    setIsSaving(true)
    try {
      await updateSettings(formState)
      console.log('✅ Form submission successful')
    } catch (error) {
      console.error('❌ Form submission failed:', error)
    } finally {
      setIsSaving(false)
      setHasChanges(false)
    }
  }

  const handleReset = async () => {
    await resetSettings()
  }

  const handleChange = <Key extends keyof RewardsBannerSettings>(field: Key, value: RewardsBannerSettings[Key] | null | undefined) => {
    console.log(`🔄 Changing field '${field}' from:`, formState[field], 'to:', value, 'Type:', typeof value)

    let processedValue: RewardsBannerSettings[Key] | null = value ?? null

    // Special handling for theme field - ensure it's always valid
    if (field === 'theme') {
      const themeValue = (value && ['emerald', 'indigo', 'amber'].includes(value as string))
        ? value as RewardsBannerTheme
        : 'emerald'
      processedValue = themeValue as RewardsBannerSettings[Key]
      console.log(`🎨 Theme processed from '${value}' to '${processedValue}'`)
    }

    setFormState((prev) => {
      const newState = { ...prev, [field]: processedValue }
      console.log(`📝 New formState after change:`, newState)
      return newState
    })
    setHasChanges(true)
  }

  if (!isLoaded) {
    return (
      <AppLayout title="Configuración de Premios" subtitle="Personaliza la comunicación del programa">
        <div className="p-6">
          <Card>
            <CardContent className="flex items-center gap-3 p-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Cargando configuración...</span>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Configuración de Premios"
      subtitle="Gestiona el banner destacado en la sección de premios"
      badge={{
        text: "Admin",
        variant: "secondary",
        className: "text-xs"
      }}
    >
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>Estado del banner</CardTitle>
            <CardDescription>
              Activa o desactiva el banner destacado y personaliza su contenido para las nuevas promociones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Label htmlFor="banner-enabled" className="text-base">
                    Banner activo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cuando está activo, el banner aparece en la parte superior de la sección de premios.
                  </p>
                </div>
                <Switch
                  id="banner-enabled"
                  checked={formState.enabled}
                  onCheckedChange={(checked) => handleChange("enabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Label htmlFor="use-image" className="text-base">
                    Usar solo imagen
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activa para mostrar SOLO la imagen sin textos ni botones.
                  </p>
                </div>
                <Switch
                  id="use-image"
                  checked={formState.useImage}
                  onCheckedChange={(checked) => handleChange("useImage", checked)}
                />
              </div>

              {formState.useImage ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="banner-image-url" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      URL de la imagen
                    </Label>
                    <Input
                      id="banner-image-url"
                      value={formState.imageUrl || ''}
                      onChange={(event) => {
                        const url = event.target.value
                        // Convertir automáticamente enlaces de Google Drive
                        const convertedUrl = convertDriveUrlToDirect(url)
                        handleChange("imageUrl", convertedUrl)
                      }}
                      placeholder="https://drive.google.com/uc?export=view&id=ABC123 o https://ejemplo.com/imagen.jpg"
                      type="url"
                      required
                    />
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        La imagen se mostrará en tamaño completo. Recomendado: 1200x400px o similar.
                      </p>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          📁 ¿Cómo obtener enlaces de Google Drive?
                        </summary>
                        <div className="mt-2 space-y-1 pl-2 border-l-2 border-muted">
                          <p>1. Sube tu imagen a Google Drive</p>
                          <p>2. Haz clic derecho en la imagen → "Obtener enlace"</p>
                          <p>3. Copia el enlace y pégalo aquí</p>
                          <p className="text-amber-600">✅ El enlace se convertirá automáticamente al formato correcto</p>
                        </div>
                      </details>
                      {formState.imageUrl && !isValidImageUrl(formState.imageUrl) && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          URL no válida. Usa enlaces de Google Drive, Imgur, Unsplash u otros servicios permitidos.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="banner-cta-url">Enlace al hacer clic (opcional)</Label>
                    <Input
                      id="banner-cta-url"
                      value={formState.ctaUrl}
                      onChange={(event) => handleChange("ctaUrl", event.target.value)}
                      placeholder="https:// o #seccion"
                    />
                    <p className="text-xs text-muted-foreground">
                      Si agregas un enlace, la imagen completa será clickeable.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="banner-title">Título</Label>
                      <Input
                        id="banner-title"
                        value={formState.title}
                        onChange={(event) => handleChange("title", event.target.value)}
                        placeholder="Título del banner"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="banner-theme" className="flex items-center gap-2">
                        <Paintbrush className="h-4 w-4" />
                        Estilo visual
                      </Label>
                      <Select
                        value={formState.theme || 'emerald'}
                        onValueChange={(value: RewardsBannerTheme) => handleChange("theme", value)}
                      >
                        <SelectTrigger id="banner-theme">
                          <SelectValue placeholder="Selecciona un estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          {THEME_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground">{option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="banner-description">Descripción</Label>
                    <Textarea
                      id="banner-description"
                      rows={3}
                      value={formState.description}
                      onChange={(event) => handleChange("description", event.target.value)}
                      placeholder="Mensaje descriptivo para el banner"
                    />
                  </div>

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="banner-cta-label">Texto del botón</Label>
                      <Input
                        id="banner-cta-label"
                        value={formState.ctaLabel}
                        onChange={(event) => handleChange("ctaLabel", event.target.value)}
                        placeholder="Ej: Conoce más"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="banner-cta-url">Enlace</Label>
                      <Input
                        id="banner-cta-url"
                        value={formState.ctaUrl}
                        onChange={(event) => handleChange("ctaUrl", event.target.value)}
                        placeholder="https:// o #seccion"
                      />
                    </div>
                  </div>

                  {!formState.ctaLabel && formState.ctaUrl && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Agrega un texto para el botón si muestras un enlace.</span>
                    </div>
                  )}
                </>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Configuración de Premios
            </CardTitle>
            <CardDescription>
              Personaliza los montos de los premios y configura fechas específicas para los sorteos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="daily-prize-amount">Premio semanal</Label>
                  <Input
                    id="daily-prize-amount"
                    value={formState.dailyPrizeAmount}
                    onChange={(event) => handleChange("dailyPrizeAmount", event.target.value)}
                    placeholder="Ej: $500 - $1,500 USD"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-prize-amount">Premio Mensual</Label>
                  <Input
                    id="monthly-prize-amount"
                    value={formState.monthlyPrizeAmount}
                    onChange={(event) => handleChange("monthlyPrizeAmount", event.target.value)}
                    placeholder="Ej: $5,000 - $15,000 USD"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Label htmlFor="custom-dates" className="text-base">
                    Fechas personalizadas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activa para configurar fechas específicas de sorteo en lugar del cálculo automático.
                  </p>
                </div>
                <Switch
                  id="custom-dates"
                  checked={formState.useCustomDates}
                  onCheckedChange={(checked) => handleChange("useCustomDates", checked)}
                />
              </div>

              {formState.useCustomDates && (
                <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    <span>Fechas de Sorteo</span>
                  </div>
                  
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Próximo Sorteo Diario</Label>
                      <DateTimePicker
                        date={isoStringToDate(formState.dailyPrizeDrawDate)}
                        onDateChange={(date) => {
                          (handleChange as any)("dailyPrizeDrawDate", safeDateToISOString(date))
                        }}
                        placeholder="Seleccionar fecha y hora"
                        minDate={new Date()}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Próximo Sorteo Mensual</Label>
                      <DateTimePicker
                        date={isoStringToDate(formState.monthlyPrizeDrawDate)}
                        onDateChange={(date) => {
                          (handleChange as any)("monthlyPrizeDrawDate", safeDateToISOString(date))
                        }}
                        placeholder="Seleccionar fecha y hora"
                        minDate={new Date()}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>• Las fechas deben ser futuras</p>
                    <p>• Si no se especifica fecha, se calculará automáticamente</p>
                    <p>• Al desactivar fechas personalizadas, se volverá al cálculo automático</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                <Button type="submit" disabled={isSaving || !hasChanges} className="w-full sm:w-auto">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={isSaving} className="w-full sm:w-auto">
                  Restaurar predeterminado
                </Button>
                {!hasChanges && !isSaving && (
                  <span className="text-sm text-muted-foreground">Cambios guardados</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vista previa</CardTitle>
            <CardDescription>Así se mostrará el banner en la sección de premios.</CardDescription>
          </CardHeader>
          <CardContent>
            {formState.useImage && formState.imageUrl && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Vista previa de la imagen:</p>
                </div>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-muted">
                  {isValidImageUrl(formState.imageUrl) ? (
                    <Image
                      src={formState.imageUrl}
                      alt="Preview del banner"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error('❌ Error loading banner image preview:', formState.imageUrl)
                        const target = e.target as HTMLImageElement
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="flex items-center justify-center h-full text-sm text-red-600 bg-red-50">
                              <div class="text-center">
                                <div class="text-lg mb-1">❌</div>
                                <div>Error al cargar imagen</div>
                                <div class="text-xs mt-1 opacity-75">Verifica la URL</div>
                              </div>
                            </div>
                          `
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      <div className="text-center">
                        <div className="text-lg mb-1">📷</div>
                        <div>URL no válida</div>
                        <div className="text-xs mt-1 opacity-75">Ingresa una URL de imagen correcta</div>
                      </div>
                    </div>
                  )}
                </div>
                {isValidImageUrl(formState.imageUrl) && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    ✅ URL válida - La imagen se mostrará correctamente
                  </p>
                )}
              </div>
            )}
            <RewardsBanner settings={{ ...formState, enabled: true }} forceVisible />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
