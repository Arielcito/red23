import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { RewardSettings, NewRewardSettings } from '@/lib/supabase/types'

// Cliente con service key para operaciones administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('📋 Fetching admin rewards settings from database')
    
    // Obtener configuraciones de la base de datos
    const { data: settings, error } = await supabaseAdmin
      .from('reward_settings')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('❌ Database error fetching settings:', error)
      
      // Si no existe configuración, crear una por defecto
      if (error.code === 'PGRST116') {
        console.log('📝 Creating default rewards settings')
        
        const defaultSettings: NewRewardSettings = {
          banner_enabled: true,
          banner_title: "¡Participa por premios exclusivos en tu país!",
          banner_description: "Cada semana seleccionamos ganadores en Paraguay, México y Uruguay. Aumenta tus chances usando Red23.",
          banner_cta_label: "Ver reglas",
          banner_cta_url: "#reglas-premios",
          banner_theme: "emerald",
          banner_image_url: null,
          banner_use_image: false,
          daily_prize_amount: "$500 - $1,500 USD",
          monthly_prize_amount: "$5,000 - $15,000 USD",
          daily_prize_draw_date: null,
          monthly_prize_draw_date: null,
          use_custom_dates: false,
          rules_text: null
        }

        const { data: newSettings, error: createError } = await supabaseAdmin
          .from('reward_settings')
          .insert(defaultSettings)
          .select('*')
          .single()

        if (createError) {
          throw new Error(`Failed to create default settings: ${createError.message}`)
        }

        console.log('✅ Created default rewards settings')
        return NextResponse.json({
          success: true,
          data: newSettings
        })
      }
      
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Loaded rewards settings from database')

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('❌ Error fetching rewards settings:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch rewards settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('📝 Updating rewards settings in database')

    const updates = await request.json()

    console.log('📥 Raw request body received:', updates)
    console.log('📥 Request body type:', typeof updates)
    console.log('🎨 Banner theme in request:', updates.banner_theme, 'Type:', typeof updates.banner_theme)

    // Validar que el body sea un objeto válido
    if (typeof updates !== 'object' || updates === null) {
      console.error('❌ Invalid request body: not an object or null')
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body',
          details: 'Request body must be a valid object'
        }
      }, { status: 400 })
    }

    // Validar campos específicos si están presentes
    if ('banner_theme' in updates) {
      console.log('🔍 Validating banner theme:', updates.banner_theme)
      console.log('📋 Valid themes:', ['emerald', 'indigo', 'amber'])
      console.log('✅ Is valid theme?', ['emerald', 'indigo', 'amber'].includes(updates.banner_theme))

      if (!['emerald', 'indigo', 'amber'].includes(updates.banner_theme)) {
        console.error('❌ Invalid banner theme validation failed:', {
          receivedTheme: updates.banner_theme,
          receivedType: typeof updates.banner_theme,
          validThemes: ['emerald', 'indigo', 'amber']
        })
        return NextResponse.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid banner theme',
            details: `Theme must be one of: emerald, indigo, amber. Received: ${updates.banner_theme}`
          }
        }, { status: 400 })
      }
      console.log('✅ Banner theme validation passed')
    }

    // Validar fechas personalizadas si están presentes
    if (updates.daily_prize_draw_date) {
      const dailyDate = new Date(updates.daily_prize_draw_date)
      if (Number.isNaN(dailyDate.getTime())) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid daily prize draw date',
            details: 'Date must be a valid ISO string'
          }
        }, { status: 400 })
      }
      
      if (dailyDate <= new Date()) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Daily prize draw date must be in the future',
            details: 'Cannot set past dates for prize draws'
          }
        }, { status: 400 })
      }
    }

    if (updates.monthly_prize_draw_date) {
      const monthlyDate = new Date(updates.monthly_prize_draw_date)
      if (Number.isNaN(monthlyDate.getTime())) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid monthly prize draw date',
            details: 'Date must be a valid ISO string'
          }
        }, { status: 400 })
      }
      
      if (monthlyDate <= new Date()) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Monthly prize draw date must be in the future',
            details: 'Cannot set past dates for prize draws'
          }
        }, { status: 400 })
      }
    }

    console.log('📝 Updating with data:', updates)

    // Primero obtener el ID del registro existente
    const { data: currentSettings, error: fetchError } = await supabaseAdmin
      .from('reward_settings')
      .select('id')
      .limit(1)
      .single()

    if (fetchError) {
      console.error('❌ Error fetching current settings:', fetchError)
      throw new Error(`Failed to fetch current settings: ${fetchError.message}`)
    }

    // Actualizar configuraciones en la base de datos
    const { data: updatedSettings, error: updateError } = await supabaseAdmin
      .from('reward_settings')
      .update(updates)
      .eq('id', currentSettings.id)
      .select('*')
      .single()

    if (updateError) {
      console.error('❌ Database error updating settings:', updateError)
      throw new Error(`Database error: ${updateError.message}`)
    }

    console.log('✅ Updated rewards settings in database')

    return NextResponse.json({
      success: true,
      data: updatedSettings
    })
  } catch (error) {
    console.error('❌ Error updating rewards settings:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update rewards settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}