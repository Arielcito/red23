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

    // Verificar si el usuario ya existe en el sistema de referidos
    const existingUser = await ReferralService.getUserReferralData(userId)
    
    if (!existingUser) {
      console.log('🔧 Usuario no encontrado en sistema de referidos, creando automáticamente...')
      
      try {
        // Crear usuario automáticamente en sistema de referidos
        await ReferralService.createUserReferral({
          userId
          // Sin referredByCode para que sea un registro nuevo
        })
        
        console.log('✅ Usuario creado automáticamente en sistema de referidos')
        
        // Pequeño delay para asegurar que la inserción se complete
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (createError) {
        console.error('❌ Error creando usuario automáticamente:', createError)
        
        // Si falla por duplicado, está bien, continuamos
        if (!(createError instanceof Error && createError.message.includes('ya tiene código'))) {
          throw createError
        }
      }
    }

    // Obtener estadísticas (ahora debería funcionar)
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