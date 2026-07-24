import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArticleCard } from '../components/ArticleCard'
import { SectionHeader } from '../components/SectionHeader'
import { WritingFeedBar } from '../components/writing/WritingFeedBar'
import { parseWritingTagParam, TAG_LABELS } from '../components/writing/writingLabels'
import { WRITING_TAGS, type WritingTag } from '../constants/sections'
import { getFeaturedArticles } from '../data/articles'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { getAllArticlesParsed } from '../lib/articles'

const SEARCH_DEBOUNCE_MS = 300

function articleMatchesQuery(
  article: ReturnType<typeof getAllArticlesParsed>[number],
  q: string,
): boolean {
  const needle = q.toLowerCase()
  return (
    article.title.toLowerCase().includes(needle) ||
    article.excerpt.toLowerCase().includes(needle) ||
    article.tags.some((t) => t.includes(needle) || TAG_LABELS[t].toLowerCase().includes(needle))
  )
}

export function WritingIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [queryInput, setQueryInput] = useState(urlQuery)
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery)

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery)
    setQueryInput(urlQuery)
  }

  const debouncedQuery = useDebouncedValue(queryInput, SEARCH_DEBOUNCE_MS)

  const tagParam = parseWritingTagParam(searchParams.get('tag'))
  const tag: WritingTag | 'all' = tagParam ?? 'all'

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    const next = new URLSearchParams(window.location.search)
    const current = (next.get('q') ?? '').trim()
    if (trimmed === current) return
    if (trimmed) next.set('q', trimmed)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }, [debouncedQuery, setSearchParams])

  const setTag = (next: WritingTag | 'all') => {
    const nextParams = new URLSearchParams(searchParams)
    if (next === 'all') nextParams.delete('tag')
    else nextParams.set('tag', next)
    setSearchParams(nextParams, { replace: true })
  }

  const clearFilters = () => {
    setQueryInput('')
    setSearchParams({}, { replace: true })
  }

  const articles = useMemo(() => getAllArticlesParsed(), [])
  const featuredSlugs = useMemo(() => new Set(getFeaturedArticles().map((a) => a.slug)), [])

  const trimmedQuery = debouncedQuery.trim()
  const hasActiveFilters = tag !== 'all' || trimmedQuery.length > 0

  const filtered = articles.filter((a) => {
    if (tag !== 'all' && !a.tags.includes(tag)) return false
    if (trimmedQuery && !articleMatchesQuery(a, trimmedQuery)) return false
    return true
  })

  const showFeatured = tag === 'all' && !trimmedQuery
  const featured = showFeatured ? filtered.filter((a) => featuredSlugs.has(a.slug)) : []
  const archive = showFeatured ? filtered.filter((a) => !featuredSlugs.has(a.slug)) : filtered

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.type = 'application/rss+xml'
    link.title = 'SalGorythm Writing'
    link.href = '/writing.rss'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <main className="page-container py-24">
      <SectionHeader
        domain="Writing"
        title="Production ML notes"
        description="Technical articles on agents, prompting, Python, and deployment — grounded in IBM WatsonX and EY delivery work."
        className="mb-6"
      />
      <p className="mb-6">
        <Link to="/" className="text-sm text-cyan-300/90 transition hover:text-cyan-200">
          ← Back to portfolio
        </Link>
      </p>

      <WritingFeedBar />

      <div className="sticky top-16 z-20 -mx-4 mb-10 border-b border-slate-800/90 bg-neutral-950/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTag('all')}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  tag === 'all'
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-100'
                    : 'border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                All ({articles.length})
              </button>
              {WRITING_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    tag === t
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-100'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {TAG_LABELS[t]}
                </button>
              ))}
            </div>
            <p className="mt-3 font-mono text-xs text-slate-400" aria-live="polite">
              Showing {filtered.length} of {articles.length}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 lg:max-w-xs">
            <input
              type="search"
              placeholder="Search titles, tags…"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-500/45"
              aria-label="Search articles"
            />
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start rounded-lg border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500/35 hover:text-cyan-200"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/35 p-10 text-center backdrop-blur-md">
          <p className="text-sm text-slate-300">No articles match — clear filters</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/50"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {featured.length > 0 ? (
            <section aria-labelledby="featured-writing" className="mb-12">
              <h2
                id="featured-writing"
                className="mb-5 text-sm font-medium uppercase tracking-wide text-amber-400/90"
              >
                Featured
              </h2>
              <ul className="grid items-stretch gap-6 lg:grid-cols-3">
                {featured.map((article) => (
                  <li key={article.slug} className="min-h-0">
                    <ArticleCard article={article} variant="featured" onTagClick={setTag} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {archive.length > 0 ? (
            <section aria-labelledby="all-writing">
              <h2 id="all-writing" className="mb-5 text-sm font-medium uppercase tracking-wide text-slate-500">
                {showFeatured ? 'All articles' : 'Results'}
              </h2>
              <ul className="grid items-stretch gap-6 sm:grid-cols-2">
                {archive.map((article) => (
                  <li key={article.slug} className="min-h-0">
                    <ArticleCard article={article} onTagClick={setTag} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </main>
  )
}
