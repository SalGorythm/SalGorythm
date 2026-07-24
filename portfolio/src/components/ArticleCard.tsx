import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../data/articles'
import type { WritingTag } from '../constants/sections'
import { ArticleNewBadge } from './writing/ArticleNewBadge'
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
  const href = `/writing/${article.slug}`
  const titleId = `article-title-${article.slug}`

  return (
    <article
      data-article-slug={article.slug}
      className={`group relative flex h-full flex-col rounded-2xl border bg-slate-900/35 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 ${
        featured
          ? 'border-amber-500/25 hover:border-amber-500/40 hover:shadow-[0_0_28px_rgba(251,191,36,0.12)]'
          : 'border-slate-800/90 hover:border-amber-500/35 hover:shadow-[0_0_24px_rgba(251,191,36,0.1)]'
      }`}
      onMouseEnter={() => onHover?.(article.slug)}
      onMouseLeave={() => onHover?.(null)}
    >
      <Link
        to={href}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
        aria-labelledby={titleId}
      >
        <span className="sr-only">Read {article.title}</span>
      </Link>

      <div
        className={`relative z-10 flex min-h-0 flex-1 flex-col pointer-events-none ${
          featured ? 'p-6 sm:p-7' : 'p-5 sm:p-6'
        }`}
      >
        <div className="pointer-events-auto flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              className="rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[10px] font-medium text-amber-200/90 transition hover:border-amber-500/40"
            >
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>

        <h3
          id={titleId}
          className={`mt-3 font-semibold text-slate-100 transition group-hover:text-amber-100 ${
            featured ? 'text-xl sm:text-2xl' : 'text-lg'
          }`}
        >
          <span className="inline-flex flex-wrap items-center gap-2">
            {article.title}
            <ArticleNewBadge date={article.date} />
          </span>
        </h3>

        <p
          className={`mt-2 min-h-0 flex-1 leading-relaxed text-slate-300 ${
            featured ? 'text-sm sm:text-base' : 'text-sm'
          }`}
        >
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
          <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-slate-400">
            <span className="truncate">
              {formatArticleDate(article.date)} · {article.readTime} min
            </span>
            <ArticleViewCount slug={article.slug} />
          </p>
          <span
            className="shrink-0 text-xs font-medium text-cyan-300/80 transition group-hover:text-cyan-200"
            aria-hidden
          >
            Read →
          </span>
        </div>
      </div>
    </article>
  )
}
