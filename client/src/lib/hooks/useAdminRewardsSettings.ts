import { useState, useEffect, useCallback } from 'react'
import type { RewardSettings } from '@/lib/supabase/types'

export type RewardsBannerTheme = "emerald" | "indigo" | "amber"

export interface RewardsBannerSettings {
  enabled: boolean
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  theme: RewardsBannerTheme
  imageId?: number | null
  dailyPrizeAmount: string
  monthlyPrizeAmount: string
  dailyPrizeDrawDate?: string | null
  monthlyPrizeDrawDate?: string | null
  useCustomDates: boolean
}

interface UseAdminRewardsSettingsReturn {
  settings: RewardsBannerSettings
  isLoaded: boolean
  isLoading: boolean
  error: string | null
  updateSettings: (updates: Partial<RewardsBannerSettings>) => Promise<void>
  resetSettings: () => Promise<void>
  refetch: () => Promise<void>
}

export function useAdminRewardsSettings(): UseAdminRewardsSettingsReturn {
  const [settings, setSettings] = useState<RewardsBannerSettings>({
    enabled: true,
    title: "¡Participa por premios exclusivos en tu país!",
    description: "Cada semana seleccionamos ganadores en Paraguay, México y Uruguay. Aumenta tus chances usando Red23.",
    ctaLabel: "Ver reglas",
    ctaUrl: "#reglas-premios",
    theme: "emerald",
    imageId: null,
    dailyPrizeAmount: "$500 - $1,500 USD",
    monthlyPrizeAmount: "$5,000 - $15,000 USD",
    dailyPrizeDrawDate: null,
    monthlyPrizeDrawDate: null,
    useCustomDates: false
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Transform database settings to frontend format
  const transformToFrontend = useCallback((dbSettings: RewardSettings): RewardsBannerSettings => ({
    enabled: dbSettings.banner_enabled,
    title: dbSettings.banner_title,
    description: dbSettings.banner_description,
    ctaLabel: dbSettings.banner_cta_label,
    ctaUrl: dbSettings.banner_cta_url,
    theme: dbSettings.banner_theme,
    imageId: dbSettings.banner_image_id,
    dailyPrizeAmount: dbSettings.daily_prize_amount,
    monthlyPrizeAmount: dbSettings.monthly_prize_amount,
    dailyPrizeDrawDate: dbSettings.daily_prize_draw_date,
    monthlyPrizeDrawDate: dbSettings.monthly_prize_draw_date,
    useCustomDates: dbSettings.use_custom_dates
  }), [])

  // Transform frontend settings to database format
  const transformToDatabase = useCallback((frontendSettings: Partial<RewardsBannerSettings>) => ({
    banner_enabled: frontendSettings.enabled,
    banner_title: frontendSettings.title,
    banner_description: frontendSettings.description,
    banner_cta_label: frontendSettings.ctaLabel,
    banner_cta_url: frontendSettings.ctaUrl,
    banner_theme: frontendSettings.theme,
    banner_image_id: frontendSettings.imageId,
    daily_prize_amount: frontendSettings.dailyPrizeAmount,
    monthly_prize_amount: frontendSettings.monthlyPrizeAmount,
    daily_prize_draw_date: frontendSettings.dailyPrizeDrawDate,
    monthly_prize_draw_date: frontendSettings.monthlyPrizeDrawDate,
    use_custom_dates: frontendSettings.useCustomDates
  }), [])

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('📋 Fetching admin rewards settings')
      
      const response = await fetch('/api/admin/rewards')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch settings')
      }

      console.log('✅ Loaded admin rewards settings')
      
      const transformedSettings = transformToFrontend(result.data)
      setSettings(transformedSettings)
      setIsLoaded(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings'
      console.error('❌ Error fetching admin rewards settings:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [transformToFrontend])

  const updateSettings = useCallback(async (updates: Partial<RewardsBannerSettings>) => {
    try {
      setError(null)
      
      console.log('📝 Updating admin rewards settings:', updates)
      
      const dbUpdates = transformToDatabase(updates)
      
      const response = await fetch('/api/admin/rewards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbUpdates),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update settings')
      }

      console.log('✅ Updated admin rewards settings')
      
      // Update local state with the response
      const transformedSettings = transformToFrontend(result.data)
      setSettings(transformedSettings)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings'
      console.error('❌ Error updating admin rewards settings:', errorMessage)
      setError(errorMessage)
      throw err
    }
  }, [transformToDatabase, transformToFrontend])

  const resetSettings = useCallback(async () => {
    const defaultSettings: RewardsBannerSettings = {
      enabled: true,
      title: "¡Participa por premios exclusivos en tu país!",
      description: "Cada semana seleccionamos ganadores en Paraguay, México y Uruguay. Aumenta tus chances usando Red23.",
      ctaLabel: "Ver reglas",
      ctaUrl: "#reglas-premios",
      theme: "emerald",
      imageId: null,
      dailyPrizeAmount: "$500 - $1,500 USD",
      monthlyPrizeAmount: "$5,000 - $15,000 USD",
      dailyPrizeDrawDate: null,
      monthlyPrizeDrawDate: null,
      useCustomDates: false
    }
    
    await updateSettings(defaultSettings)
  }, [updateSettings])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    isLoaded,
    isLoading,
    error,
    updateSettings,
    resetSettings,
    refetch: fetchSettings
  }
}