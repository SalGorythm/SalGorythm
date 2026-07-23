import { Link, useParams } from 'react-router-dom'
import { ArticleBody } from '../components/writing/ArticleBody'
import { ArticleHero } from '../components/writing/ArticleHero'
import { ArticleNav } from '../components/writing/ArticleNav'
import { MobileTableOfContents, TableOfContents } from '../components/writing/TableOfContents'
import {
  extractHeadings,
  getAdjacentArticles,
  getAllArticlesParsed,
  getArticleBySlug,
} from '../lib/articles'

export function ArticlePage() {
  const { slug = '' } = useParams()
  const article = getArticleBySlug(slug)
  const allArticles = getAllArticlesParsed()

  if (!article || !article.content || article.content.startsWith('_Article')) {
    return (
      <main className="page-container py-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800/90 bg-slate-900/35 p-8 backdrop-blur-md">
          <h1 className="text-2xl font-semibold text-slate-100">Article not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            {slug ? `No content loaded for “${slug}”.` : 'Missing slug in URL.'}
          </p>
          <Link to="/writing" className="mt-4 inline-block text-cyan-300">
            ← All articles
          </Link>
        </div>
      </main>
    )
  }

  const headings = extractHeadings(article.content)
  const { prev, next } = getAdjacentArticles(slug, allArticles)
  const shareUrl = `https://salgorythm.com/writing/${slug}`

  return (
    <main className="page-container py-24">
      <div className="mx-auto max-w-6xl">
        <div className="xl:grid xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-12">
          <aside className="hidden xl:block">
            <TableOfContents headings={headings} className="sticky top-28" />
          </aside>

          <div className="min-w-0">
            <ArticleHero article={article} />
            <MobileTableOfContents headings={headings} />
            <div className="mt-10">
              <ArticleBody content={article.content} />
            </div>
            <ArticleNav prev={prev} next={next} shareUrl={shareUrl} />
          </div>
        </div>
      </div>
    </main>
  )
}
