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
import { useRewardsSettings, RewardsBannerSettings, RewardsBannerTheme } from "@/lib/hooks/useRewardsSettings"
import { RewardsBanner } from "@/components/rewards/RewardsBanner"
import { AlertTriangle, Loader2, Paintbrush } from "lucide-react"

const THEME_OPTIONS: { value: RewardsBannerTheme; label: string; description: string }[] = [
  { value: "emerald", label: "Esmeralda", description: "Ideal para destacar premios principales" },
  { value: "indigo", label: "Índigo", description: "Resalta lanzamientos o anuncios especiales" },
  { value: "amber", label: "Ámbar", description: "Perfecto para promociones urgentes" }
]

export default function AdminRewardsPage() {
  const { settings, updateSettings, resetSettings, isLoaded } = useRewardsSettings()
  const [formState, setFormState] = useState<RewardsBannerSettings>(settings)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setFormState(settings)
    setHasChanges(false)
  }, [settings])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    await updateSettings(formState)
    setIsSaving(false)
    setHasChanges(false)
  }

  const handleReset = async () => {
    await resetSettings()
  }

  const handleChange = <Key extends keyof RewardsBannerSettings>(field: Key, value: RewardsBannerSettings[Key]) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
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
      <div className="p-6 space-y-6">
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

              <div className="grid gap-4 md:grid-cols-2">
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
                    value={formState.theme}
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

              <div className="grid gap-4 md:grid-cols-2">
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

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={isSaving || !hasChanges}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={isSaving}>
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
            <RewardsBanner settings={{ ...formState, enabled: true }} forceVisible />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
