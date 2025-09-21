import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/lib/services/newsService'
import type { NewNews } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    console.log('📰 API: Obteniendo todas las noticias')

    const url = new URL(request.url)
    const featured = url.searchParams.get('featured')
    const category = url.searchParams.get('category')
    const limit = url.searchParams.get('limit')

    let news

    if (featured === 'true') {
      news = await NewsService.getFeaturedNews()
    } else if (category) {
      news = await NewsService.getNewsByCategory(category)
    } else if (limit) {
      news = await NewsService.getRecentNews(parseInt(limit))
    } else {
      news = await NewsService.getAllNews()
    }

    return NextResponse.json({
      success: true,
      data: news,
      meta: {
        total: news.length,
        message: 'Noticias obtenidas exitosamente'
      }
    })

  } catch (error) {
    console.error('❌ Error en API news GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🆕 API: Creando nueva noticia')

    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.title) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El título es requerido' 
        },
        { status: 400 }
      )
    }

    // Preparar datos de la noticia
    const newsData: NewNews = {
      title: body.title.trim(),
      excerpt: body.excerpt?.trim() || null,
      content: body.content?.trim() || null,
      image_url: body.image_url?.trim() || null,
      author: body.author?.trim() || 'Admin',
      category: body.category || 'general',
      is_featured: body.is_featured || false,
      is_published: body.is_published !== undefined ? body.is_published : true,
      publish_date: body.publish_date || new Date().toISOString()
    }

    console.log('📝 Datos de la noticia a crear:', {
      title: newsData.title,
      category: newsData.category,
      is_featured: newsData.is_featured,
      is_published: newsData.is_published
    })

    const newNews = await NewsService.createNews(newsData)

    return NextResponse.json({
      success: true,
      data: newNews,
      message: 'Noticia creada exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Error en API news POST:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}