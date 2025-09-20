import { NextRequest, NextResponse } from 'next/server'
import { CasinoService } from '@/lib/services/casinoService'

export async function GET(request: NextRequest) {
  try {
    console.log('👑 API: Obteniendo top 3 casinos')

    const topThree = await CasinoService.getTopThreeCasinos()

    return NextResponse.json({
      success: true,
      data: topThree,
      message: 'Top 3 casinos obtenidos exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API top-three GET:', error)
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
    console.log('🔄 API: Actualizando top 3 casinos')

    const body = await request.json()
    
    // Validar que se envía un array de IDs
    if (!body.casinoIds || !Array.isArray(body.casinoIds)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Se requiere un array de casinoIds' 
        },
        { status: 400 }
      )
    }

    // Validar que no sean más de 3 casinos
    if (body.casinoIds.length > 3) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se pueden tener más de 3 casinos en el top 3' 
        },
        { status: 400 }
      )
    }

    console.log('👑 Actualizando top 3 con:', body.casinoIds)

    await CasinoService.updateTopThree(body.casinoIds)

    // Obtener el top 3 actualizado
    const updatedTopThree = await CasinoService.getTopThreeCasinos()

    return NextResponse.json({
      success: true,
      data: updatedTopThree,
      message: 'Top 3 actualizado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API top-three PUT:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('🖼️ API: Actualizando imagen de casino top 3')

    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.casinoId || !body.imageUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: casinoId, imageUrl' 
        },
        { status: 400 }
      )
    }

    console.log('🖼️ Actualizando imagen para casino:', body.casinoId)

    await CasinoService.updateTopThreeImage(body.casinoId, body.imageUrl)

    return NextResponse.json({
      success: true,
      message: 'Imagen actualizada exitosamente'
    })

  } catch (error) {
    console.error('❌ Error en API top-three PATCH:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}