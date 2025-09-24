"use client"

import type { RewardsBannerSettings, RewardsBannerTheme } from "@/lib/hooks/useRewardsSettings"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const THEME_STYLES: Record<RewardsBannerTheme, { container: string; badge: string; button: string }> = {
  emerald: {
    container: "bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white",
    badge: "bg-white/20 text-white border-white/30",
    button: "bg-white text-emerald-600 hover:bg-white/90"
  },
  indigo: {
    container: "bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white",
    badge: "bg-white/20 text-white border-white/30",
    button: "bg-white text-indigo-600 hover:bg-white/90"
  },
  amber: {
    container: "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white",
    badge: "bg-black/20 text-yellow-100 border-yellow-200/40",
    button: "bg-white text-amber-600 hover:bg-white/90"
  }
}

interface RewardsBannerProps {
  settings: RewardsBannerSettings
  forceVisible?: boolean
  bannerImage?: string | null
}

export function RewardsBanner({ settings, forceVisible = false, bannerImage }: RewardsBannerProps) {
  if (!settings.enabled && !forceVisible) return null

  // Ensure theme is valid, fallback to emerald if invalid
  const themeKey = (settings.theme && THEME_STYLES[settings.theme]) ? settings.theme : 'emerald'
  const theme = THEME_STYLES[themeKey]

  return (
    <Card className={cn("border-0 shadow-lg overflow-hidden relative", theme.container)}>
      {bannerImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
      )}
      <CardContent className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Programa de premios</span>
              <Badge variant="secondary" className={cn("text-xs", theme.badge)}>
                Actualizado
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              {settings.title}
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-3xl">
              {settings.description}
            </p>
          </div>
          {settings.ctaLabel && settings.ctaUrl && (
            <div className="flex-shrink-0">
              <Button
                asChild
                className={cn("shadow-md", theme.button)}
              >
                <Link href={settings.ctaUrl} target={settings.ctaUrl.startsWith("http") ? "_blank" : undefined}>
                  {settings.ctaLabel}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
