import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArticleCard } from '../components/ArticleCard'
import { SectionHeader } from '../components/SectionHeader'
import { TAG_LABELS } from '../components/writing/writingLabels'
import { WRITING_TAGS, type WritingTag } from '../constants/sections'
import { getFeaturedArticles } from '../data/articles'
import { getAllArticlesParsed } from '../lib/articles'

export function WritingIndexPage() {
  const [tag, setTag] = useState<WritingTag | 'all'>('all')
  const [query, setQuery] = useState('')
  const articles = useMemo(() => getAllArticlesParsed(), [])
  const featuredSlugs = useMemo(() => new Set(getFeaturedArticles().map((a) => a.slug)), [])

  const filtered = articles.filter((a) => {
    if (tag !== 'all' && !a.tags.includes(tag)) return false
    if (query.trim()) {
      const q = query.toLowerCase()
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.includes(q) || TAG_LABELS[t].toLowerCase().includes(q))
      )
    }
    return true
  })

  const showFeatured = tag === 'all' && !query.trim()
  const featured = showFeatured ? filtered.filter((a) => featuredSlugs.has(a.slug)) : []
  const archive = showFeatured ? filtered.filter((a) => !featuredSlugs.has(a.slug)) : filtered

  return (
    <main className="page-container py-24">
      <SectionHeader
        domain="Writing"
        title="Production ML notes"
        description="Technical articles on agents, prompting, Python, and deployment — grounded in IBM WatsonX and EY delivery work."
        className="mb-6"
      />
      <p className="mb-10">
        <Link to="/" className="text-sm text-cyan-300/90 transition hover:text-cyan-200">
          ← Back to portfolio
        </Link>
      </p>

      <div className="sticky top-16 z-20 -mx-4 mb-10 border-b border-slate-800/90 bg-neutral-950/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
          <input
            type="search"
            placeholder="Search titles, tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-500/45 lg:max-w-xs"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/35 p-10 text-center backdrop-blur-md">
          <p className="text-sm text-slate-400">No articles match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setTag('all')
              setQuery('')
            }}
            className="mt-4 text-sm text-cyan-300/90 hover:text-cyan-200"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {featured.length > 0 ? (
            <section aria-labelledby="featured-writing" className="mb-12">
              <h2 id="featured-writing" className="mb-5 text-sm font-medium uppercase tracking-wide text-amber-400/90">
                Featured
              </h2>
              <ul className="grid gap-6 lg:grid-cols-3">
                {featured.map((article) => (
                  <li key={article.slug} className="min-h-full">
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
              <ul className="grid gap-6 sm:grid-cols-2">
                {archive.map((article) => (
                  <li key={article.slug} className="min-h-full">
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
