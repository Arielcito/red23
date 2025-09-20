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

    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.logo !== undefined) updateData.logo = body.logo
    if (body.plataforma !== undefined) updateData.plataforma = body.plataforma.trim()
    if (body.tiempo !== undefined) updateData.tiempo = body.tiempo.trim()
    if (body.potencial_value !== undefined) updateData.potencial_value = body.potencial_value
    if (body.potencial_color !== undefined) updateData.potencial_color = body.potencial_color
    if (body.potencial_label !== undefined) updateData.potencial_label = body.potencial_label
    if (body.similar !== undefined) updateData.similar = body.similar?.trim() || null
    if (body.is_top_three !== undefined) updateData.is_top_three = body.is_top_three
    if (body.top_three_position !== undefined) updateData.top_three_position = body.top_three_position
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
