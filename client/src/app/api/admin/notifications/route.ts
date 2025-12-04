import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createNotificationSchema } from '@/lib/validations/notifications'
import { NotificationService } from '@/lib/services/notificationService'

// Admin user IDs (same as Sidebar.tsx)
const ADMIN_USER_IDS = [
  'user_31DCO0Te7aX1F7a8KOO7CZwNbTA',
  'user_32TNG7qogCbcPn03Ad1BS95i3Pf',
  'user_32zPCd7JmFUeJvJPAB0ksLcbD4k',
  'user_32zZf6gn0Y24LMMl8qM81hjojMk'
]

export async function POST(request: NextRequest) {
  try {
    console.log('📢 API Admin: Creating broadcast notification')

    // Auth check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Admin check
    if (!ADMIN_USER_IDS.includes(userId)) {
      console.log(`⛔ Unauthorized access attempt by user: ${userId}`)
      return NextResponse.json(
        { success: false, error: 'No autorizado. Solo administradores.' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = createNotificationSchema.safeParse(body)

    if (!validation.success) {
      console.error('❌ Validation errors:', validation.error.errors)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Errores de validación',
            details: validation.error.errors.map(err => err.message)
          }
        },
        { status: 400 }
      )
    }

    // Create and broadcast notification
    const result = await NotificationService.createAndBroadcast(validation.data)

    if (!result) {
      throw new Error('Error al crear notificación')
    }

    console.log(`✅ Notification broadcast to ${result.broadcastCount} users`)

    return NextResponse.json({
      success: true,
      data: result,
      message: `Notificación enviada a ${result.broadcastCount} usuarios`
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error in admin notifications POST:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
