import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Disclaimer } from "@/components/ui/disclaimer"
import { Newspaper, Star, Calendar, ExternalLink } from "lucide-react"
import Image from "next/image"
import { cn, formatNewsDate } from "@/lib/utils"
import type { NewsFormatted } from "@/lib/supabase/types"

interface NewsSectionProps {
  featuredNews: NewsFormatted[]
  recentNews: NewsFormatted[]
}

export function NewsSection({ featuredNews, recentNews }: NewsSectionProps) {
  const hasFeatured = featuredNews && featuredNews.length > 0
  const hasRecent = recentNews && recentNews.length > 0


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

  if (!hasFeatured && !hasRecent) {
    return (
      <section className="py-12">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-2">
              <Newspaper className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Últimas Noticias</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Información exclusiva en tiempo real con novedades, inconvenientes y promociones de todas las plataformas
            </p>
            <div className="text-center py-8 text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay noticias disponibles</p>
              <p className="text-xs">Las noticias aparecerán aquí próximamente</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 md:py-12">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-6 md:mb-12">
          <div className="flex items-center justify-center gap-2">
            <Newspaper className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Últimas Noticias</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Información exclusiva en tiempo real con novedades, inconvenientes y promociones de todas las plataformas
          </p>
        </div>

        <div className="space-y-12 max-w-6xl mx-auto">
          {/* Featured News */}
          {hasFeatured && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="text-xl font-semibold">Noticias Destacadas</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredNews.map((article) => (
                  <Card 
                    key={article.id} 
                    className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-yellow-200 dark:border-yellow-800"
                  >
                    <CardContent className="p-0">
                      {/* Article Image */}
                      <div className="relative h-32 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        
                        {/* Fallback */}
                        <div className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          article.imageUrl && "hidden"
                        )}>
                          <Newspaper className="h-10 w-10 text-gray-400" />
                        </div>

                        {/* Featured Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Destacada
                          </Badge>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800">
                            {getCategoryName(article.category)}
                          </Badge>
                        </div>

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      {/* Article Content */}
                      <div className="p-4 space-y-3">
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h4>
                          {article.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Article Meta */}
                        <div className="flex items-center justify-start text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatNewsDate(article.publishDate)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent News */}
          {hasRecent && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Noticias Recientes</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentNews.filter(article => !article.isFeatured).map((article) => (
                  <Card 
                    key={article.id} 
                    className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <CardContent className="p-0">
                      {/* Article Image */}
                      <div className="relative h-28 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        
                        {/* Fallback */}
                        <div className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          article.imageUrl && "hidden"
                        )}>
                          <Newspaper className="h-8 w-8 text-gray-400" />
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                            {getCategoryName(article.category)}
                          </Badge>
                        </div>

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>

                      {/* Article Content */}
                      <div className="p-4 space-y-3">
                        <div className="space-y-2">
                          <h4 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h4>
                          {article.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Article Meta */}
                        <div className="flex items-center justify-start text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatNewsDate(article.publishDate)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Show More News Button */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Ver Todas las Noticias
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto mt-8">
            <Disclaimer text="Las noticias son actualizadas regularmente. Red23 se desliga de toda responsabilidad legal." />
          </div>
        </div>
      </div>
    </section>
  )
}