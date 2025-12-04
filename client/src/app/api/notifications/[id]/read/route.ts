import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { NotificationService } from '@/lib/services/notificationService'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    await NotificationService.markAsRead(userId, id)

    return NextResponse.json({
      success: true,
      message: 'Notificación marcada como leída'
    })

  } catch (error) {
    console.error('❌ Error marking notification as read:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
