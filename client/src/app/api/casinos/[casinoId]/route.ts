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
    const precioOptions = ['medio', 'barato', 'muy barato']

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

    if (body.precio !== undefined && !precioOptions.includes(body.precio)) {
      return NextResponse.json(
        {
          success: false,
          error: `precio debe ser uno de: ${precioOptions.join(', ')}`
        },
        { status: 400 }
      )
    }

    if (body.rtp !== undefined) {
      const rtpValue = Number(body.rtp)
      if (Number.isNaN(rtpValue) || rtpValue < 0 || rtpValue > 100) {
        return NextResponse.json(
          {
            success: false,
            error: 'rtp debe ser un número entre 0 y 100'
          },
          { status: 400 }
        )
      }
    }

    if (body.position !== undefined && body.position !== null) {
      const positionValue = Number(body.position)
      if (!Number.isInteger(positionValue) || positionValue < 1) {
        return NextResponse.json(
          {
            success: false,
            error: 'position debe ser un entero positivo o null'
          },
          { status: 400 }
        )
      }
    }

    // Preparar datos de actualización (solo campos que se envían)
    const updateData: Partial<NewCasino> = {}

    if (body.casino_name !== undefined) updateData.casino_name = body.casino_name.trim()
    if (body.logo !== undefined) updateData.logo = body.logo
    if (body.antiguedad !== undefined) updateData.antiguedad = body.antiguedad.trim()
    if (body.precio !== undefined) updateData.precio = body.precio
    if (body.rtp !== undefined) updateData.rtp = Number(body.rtp)
    if (body.plat_similar !== undefined) updateData.plat_similar = body.plat_similar?.trim() || null
    if (body.position !== undefined) {
      updateData.position = body.position === null ? null : Number(body.position)
    }
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
