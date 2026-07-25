import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArticleAuthorCard } from '../components/writing/ArticleAuthorCard'
import { ArticleBody } from '../components/writing/ArticleBody'
import { ArticleHero } from '../components/writing/ArticleHero'
import { ArticleNav } from '../components/writing/ArticleNav'
import { ReadingProgressBar } from '../components/writing/ReadingProgressBar'
import { TableOfContents } from '../components/writing/TableOfContents'
import { useArticlePageMeta } from '../hooks/useArticlePageMeta'
import {
  extractHeadings,
  getAdjacentArticles,
  getAllArticlesParsed,
  getArticleBySlug,
  getRelatedArticles,
  type ParsedArticle,
} from '../lib/articles'

export function ArticlePage() {
  const { slug = '' } = useParams()
  const article = getArticleBySlug(slug)

  if (!article || !article.content || article.content.startsWith('_Article')) {
    return (
      <main className="page-container py-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800/90 bg-slate-900/35 p-8 backdrop-blur-md">
          <h1 className="text-2xl font-semibold text-slate-100">Article not found</h1>
          <p className="mt-2 text-sm text-slate-300">
            {slug ? `No content loaded for “${slug}”.` : 'Missing slug in URL.'}
          </p>
          <Link to="/writing" className="mt-4 inline-block text-cyan-300">
            ← All articles
          </Link>
        </div>
      </main>
    )
  }

  return <ArticlePageContent article={article} slug={slug} />
}

function ArticlePageContent({ article, slug }: { article: ParsedArticle; slug: string }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const allArticles = getAllArticlesParsed()
  useArticlePageMeta(article)

  const headings = extractHeadings(article.content)
  const { prev, next } = getAdjacentArticles(slug, allArticles)
  const related = getRelatedArticles(slug, article.tags, 3, allArticles)
  const shareUrl = `https://salgorythm.com/writing/${slug}`

  return (
    <>
      <ReadingProgressBar targetRef={bodyRef} />
      <main className="page-container py-24">
        <div className="mx-auto max-w-6xl">
          <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <aside className="hidden lg:block">
              <TableOfContents headings={headings} className="sticky top-28" />
            </aside>

            <div className="min-w-0">
              <ArticleHero article={article} />
              <div ref={bodyRef} className="mt-10">
                <ArticleBody content={article.content} />
              </div>
              <ArticleAuthorCard />
              <ArticleNav
                prev={prev}
                next={next}
                related={related}
                shareUrl={shareUrl}
                title={article.title}
                shareBlurb={article.shareBlurb}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
