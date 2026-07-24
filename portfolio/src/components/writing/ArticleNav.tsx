import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../../data/articles'
import { ArticleShare } from './ArticleShare'
import { RelatedArticles } from './RelatedArticles'
import { formatArticleDate } from './writingLabels'

type ArticleNavProps = {
  prev: ArticleMeta | null
  next: ArticleMeta | null
  related: ArticleMeta[]
  shareUrl: string
  title: string
}

function AdjacentArticleLink({
  article,
  direction,
}: {
  article: ArticleMeta
  direction: 'prev' | 'next'
}) {
  const isNext = direction === 'next'

  return (
    <Link
      to={`/writing/${article.slug}`}
      className={`group flex h-full flex-col rounded-xl border border-slate-800/90 bg-slate-900/35 p-4 transition hover:border-amber-500/35 ${
        isNext ? 'sm:items-end sm:text-right' : ''
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {isNext ? 'Next' : 'Previous'}
      </p>
      <p
        className={`mt-2 text-sm font-semibold text-slate-100 transition group-hover:text-cyan-200 ${
          isNext ? 'sm:text-right' : ''
        }`}
      >
        {article.title}
      </p>
      <p className={`mt-1 font-mono text-xs text-slate-400 ${isNext ? 'sm:text-right' : ''}`}>
        {formatArticleDate(article.date)}
      </p>
    </Link>
  )
}

function AdjacentArticlePlaceholder({ direction }: { direction: 'prev' | 'next' }) {
  const isNext = direction === 'next'

  return (
    <div
      className={`flex h-full flex-col rounded-xl border border-dashed border-slate-800/70 bg-slate-950/25 p-4 ${
        isNext ? 'sm:items-end sm:text-right' : ''
      }`}
      aria-hidden
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
        {isNext ? 'Next' : 'Previous'}
      </p>
      <p className={`mt-2 text-sm text-slate-600 ${isNext ? 'sm:text-right' : ''}`}>
        {isNext ? 'Latest article' : 'End of archive'}
      </p>
    </div>
  )
}

export function ArticleNav({ prev, next, related, shareUrl, title }: ArticleNavProps) {
  return (
    <footer className="mt-10 border-t border-slate-800/90 pt-10">
      <RelatedArticles articles={related} />

      <div className={related.length > 0 ? 'mt-10 border-t border-slate-800/90 pt-10' : ''}>
        <ArticleShare shareUrl={shareUrl} title={title} />
      </div>

      <nav
        aria-label="Adjacent articles"
        className="mt-8 grid gap-4 border-t border-slate-800/80 pt-8 sm:grid-cols-2"
      >
        {prev ? (
          <AdjacentArticleLink article={prev} direction="prev" />
        ) : (
          <AdjacentArticlePlaceholder direction="prev" />
        )}
        {next ? (
          <AdjacentArticleLink article={next} direction="next" />
        ) : (
          <AdjacentArticlePlaceholder direction="next" />
        )}
      </nav>
    </footer>
  )
}
