import { supabase } from '@/lib/supabase/client'
import type { News, NewNews, NewsFormatted } from '@/lib/supabase/types'

export class NewsService {
  
  // Convert database news to frontend format
  private static formatNews(news: News): NewsFormatted {
    return {
      id: news.id,
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      imageUrl: news.image_url,
      author: news.author,
      category: news.category,
      isFeatured: news.is_featured,
      isPublished: news.is_published,
      publishDate: news.publish_date,
      createdAt: news.created_at,
      updatedAt: news.updated_at
    }
  }

  // Convert frontend format to database format
  private static formatNewsForDatabase(news: Partial<NewsFormatted>): Partial<News> {
    const dbNews: Partial<News> = {}
    
    if (news.title !== undefined) dbNews.title = news.title
    if (news.excerpt !== undefined) dbNews.excerpt = news.excerpt
    if (news.content !== undefined) dbNews.content = news.content
    if (news.imageUrl !== undefined) dbNews.image_url = news.imageUrl
    if (news.author !== undefined) dbNews.author = news.author
    if (news.category !== undefined) dbNews.category = news.category
    if (news.isFeatured !== undefined) dbNews.is_featured = news.isFeatured
    if (news.isPublished !== undefined) dbNews.is_published = news.isPublished
    if (news.publishDate !== undefined) dbNews.publish_date = news.publishDate
    
    return dbNews
  }

  // Get all published news
  static async getAllNews(): Promise<NewsFormatted[]> {
    try {
      console.log('📰 Obteniendo todas las noticias...')
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('publish_date', { ascending: false })

      if (error) {
        console.error('❌ Error obteniendo noticias:', error)
        throw new Error(`Error obteniendo noticias: ${error.message}`)
      }

      const formattedNews = data?.map(this.formatNews) || []
      console.log(`✅ ${formattedNews.length} noticias obtenidas`)
      return formattedNews
      
    } catch (error) {
      console.error('❌ Error en NewsService.getAllNews:', error)
      throw error
    }
  }

  // Get featured news
  static async getFeaturedNews(): Promise<NewsFormatted[]> {
    try {
      console.log('⭐ Obteniendo noticias destacadas...')
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('publish_date', { ascending: false })
        .limit(3)

      if (error) {
        console.error('❌ Error obteniendo noticias destacadas:', error)
        throw new Error(`Error obteniendo noticias destacadas: ${error.message}`)
      }

      const formattedNews = data?.map(this.formatNews) || []
      console.log(`✅ ${formattedNews.length} noticias destacadas obtenidas`)
      return formattedNews
      
    } catch (error) {
      console.error('❌ Error en NewsService.getFeaturedNews:', error)
      throw error
    }
  }

  // Get news by category
  static async getNewsByCategory(category: string): Promise<NewsFormatted[]> {
    try {
      console.log(`📂 Obteniendo noticias de categoría: ${category}`)
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .eq('category', category)
        .order('publish_date', { ascending: false })

      if (error) {
        console.error('❌ Error obteniendo noticias por categoría:', error)
        throw new Error(`Error obteniendo noticias por categoría: ${error.message}`)
      }

      const formattedNews = data?.map(this.formatNews) || []
      console.log(`✅ ${formattedNews.length} noticias de categoría ${category} obtenidas`)
      return formattedNews
      
    } catch (error) {
      console.error('❌ Error en NewsService.getNewsByCategory:', error)
      throw error
    }
  }

  // Get recent news (for news section)
  static async getRecentNews(limit: number = 6): Promise<NewsFormatted[]> {
    try {
      console.log(`📅 Obteniendo ${limit} noticias recientes...`)
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('publish_date', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('❌ Error obteniendo noticias recientes:', error)
        throw new Error(`Error obteniendo noticias recientes: ${error.message}`)
      }

      const formattedNews = data?.map(this.formatNews) || []
      console.log(`✅ ${formattedNews.length} noticias recientes obtenidas`)
      return formattedNews
      
    } catch (error) {
      console.error('❌ Error en NewsService.getRecentNews:', error)
      throw error
    }
  }

  // Get single news by ID
  static async getNewsById(id: string): Promise<NewsFormatted | null> {
    try {
      console.log(`📰 Obteniendo noticia por ID: ${id}`)
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('❌ Noticia no encontrada')
          return null
        }
        console.error('❌ Error obteniendo noticia:', error)
        throw new Error(`Error obteniendo noticia: ${error.message}`)
      }

      const formattedNews = this.formatNews(data)
      console.log(`✅ Noticia obtenida: ${formattedNews.title}`)
      return formattedNews
      
    } catch (error) {
      console.error('❌ Error en NewsService.getNewsById:', error)
      throw error
    }
  }

  // Admin methods - Create news
  static async createNews(newsData: NewNews): Promise<NewsFormatted> {
    try {
      console.log('🆕 Creando nueva noticia:', newsData.title)
      
      const { data, error } = await supabase
        .from('news')
        .insert([{
          title: newsData.title,
          excerpt: newsData.excerpt || null,
          content: newsData.content || null,
          image_url: newsData.image_url || null,
          author: newsData.author || 'Admin',
          category: newsData.category || 'general',
          is_featured: newsData.is_featured || false,
          is_published: newsData.is_published !== undefined ? newsData.is_published : true,
          publish_date: newsData.publish_date || new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('❌ Error creando noticia:', error)
        throw new Error(`Error creando noticia: ${error.message}`)
      }

      const formattedNews = this.formatNews(data)
      console.log(`✅ Noticia creada exitosamente: ${formattedNews.title}`)
      return formattedNews
      
    } catch (error) {
      console.error('❌ Error en NewsService.createNews:', error)
      throw error
    }
  }

  // Admin methods - Update news
  static async updateNews(id: string, updates: Partial<NewsFormatted>): Promise<NewsFormatted> {
    try {
      console.log(`📝 Actualizando noticia: ${id}`)
      
      const dbUpdates = this.formatNewsForDatabase(updates)
      
      const { data, error } = await supabase
        .from('news')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error actualizando noticia:', error)
        throw new Error(`Error actualizando noticia: ${error.message}`)
      }

      const formattedNews = this.formatNews(data)
      console.log(`✅ Noticia actualizada exitosamente: ${formattedNews.title}`)
      return formattedNews
      
    } catch (error) {
      console.error('❌ Error en NewsService.updateNews:', error)
      throw error
    }
  }

  // Admin methods - Delete news
  static async deleteNews(id: string): Promise<void> {
    try {
      console.log(`🗑️ Eliminando noticia: ${id}`)
      
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Error eliminando noticia:', error)
        throw new Error(`Error eliminando noticia: ${error.message}`)
      }

      console.log(`✅ Noticia eliminada exitosamente`)
      
    } catch (error) {
      console.error('❌ Error en NewsService.deleteNews:', error)
      throw error
    }
  }

  // Admin methods - Get all news (including unpublished)
  static async getAllNewsForAdmin(): Promise<NewsFormatted[]> {
    try {
      console.log('📰 Obteniendo todas las noticias para admin...')
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error obteniendo noticias para admin:', error)
        throw new Error(`Error obteniendo noticias para admin: ${error.message}`)
      }

      const formattedNews = data?.map(this.formatNews) || []
      console.log(`✅ ${formattedNews.length} noticias obtenidas para admin`)
      return formattedNews
      
    } catch (error) {
      console.error('❌ Error en NewsService.getAllNewsForAdmin:', error)
      throw error
    }
  }
}