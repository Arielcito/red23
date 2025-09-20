import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/services/referralService'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🎯 Obteniendo código de referido del usuario')

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    console.log('👤 Usuario autenticado:', userId)

    const userReferral = await ReferralService.getUserReferralData(userId)

    if (!userReferral) {
      return NextResponse.json(
        { success: false, error: 'Usuario no registrado en sistema de referidos' },
        { status: 404 }
      )
    }

    console.log('✅ Código de referido obtenido:', userReferral.referral_code)

    return NextResponse.json({
      success: true,
      data: {
        referralCode: userReferral.referral_code,
        referredByCode: userReferral.referred_by_code,
        createdAt: userReferral.created_at
      }
    })

  } catch (error) {
    console.error('❌ Error obteniendo código de referido API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener el código'
      },
      { status: 500 }
    )
  }
}