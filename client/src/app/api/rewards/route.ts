import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import type { RewardWinner, RewardSettings } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Fetching rewards data from database')
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'daily' or 'monthly'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Construir query base
    let query = supabase
      .from('reward_winners')
      .select('*')
      .eq('is_active', true)
      .order('won_at', { ascending: false })
      .limit(limit)

    // Filtrar por tipo si se especifica
    if (type && (type === 'daily' || type === 'monthly')) {
      query = query.eq('type', type)
    }

    const { data: recentWinners, error } = await query

    if (error) {
      console.error('❌ Database error fetching winners:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`✅ Loaded ${recentWinners?.length || 0} winners from database`)

    // También obtener configuraciones de premios
    const { data: rewardSettings, error: settingsError } = await supabase
      .from('reward_settings')
      .select('*')
      .limit(1)
      .single()

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('❌ Error fetching reward settings:', settingsError)
    }

    console.log('✅ Loaded reward settings from database')

    return NextResponse.json({
      success: true,
      data: {
        recentWinners: recentWinners || [],
        rewardSettings: rewardSettings || null
      }
    })
  } catch (error) {
    console.error('❌ Error fetching rewards:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch rewards data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}