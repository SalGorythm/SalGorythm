import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../data/articles'
import type { WritingTag } from '../constants/sections'
import { ArticleViewCount } from './writing/ArticleEngagement'
import { formatArticleDate, TAG_LABELS } from './writing/writingLabels'

type ArticleCardProps = {
  article: ArticleMeta
  variant?: 'default' | 'featured'
  onHover?: (slug: string | null) => void
  onTagClick?: (tag: WritingTag) => void
}

export function ArticleCard({ article, variant = 'default', onHover, onTagClick }: ArticleCardProps) {
  const featured = variant === 'featured'

  return (
    <article
      data-article-slug={article.slug}
      className={`group flex h-full flex-col rounded-2xl border bg-slate-900/35 backdrop-blur-md transition hover:border-amber-500/35 ${
        featured
          ? 'border-amber-500/25 p-6 sm:p-7'
          : 'border-slate-800/90 p-5 sm:p-6'
      }`}
      onMouseEnter={() => onHover?.(article.slug)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onTagClick?.(tag)
            }}
            className="rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[10px] font-medium text-amber-200/90 transition hover:border-amber-500/40"
          >
            {TAG_LABELS[tag]}
          </button>
        ))}
      </div>

      <h3
        className={`mt-3 font-semibold text-slate-100 group-hover:text-amber-100 ${
          featured ? 'text-xl sm:text-2xl' : 'text-lg'
        }`}
      >
        <Link
          to={`/writing/${article.slug}`}
          className="outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          {article.title}
        </Link>
      </h3>

      <p className={`mt-2 flex-1 leading-relaxed text-slate-400 ${featured ? 'text-sm sm:text-base' : 'text-sm'}`}>
        {article.excerpt}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-xs text-slate-500">
          <span>
            {formatArticleDate(article.date)} · {article.readTime} min
          </span>
          <ArticleViewCount slug={article.slug} />
        </p>
        <Link
          to={`/writing/${article.slug}`}
          className="text-xs font-medium text-cyan-300/80 transition group-hover:text-cyan-200"
        >
          Read →
        </Link>
      </div>
    </article>
  )
}
