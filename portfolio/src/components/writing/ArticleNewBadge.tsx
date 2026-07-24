import { isArticleNew } from './writingLabels'

type ArticleNewBadgeProps = {
  date: string
  className?: string
}

export function ArticleNewBadge({ date, className = '' }: ArticleNewBadgeProps) {
  if (!isArticleNew(date)) return null

  return (
    <span
      className={`inline-flex items-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-200/95 ${className}`}
    >
      New
    </span>
  )
}
