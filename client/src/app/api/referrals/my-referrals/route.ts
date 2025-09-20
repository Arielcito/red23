import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/services/referralService'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 Obteniendo lista de referidos')

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    console.log('👤 Usuario autenticado:', userId)

    const myReferrals = await ReferralService.getMyReferrals(userId)

    console.log('✅ Referidos obtenidos:', myReferrals.length)

    return NextResponse.json({
      success: true,
      data: myReferrals
    })

  } catch (error) {
    console.error('❌ Error obteniendo referidos API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener los referidos'
      },
      { status: 500 }
    )
  }
}