import { NextRequest, NextResponse } from 'next/server'
import { CasinoService } from '@/lib/services/casinoService'
import type { NewCasinoFieldValue } from '@/lib/supabase/types'

interface RouteParams {
  params: {
    casinoId: string
    fieldId: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('💾 API: Actualizando valor de campo para casino:', params.casinoId, 'campo:', params.fieldId)

    const body = await request.json()

    // Preparar datos del valor del campo
    const valueData: Partial<NewCasinoFieldValue> = {}

    if (body.text_value !== undefined) valueData.text_value = body.text_value
    if (body.number_value !== undefined) valueData.number_value = body.number_value
    if (body.badge_value !== undefined) valueData.badge_value = body.badge_value
    if (body.badge_color !== undefined) valueData.badge_color = body.badge_color
    if (body.badge_label !== undefined) valueData.badge_label = body.badge_label

    // Validar que al menos un valor se proporciona
    const hasValue = Object.keys(valueData).length > 0
    if (!hasValue) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Se debe proporcionar al menos un valor' 
        },
        { status: 400 }
      )
    }

    // Validar color de badge si se proporciona
    if (valueData.badge_color && !['red', 'yellow', 'green'].includes(valueData.badge_color)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'badge_color debe ser: red, yellow, o green' 
        },
        { status: 400 }
      )
    }

    console.log('💾 Datos del valor a actualizar:', Object.keys(valueData))

    const updatedValue = await CasinoService.updateCasinoFieldValue(
      params.casinoId, 
      params.fieldId, 
      valueData
    )

    return NextResponse.json({
      success: true,
      data: updatedValue,
      message: 'Valor de campo actualizado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API field value PUT:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}