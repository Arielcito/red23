import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { UserLogoService } from '@/lib/services/userLogoService'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/user-logo - Obteniendo logo del usuario')

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const logo = await UserLogoService.getUserLogo(userId)

    return NextResponse.json({
      success: true,
      data: logo
    })
  } catch (error) {
    console.error('❌ Error en GET /api/user-logo:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener el logo del usuario'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 POST /api/user-logo - Subiendo logo del usuario')

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const userEmail = formData.get('user_email') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se envió ningún archivo' },
        { status: 400 }
      )
    }

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'Email de usuario requerido' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser una imagen' },
        { status: 400 }
      )
    }

    const logo = await UserLogoService.uploadUserLogo(userId, file, userEmail)

    console.log('✅ Logo subido exitosamente:', logo.id)

    return NextResponse.json({
      success: true,
      data: {
        logo,
        message: 'Logo subido exitosamente'
      }
    })
  } catch (error) {
    console.error('❌ Error en POST /api/user-logo:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al subir el logo'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE /api/user-logo - Eliminando logo del usuario')

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    await UserLogoService.deleteUserLogo(userId)

    console.log('✅ Logo eliminado exitosamente')

    return NextResponse.json({
      success: true,
      data: {
        message: 'Logo eliminado exitosamente'
      }
    })
  } catch (error) {
    console.error('❌ Error en DELETE /api/user-logo:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al eliminar el logo'
      },
      { status: 500 }
    )
  }
}
