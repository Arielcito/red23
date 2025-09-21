import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/lib/services/newsService'

// Admin endpoint to get all news (including unpublished)
export async function GET(request: NextRequest) {
  try {
    console.log('📰 API Admin: Obteniendo todas las noticias para admin')

    const news = await NewsService.getAllNewsForAdmin()

    return NextResponse.json({
      success: true,
      data: news,
      meta: {
        total: news.length,
        message: 'Noticias para admin obtenidas exitosamente'
      }
    })

  } catch (error) {
    console.error('❌ Error en API admin news GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}