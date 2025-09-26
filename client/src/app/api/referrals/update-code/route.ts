import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/services/referralService'
import { auth } from '@clerk/nextjs/server'

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Actualizando código de referido personalizado')

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const { newReferralCode } = await request.json()

    if (!newReferralCode) {
      return NextResponse.json(
        { success: false, error: 'Nuevo código de referido requerido' },
        { status: 400 }
      )
    }

    console.log('👤 Actualizando código para usuario:', userId, 'nuevo código:', newReferralCode)

    // Validar formato del código
    const validation = ReferralService.validateCustomReferralCode(newReferralCode)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          suggestions: validation.suggestions
        },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe en el sistema de referidos
    const existingUser = await ReferralService.getUserReferralData(userId)
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado en sistema de referidos' },
        { status: 404 }
      )
    }

    // Verificar disponibilidad (excluyendo el código actual del usuario)
    const isAvailable = await ReferralService.checkReferralCodeAvailability(newReferralCode, userId)
    if (!isAvailable) {
      return NextResponse.json(
        { success: false, error: 'Este código ya está en uso por otro usuario' },
        { status: 400 }
      )
    }

    // Actualizar el código
    const updatedUser = await ReferralService.updateUserReferralCode(userId, newReferralCode)

    console.log('✅ Código actualizado exitosamente:', {
      userId,
      oldCode: existingUser.referral_code,
      newCode: updatedUser.referral_code
    })

    return NextResponse.json({
      success: true,
      data: {
        referralCode: updatedUser.referral_code,
        message: 'Código de referido actualizado exitosamente'
      }
    })

  } catch (error) {
    console.error('❌ Error actualizando código de referido:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}