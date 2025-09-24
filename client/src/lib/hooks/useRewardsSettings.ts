"use client"

import { useState, useEffect, useCallback } from "react"

export type RewardsBannerTheme = "emerald" | "indigo" | "amber"

export interface RewardsBannerSettings {
  enabled: boolean
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  theme: RewardsBannerTheme
  imageId?: number | null
}

interface UseRewardsSettingsReturn {
  settings: RewardsBannerSettings
  isLoaded: boolean
  updateSettings: (updates: Partial<RewardsBannerSettings>) => Promise<void>
  resetSettings: () => Promise<void>
}

const STORAGE_KEY = "red23:rewards-settings"

const DEFAULT_SETTINGS: RewardsBannerSettings = {
  enabled: true,
  title: "¡Participa por premios exclusivos en tu país!",
  description: "Cada semana seleccionamos ganadores en Paraguay, México y Uruguay. Aumenta tus chances usando Red23.",
  ctaLabel: "Ver reglas",
  ctaUrl: "#reglas-premios",
  theme: "emerald",
  imageId: null
}

const isBrowser = typeof window !== "undefined"

export function useRewardsSettings(): UseRewardsSettingsReturn {
  const [settings, setSettings] = useState<RewardsBannerSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isBrowser) return

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as RewardsBannerSettings
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (error) {
      console.warn("No se pudieron leer las configuraciones de premios", error)
      setSettings(DEFAULT_SETTINGS)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const persistSettings = useCallback((nextSettings: RewardsBannerSettings) => {
    if (!isBrowser) return

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings))
    } catch (error) {
      console.warn("No se pudieron guardar las configuraciones de premios", error)
    }
  }, [])

  const updateSettings = useCallback(async (updates: Partial<RewardsBannerSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      persistSettings(next)
      return next
    })
  }, [persistSettings])

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS)
    persistSettings(DEFAULT_SETTINGS)
  }, [persistSettings])

  return {
    settings,
    isLoaded,
    updateSettings,
    resetSettings
  }
}

export { DEFAULT_SETTINGS as DEFAULT_REWARDS_BANNER_SETTINGS }
