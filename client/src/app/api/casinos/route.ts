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
    const precioOptions = ['medio', 'barato', 'muy barato']

    // Validar datos requeridos basados en el nuevo esquema
    if (!body.casino_name || typeof body.casino_name !== 'string' || !body.casino_name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'El campo casino_name es requerido'
        },
        { status: 400 }
      )
    }

    if (!body.antiguedad || typeof body.antiguedad !== 'string' || !body.antiguedad.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'El campo antiguedad es requerido'
        },
        { status: 400 }
      )
    }

    const precio = body.precio ?? 'medio'
    if (!precioOptions.includes(precio)) {
      return NextResponse.json(
        {
          success: false,
          error: `precio debe ser uno de: ${precioOptions.join(', ')}`
        },
        { status: 400 }
      )
    }

    const rtpValue = body.rtp !== undefined ? Number(body.rtp) : 0
    if (Number.isNaN(rtpValue) || rtpValue < 0 || rtpValue > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'rtp debe ser un número entre 0 y 100'
        },
        { status: 400 }
      )
    }

    const positionValue = body.position !== undefined && body.position !== null
      ? Number(body.position)
      : null

    if (positionValue !== null && (!Number.isInteger(positionValue) || positionValue < 1)) {
      return NextResponse.json(
        {
          success: false,
          error: 'position debe ser un entero positivo o null'
        },
        { status: 400 }
      )
    }

    // Preparar datos del casino según el nuevo esquema
    const casinoData: NewCasino = {
      casino_name: body.casino_name.trim(),
      logo: body.logo || null,
      antiguedad: body.antiguedad.trim(),
      precio: precio,
      rtp: rtpValue,
      plat_similar: body.plat_similar?.trim() || null,
      position: positionValue,
      image_url: body.image_url || null,
      is_regulated: body.is_regulated !== undefined ? Boolean(body.is_regulated) : false,
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
