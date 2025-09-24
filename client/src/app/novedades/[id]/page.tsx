"use client"

import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/AppLayout"
import { useNewsDetail } from "@/lib/hooks/useNewsDetail"
import { ArticleContent } from "@/components/novedades/ArticleContent"
import { RelatedArticles } from "@/components/novedades/RelatedArticles"
import { ShareButtons } from "@/components/novedades/ShareButtons"
import { LoadingState } from "@/components/novedades/LoadingState"
import { ErrorState } from "@/components/novedades/ErrorState"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function NoticiaIndividualPage() {
  const params = useParams()
  const router = useRouter()
  const newsId = params.id as string

  const { 
    article, 
    relatedArticles, 
    isLoading, 
    error 
  } = useNewsDetail(newsId)

  // Handle loading state
  if (isLoading) {
    return (
      <AppLayout 
        title="Cargando noticia..." 
        subtitle="Obteniendo el contenido del artículo"
        showBackButton={true}
        backHref="/novedades"
      >
        <LoadingState />
      </AppLayout>
    )
  }

  // Handle error state
  if (error || !article) {
    return (
      <AppLayout 
        title="Error" 
        subtitle="No se pudo cargar la noticia"
        showBackButton={true}
        backHref="/novedades"
      >
        <ErrorState 
          error={error || "La noticia no se encuentra disponible"} 
        />
      </AppLayout>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Get category display name
  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'general': 'General',
      'announcements': 'Anuncios',
      'guides': 'Guías',
      'promotions': 'Promociones'
    }
    return categories[category] || category
  }

  return (
    <AppLayout
      title={article.title}
      subtitle={`Publicado el ${formatDate(article.publishDate)}`}
      showBackButton={true}
      backHref="/novedades"
      badge={article.isFeatured ? {
        text: "Destacada",
        variant: "secondary",
        className: "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800"
      } : undefined}
    >
      <div className="space-y-8">
        {/* Back Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/novedades")}
            className="hover:bg-transparent p-0 h-auto font-normal"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a Novedades
          </Button>
          <span>›</span>
          <Badge variant="outline" className="text-xs">
            {getCategoryName(article.category)}
          </Badge>
          <span>›</span>
          <span className="line-clamp-1">{article.title}</span>
        </div>

        {/* Article Metadata */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.publishDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <Badge variant="secondary" className="text-xs">
                {getCategoryName(article.category)}
              </Badge>
            </div>
          </div>

          {/* Share Buttons */}
          <ShareButtons
            title={article.title}
            url={`${window.location.origin}/novedades/${article.id}`}
            excerpt={article.excerpt || undefined}
          />
        </div>

        {/* Main Article Content */}
        <ArticleContent article={article} />

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <RelatedArticles articles={relatedArticles} />
          </div>
        )}
      </div>
    </AppLayout>
  )
}