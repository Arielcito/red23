import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/services/referralService'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Verificando disponibilidad de código personalizado')

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const { referralCode } = await request.json()

    if (!referralCode) {
      return NextResponse.json(
        { success: false, error: 'Código de referido requerido' },
        { status: 400 }
      )
    }

    console.log('👤 Verificando código para usuario:', userId, 'código:', referralCode)

    // Validar formato del código
    const validation = ReferralService.validateCustomReferralCode(referralCode)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        data: {
          isAvailable: false,
          error: validation.error,
          suggestions: validation.suggestions
        }
      })
    }

    // Verificar disponibilidad en la base de datos
    const isAvailable = await ReferralService.checkReferralCodeAvailability(referralCode, userId)

    console.log('✅ Disponibilidad verificada:', { referralCode, isAvailable })

    return NextResponse.json({
      success: true,
      data: {
        isAvailable,
        referralCode,
        error: isAvailable ? null : 'Este código ya está en uso'
      }
    })

  } catch (error) {
    console.error('❌ Error verificando disponibilidad:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al verificar disponibilidad'
      },
      { status: 500 }
    )
  }
}