import { ArticleCard } from '../ArticleCard'
import type { ArticleMeta } from '../../data/articles'

type RelatedArticlesProps = {
  articles: ArticleMeta[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section aria-labelledby="related-articles-heading" className="mt-10 border-t border-slate-800/90 pt-10">
      <h2
        id="related-articles-heading"
        className="mb-5 text-sm font-medium uppercase tracking-wide text-slate-500"
      >
        Related articles
      </h2>
      <ul
        className={`grid items-stretch gap-5 ${
          articles.length === 1
            ? 'grid-cols-1'
            : articles.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {articles.map((article) => (
          <li key={article.slug} className="min-h-0">
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  )
}
