import { Activity } from 'lucide-react'
import { formatStatCount, STAT_KEYS, type StatKey } from '../constants/statsKeys'
import { useStats } from '../context/useStats'

type StatBadgeProps = {
  statKey: StatKey
  label?: string
  className?: string
}

/** Compact play/use counter chip for tools and sandbox cards. */
export function StatBadge({ statKey, label = 'plays', className = '' }: StatBadgeProps) {
  const { configured, getCount } = useStats()
  const count = getCount(statKey)

  if (!configured && count == null) return null

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-950/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-cyan-400/90 ${className}`}
      title={configured ? `${formatStatCount(count)} total ${label}` : 'Stats pending setup'}
    >
      <Activity className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
      <span>{formatStatCount(count)}</span>
      <span className="text-slate-600">{label}</span>
    </span>
  )
}

type VisitorCounterProps = {
  className?: string
}

export function VisitorCounter({ className = '' }: VisitorCounterProps) {
  const { configured, getCount } = useStats()
  const count = getCount(STAT_KEYS.VISITOR)

  if (!configured && count == null) return null

  return (
    <p
      className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.6)]" aria-hidden />
      <span>
        <span className="text-cyan-400/90">{formatStatCount(count)}</span> portfolio visits
      </span>
    </p>
  )
}
