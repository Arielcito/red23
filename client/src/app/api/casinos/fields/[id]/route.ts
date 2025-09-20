import { NextRequest, NextResponse } from 'next/server'
import { CasinoService } from '@/lib/services/casinoService'
import type { NewCasinoField } from '@/lib/supabase/types'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('📝 API: Actualizando campo personalizado:', params.id)

    const body = await request.json()

    // Validar tipo de campo si se proporciona
    if (body.field_type && !['text', 'number', 'badge', 'percentage'].includes(body.field_type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'field_type debe ser: text, number, badge, o percentage' 
        },
        { status: 400 }
      )
    }

    // Preparar datos de actualización (solo campos que se envían)
    const updateData: Partial<NewCasinoField> = {}

    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.field_type !== undefined) updateData.field_type = body.field_type
    if (body.is_required !== undefined) updateData.is_required = body.is_required
    if (body.display_order !== undefined) updateData.display_order = body.display_order
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    console.log('📝 Datos a actualizar:', Object.keys(updateData))

    const updatedField = await CasinoService.updateCasinoField(params.id, updateData)

    return NextResponse.json({
      success: true,
      data: updatedField,
      message: 'Campo personalizado actualizado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API field PUT:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('🗑️ API: Eliminando campo personalizado:', params.id)

    await CasinoService.deleteCasinoField(params.id)

    return NextResponse.json({
      success: true,
      message: 'Campo personalizado eliminado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API field DELETE:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}