"use client"

import Image from 'next/image'
import type { NewsFormatted } from '@/lib/supabase/types'

interface ArticleContentProps {
  article: NewsFormatted
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      {/* Article Image */}
      {article.imageUrl && (
        <div className="mb-8">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {article.excerpt && (
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>
      )}

      {/* Article Content */}
      {article.content && (
        <div
          className="text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: article.content.replace(/\n/g, '<br />')
          }}
        />
      )}

      {/* Fallback for articles without content */}
      {!article.content && article.excerpt && !article.imageUrl && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {article.excerpt}
        </p>
      )}
    </article>
  )
}
