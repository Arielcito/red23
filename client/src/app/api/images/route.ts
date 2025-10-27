import { NextRequest, NextResponse } from 'next/server'
import { ImageUploadService } from '@/lib/services/imageUploadService'

export async function GET(request: NextRequest) {
  try {
    console.log('🖼️ API: Obteniendo imágenes desde Supabase')

    const url = new URL(request.url)
    const userEmail = url.searchParams.get('user_email')
    const limitParam = url.searchParams.get('limit')

    // Validar que se proporcione el email del usuario
    if (!userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'El parámetro user_email es requerido'
        },
        { status: 400 }
      )
    }

    // Parsear el límite o usar default de 50
    const limit = limitParam ? parseInt(limitParam) : 50

    console.log('📊 Parámetros de consulta:', {
      user_email: userEmail,
      limit
    })

    // Obtener imágenes del usuario desde Supabase
    const images = await ImageUploadService.getImagesByUser(userEmail, limit)

    console.log('✅ Imágenes obtenidas desde Supabase:', images.length)

    return NextResponse.json({
      success: true,
      status: 'success',
      count: images.length,
      data: images,
      meta: {
        total: images.length,
        limit,
        message: 'Imágenes obtenidas exitosamente desde base de datos'
      }
    })

  } catch (error) {
    console.error('❌ Error en API images GET:', error)
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        error: {
          message: error instanceof Error ? error.message : 'Error interno del servidor',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    )
  }
}
