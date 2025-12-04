import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { NotificationService } from '@/lib/services/notificationService'

export async function DELETE(
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
    await NotificationService.softDeleteForUser(userId, id)

    return NextResponse.json({
      success: true,
      message: 'Notificación eliminada'
    })

  } catch (error) {
    console.error('❌ Error deleting notification:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
