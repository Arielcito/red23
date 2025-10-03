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
  imageUrl?: string | null
  useImage: boolean
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
    imageUrl: null,
    useImage: false,
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
  const transformToFrontend = useCallback((dbSettings: RewardSettings): RewardsBannerSettings => {
    console.log('🔄 Transforming to frontend - banner_theme from DB:', dbSettings.banner_theme, 'Type:', typeof dbSettings.banner_theme)

    const transformed = {
      enabled: dbSettings.banner_enabled,
      title: dbSettings.banner_title,
      description: dbSettings.banner_description,
      ctaLabel: dbSettings.banner_cta_label,
      ctaUrl: dbSettings.banner_cta_url,
      theme: dbSettings.banner_theme && ['emerald', 'indigo', 'amber'].includes(dbSettings.banner_theme)
        ? dbSettings.banner_theme as RewardsBannerTheme
        : 'emerald',
      imageId: dbSettings.banner_image_id,
      imageUrl: dbSettings.banner_image_url ?? null,
      useImage: dbSettings.banner_use_image ?? false,
      dailyPrizeAmount: dbSettings.daily_prize_amount,
      monthlyPrizeAmount: dbSettings.monthly_prize_amount,
      dailyPrizeDrawDate: dbSettings.daily_prize_draw_date,
      monthlyPrizeDrawDate: dbSettings.monthly_prize_draw_date,
      useCustomDates: dbSettings.use_custom_dates
    }

    console.log('✅ Transformed to frontend - final theme:', transformed.theme)

    return transformed
  }, [])

  // Transform frontend settings to database format
  const transformToDatabase = useCallback((frontendSettings: Partial<RewardsBannerSettings>) => {
    const dbData = {
      banner_enabled: frontendSettings.enabled,
      banner_title: frontendSettings.title,
      banner_description: frontendSettings.description,
      banner_cta_label: frontendSettings.ctaLabel,
      banner_cta_url: frontendSettings.ctaUrl,
      banner_theme: frontendSettings.theme,
      banner_image_id: frontendSettings.imageId,
      banner_image_url: frontendSettings.imageUrl,
      banner_use_image: frontendSettings.useImage,
      daily_prize_amount: frontendSettings.dailyPrizeAmount,
      monthly_prize_amount: frontendSettings.monthlyPrizeAmount,
      daily_prize_draw_date: frontendSettings.dailyPrizeDrawDate,
      monthly_prize_draw_date: frontendSettings.monthlyPrizeDrawDate,
      use_custom_dates: frontendSettings.useCustomDates
    }

    console.log('🔄 Transforming to database - theme:', dbData.banner_theme)

    return dbData
  }, [])

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
      console.log('🎨 Theme value before transform:', updates.theme, 'Type:', typeof updates.theme)

      const dbUpdates = transformToDatabase(updates)

      console.log('🔄 Database updates after transform:', dbUpdates)
      console.log('🎨 Banner theme after transform:', dbUpdates.banner_theme, 'Type:', typeof dbUpdates.banner_theme)

      const requestBody = JSON.stringify(dbUpdates)
      console.log('📤 Request body being sent:', requestBody)

      const response = await fetch('/api/admin/rewards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })

      const result = await response.json()

      if (!result.success) {
        console.error('❌ API returned error:', result.error)
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
      imageUrl: null,
      useImage: false,
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