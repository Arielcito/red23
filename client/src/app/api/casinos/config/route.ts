import { NextRequest, NextResponse } from 'next/server'
import { CasinoService } from '@/lib/services/casinoService'
import type { NewCasinoField } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    console.log('⚙️ API: Obteniendo configuración de casinos')

    const config = await CasinoService.getCasinoConfig()

    return NextResponse.json({
      success: true,
      data: config,
      message: 'Configuración obtenida exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API config GET:', error)
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
    console.log('🆕 API: Creando campo personalizado')

    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.name || !body.field_type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: name, field_type' 
        },
        { status: 400 }
      )
    }

    // Validar tipo de campo
    if (!['text', 'number', 'badge', 'percentage'].includes(body.field_type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'field_type debe ser: text, number, badge, o percentage' 
        },
        { status: 400 }
      )
    }

    const fieldData: NewCasinoField = {
      name: body.name.trim(),
      field_type: body.field_type,
      is_required: body.is_required || false,
      display_order: body.display_order || 1,
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    console.log('📝 Datos del campo a crear:', {
      name: fieldData.name,
      type: fieldData.field_type,
      required: fieldData.is_required
    })

    const newField = await CasinoService.createCasinoField(fieldData)

    return NextResponse.json({
      success: true,
      data: newField,
      message: 'Campo personalizado creado exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error en API config POST:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 API: Reordenando campos personalizados')

    const body = await request.json()
    
    // Validar que se envía un array de IDs
    if (!body.fieldIds || !Array.isArray(body.fieldIds)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Se requiere un array de fieldIds' 
        },
        { status: 400 }
      )
    }

    console.log('📋 Reordenando campos:', body.fieldIds.length)

    await CasinoService.reorderCasinoFields(body.fieldIds)

    return NextResponse.json({
      success: true,
      message: 'Campos reordenados exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API config PUT:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}