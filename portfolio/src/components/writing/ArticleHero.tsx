import { Link } from 'react-router-dom'
import type { ArticleMeta } from '../../data/articles'
import { ArticleEngagement } from './ArticleEngagement'
import { ArticleNewBadge } from './ArticleNewBadge'
import { formatArticleDate, TAG_LABELS, writingTagHref } from './writingLabels'

type ArticleHeroProps = {
  article: ArticleMeta
}

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <header className="rounded-2xl border border-slate-800/90 bg-slate-900/35 p-6 backdrop-blur-md sm:p-8">
      <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
        <Link to="/writing" className="text-cyan-300/90 transition hover:text-cyan-200">
          Writing
        </Link>
        <span aria-hidden className="mx-2 text-slate-600">
          /
        </span>
        <span className="text-slate-300">{article.title}</span>
      </nav>

      <p className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
        <span>
          {formatArticleDate(article.date)} · {article.readTime} min read
        </span>
        <ArticleNewBadge date={article.date} />
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
        {article.title}
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
        {article.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <Link
            key={tag}
            to={writingTagHref(tag)}
            className="rounded-md border border-amber-500/25 bg-amber-500/5 px-2.5 py-0.5 text-xs font-medium text-amber-200/90 transition hover:border-amber-500/45 hover:bg-amber-500/10 hover:text-amber-100"
          >
            {TAG_LABELS[tag]}
          </Link>
        ))}
      </div>

      <ArticleEngagement slug={article.slug} className="mt-6" />
    </header>
  )
}
