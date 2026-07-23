import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../../data/articles'
import { formatArticleDate } from './writingLabels'

type ArticleNavProps = {
  prev: ArticleMeta | null
  next: ArticleMeta | null
  shareUrl: string
}

export function ArticleNav({ prev, next, shareUrl }: ArticleNavProps) {
  return (
    <footer className="mt-14 border-t border-slate-800/90 pt-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Share</p>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-cyan-300/90 transition hover:text-cyan-200"
        >
          LinkedIn
        </a>
      </div>

      {(prev || next) && (
        <nav
          aria-label="Adjacent articles"
          className="mt-8 grid gap-4 border-t border-slate-800/80 pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              to={`/writing/${prev.slug}`}
              className="group rounded-xl border border-slate-800/90 bg-slate-900/35 p-4 transition hover:border-amber-500/35"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Previous</p>
              <p className="mt-2 text-sm font-semibold text-slate-100 group-hover:text-cyan-200">
                {prev.title}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500">{formatArticleDate(prev.date)}</p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to={`/writing/${next.slug}`}
              className="group rounded-xl border border-slate-800/90 bg-slate-900/35 p-4 transition hover:border-amber-500/35 sm:text-right"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Next</p>
              <p className="mt-2 text-sm font-semibold text-slate-100 group-hover:text-cyan-200">
                {next.title}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500">{formatArticleDate(next.date)}</p>
            </Link>
          ) : null}
        </nav>
      )}
    </footer>
  )
}
