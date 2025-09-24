import { NextRequest, NextResponse } from 'next/server'
import { CasinoService } from '@/lib/services/casinoService'
import type { NewCasino } from '@/lib/supabase/types'

type RouteParamsContext = {
  params: Promise<{ casinoId: string }>
}

export async function GET(request: NextRequest, context: RouteParamsContext) {
  try {
    const { casinoId } = await context.params
    console.log('🔍 API: Obteniendo casino por ID:', casinoId)

    const casino = await CasinoService.getCasinoById(casinoId)

    if (!casino) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Casino no encontrado' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: casino,
      message: 'Casino obtenido exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API casino GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: RouteParamsContext) {
  try {
    const { casinoId } = await context.params
    console.log('📝 API: Actualizando casino:', casinoId)

    const body = await request.json()

    // Validar que el casino existe
    const existingCasino = await CasinoService.getCasinoById(casinoId)
    if (!existingCasino) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Casino no encontrado' 
        },
        { status: 404 }
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

    // Preparar datos de actualización (solo campos que se envían)
    const updateData: Partial<NewCasino> = {}

    if (body.casino_name !== undefined) updateData.casino_name = body.casino_name.trim()
    if (body.logo !== undefined) updateData.logo = body.logo
    if (body.antiguedad !== undefined) updateData.antiguedad = body.antiguedad.trim()
    if (body.precio !== undefined) updateData.precio = body.precio
    if (body.rtp !== undefined) updateData.rtp = body.rtp
    if (body.plat_similar !== undefined) updateData.plat_similar = body.plat_similar?.trim() || null
    if (body.position !== undefined) updateData.position = body.position
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    console.log('📝 Datos a actualizar:', Object.keys(updateData))

    const updatedCasino = await CasinoService.updateCasino(casinoId, updateData)

    return NextResponse.json({
      success: true,
      data: updatedCasino,
      message: 'Casino actualizado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API casino PUT:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteParamsContext) {
  try {
    const { casinoId } = await context.params
    console.log('🗑️ API: Eliminando casino:', casinoId)

    // Validar que el casino existe
    const existingCasino = await CasinoService.getCasinoById(casinoId)
    if (!existingCasino) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Casino no encontrado' 
        },
        { status: 404 }
      )
    }

    await CasinoService.deleteCasino(casinoId)

    return NextResponse.json({
      success: true,
      message: 'Casino eliminado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API casino DELETE:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
