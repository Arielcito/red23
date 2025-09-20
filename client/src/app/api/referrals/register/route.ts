import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/services/referralService'

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Iniciando registro en sistema de referidos')

    const { userId, referredByCode } = await request.json()

    console.log('📝 Datos recibidos:', {
      userId,
      hasReferredByCode: !!referredByCode
    })

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      )
    }

    // Validar código de referido si se proporciona
    if (referredByCode) {
      const isValidCode = await ReferralService.validateReferralCode(referredByCode)
      if (!isValidCode) {
        return NextResponse.json(
          { success: false, error: 'Código de referido inválido' },
          { status: 400 }
        )
      }
    }

    // Crear registro de referido
    const userReferral = await ReferralService.createUserReferral({
      userId,
      referredByCode
    })

    console.log('✅ Usuario registrado en sistema de referidos:', {
      id: userReferral.id,
      referral_code: userReferral.referral_code
    })

    return NextResponse.json({
      success: true,
      data: {
        id: userReferral.id,
        referralCode: userReferral.referral_code,
        referredByCode: userReferral.referred_by_code,
        message: 'Usuario registrado exitosamente en el sistema de referidos'
      }
    })

  } catch (error) {
    console.error('❌ Error en registro de referidos API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}