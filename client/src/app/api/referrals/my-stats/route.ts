import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/services/referralService'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Obteniendo estadísticas de referidos')

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    console.log('👤 Usuario autenticado:', userId)

    const stats = await ReferralService.getReferralStats(userId)

    console.log('✅ Estadísticas obtenidas:', stats)

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas API:', error)
    
    if (error instanceof Error && error.message.includes('no encontrado')) {
      return NextResponse.json(
        { success: false, error: 'Usuario no registrado en sistema de referidos' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener estadísticas'
      },
      { status: 500 }
    )
  }
}