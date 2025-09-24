import { NextRequest, NextResponse } from 'next/server'
import { CasinoService } from '@/lib/services/casinoService'
import type { NewCasino } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    console.log('🎰 API: Obteniendo todos los casinos')

    const casinos = await CasinoService.getAllCasinos()

    return NextResponse.json({
      success: true,
      data: casinos,
      meta: {
        total: casinos.length,
        message: 'Casinos obtenidos exitosamente'
      }
    })

  } catch (error) {
    console.error('❌ Error en API casinos GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🆕 API: Creando nuevo casino')

    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.name || !body.plataforma || !body.tiempo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: name, plataforma, tiempo' 
        },
        { status: 400 }
      )
    }

    // Validar potencial si se proporciona
    if (body.potencial_value && !['high', 'medium', 'low'].includes(body.potencial_value)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'potencial_value debe ser: high, medium, o low' 
        },
        { status: 400 }
      )
    }

    // Preparar datos del casino
    const casinoData: NewCasino = {
      casino_name: body.casino_name.trim(),
      logo: body.logo || null,
      antiguedad: body.antiguedad.trim(),
      precio: body.precio || 'medio',
      rtp: body.rtp || 0,
      plat_similar: body.plat_similar?.trim() || null,
      position: body.position || null,
      image_url: body.image_url || null,
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    console.log('📝 Datos del casino a crear:', {
      casino_name: casinoData.casino_name,
      antiguedad: casinoData.antiguedad,
      precio: casinoData.precio
    })

    const newCasino = await CasinoService.createCasino(casinoData)

    return NextResponse.json({
      success: true,
      data: newCasino,
      message: 'Casino creado exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error en API casinos POST:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}