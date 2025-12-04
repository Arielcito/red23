import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { NotificationService } from '@/lib/services/notificationService'

export async function GET(request: NextRequest) {
  try {
    console.log('🔔 API: Fetching user notifications')

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const notifications = await NotificationService.getUserNotifications(userId)

    return NextResponse.json({
      success: true,
      data: notifications,
      meta: {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length
      }
    })

  } catch (error) {
    console.error('❌ Error fetching notifications:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
