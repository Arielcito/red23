import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/services/referralService'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando validación de código de referido')

    const { referralCode } = await request.json()

    console.log('📝 Código a validar:', referralCode)

    if (!referralCode) {
      return NextResponse.json(
        { success: false, error: 'Código de referido requerido' },
        { status: 400 }
      )
    }

    if (typeof referralCode !== 'string' || referralCode.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Código de referido inválido' },
        { status: 400 }
      )
    }

    const isValid = await ReferralService.validateReferralCode(referralCode.toUpperCase())

    console.log('✅ Resultado de validación:', { referralCode, isValid })

    return NextResponse.json({
      success: true,
      data: {
        isValid,
        referralCode: referralCode.toUpperCase()
      }
    })

  } catch (error) {
    console.error('❌ Error en validación de código API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor durante la validación'
      },
      { status: 500 }
    )
  }
}