import { HandMetal, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { articleStatKey, formatStatCount } from '../../constants/statsKeys'
import { useStats } from '../../context/useStats'
import { hasClappedArticle, markArticleClapped, trackOncePerSession } from '../../lib/statsApi'

type ArticleEngagementProps = {
  slug: string
  className?: string
}

export function ArticleEngagement({ slug, className = '' }: ArticleEngagementProps) {
  const { configured, getCount, increment } = useStats()
  const viewKey = articleStatKey(slug, 'views')
  const clapKey = articleStatKey(slug, 'claps')
  const views = getCount(viewKey)
  const claps = getCount(clapKey)
  const [clapped, setClapped] = useState(() => hasClappedArticle(slug))
  const [clapPending, setClapPending] = useState(false)

  useEffect(() => {
    trackOncePerSession(`sg-article-view-${slug}`, () => {
      void increment(viewKey)
    })
  }, [slug, viewKey, increment])

  const onClap = async () => {
    if (clapped || clapPending) return
    setClapPending(true)
    const value = await increment(clapKey)
    if (value != null) {
      markArticleClapped(slug)
      setClapped(true)
    }
    setClapPending(false)
  }

  const hasCounts = views != null || claps != null
  if (!configured && !hasCounts) return null

  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${className}`}
      aria-label="Article engagement"
    >
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-950/50 px-3 py-1.5 font-mono text-xs text-slate-400">
        <Eye className="h-3.5 w-3.5 text-cyan-400/80" aria-hidden />
        <span className="text-cyan-300/90">{formatStatCount(views)}</span>
        <span className="text-slate-600">views</span>
      </span>

      <button
        type="button"
        onClick={() => {
          void onClap()
        }}
        disabled={clapped || clapPending}
        title={configured ? undefined : 'Live claps unavailable — counts from last deploy'}
        aria-pressed={clapped}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
          clapped
            ? 'border-amber-500/45 bg-amber-500/15 text-amber-200'
            : 'border-slate-700/80 bg-slate-950/50 text-slate-400 hover:border-amber-500/35 hover:text-amber-200/90'
        } disabled:cursor-default`}
      >
        <HandMetal className={`h-3.5 w-3.5 ${clapped ? 'text-amber-300' : 'text-amber-400/70'}`} aria-hidden />
        <span className={clapped ? 'text-amber-200' : 'text-amber-300/90'}>{formatStatCount(claps)}</span>
        <span className="text-slate-600">{clapped ? 'clapped' : 'clap'}</span>
      </button>
    </div>
  )
}

type ArticleViewCountProps = {
  slug: string
  className?: string
}

/** Compact view count for article cards on the index page. */
export function ArticleViewCount({ slug, className = '' }: ArticleViewCountProps) {
  const { configured, getCount } = useStats()
  const views = getCount(articleStatKey(slug, 'views'))

  if (views == null && !configured) return null

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-slate-500 ${className}`}
      title={`${formatStatCount(views)} views`}
    >
      <Eye className="h-3 w-3 text-cyan-400/70" aria-hidden />
      {formatStatCount(views)}
    </span>
  )
}
