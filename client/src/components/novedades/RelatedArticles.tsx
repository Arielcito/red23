"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, Calendar, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn, formatShortDate } from "@/lib/utils"
import type { NewsFormatted } from "@/lib/supabase/types"

interface RelatedArticlesProps {
  articles: NewsFormatted[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  const router = useRouter()


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

  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Artículos Relacionados</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="group overflow-hidden transition-all duration-300 hover:scale-102 hover:shadow-lg cursor-pointer"
            onClick={() => router.push(`/novedades/${article.id}`)}
          >
            <CardContent className="p-0">
              {/* Article Image */}
              <div className="relative h-24 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                  <Newspaper className="h-6 w-6 text-gray-400" />
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                    {getCategoryName(article.category)}
                  </Badge>
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Article Content */}
              <div className="p-3 space-y-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  {article.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatShortDate(article.publishDate)}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/novedades/${article.id}`)
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
