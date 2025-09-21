import { NextRequest, NextResponse } from 'next/server'
import { NewsService } from '@/lib/services/newsService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`📰 API: Obteniendo noticia por ID: ${id}`)

    const news = await NewsService.getNewsById(id)

    if (!news) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Noticia no encontrada' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: news,
      message: 'Noticia obtenida exitosamente'
    })

  } catch (error) {
    console.error(`❌ Error en API news GET:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`📝 API: Actualizando noticia: ${id}`)

    const body = await request.json()
    
    // Preparar datos de actualización
    const updates: any = {}
    if (body.title !== undefined) updates.title = body.title.trim()
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt?.trim() || null
    if (body.content !== undefined) updates.content = body.content?.trim() || null
    if (body.image_url !== undefined) updates.imageUrl = body.image_url?.trim() || null
    if (body.author !== undefined) updates.author = body.author?.trim() || 'Admin'
    if (body.category !== undefined) updates.category = body.category
    if (body.is_featured !== undefined) updates.isFeatured = body.is_featured
    if (body.is_published !== undefined) updates.isPublished = body.is_published
    if (body.publish_date !== undefined) updates.publishDate = body.publish_date

    const updatedNews = await NewsService.updateNews(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedNews,
      message: 'Noticia actualizada exitosamente'
    })

  } catch (error) {
    console.error(`❌ Error en API news PUT:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`🗑️ API: Eliminando noticia: ${id}`)

    await NewsService.deleteNews(id)

    return NextResponse.json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    })

  } catch (error) {
    console.error(`❌ Error en API news DELETE:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}