import { formatStatCount, STAT_KEYS } from '../constants/statsKeys'
import { useStats } from '../context/useStats'

const GAME_LAB_KEYS = [
  STAT_KEYS.GAME_NEURAL,
  STAT_KEYS.GAME_JAILBREAK,
  STAT_KEYS.GAME_GITMERGE,
  STAT_KEYS.GAME_TTT,
  STAT_KEYS.GAME_SIMON,
  STAT_KEYS.GAME_REFLEX,
  STAT_KEYS.GAME_CIPHER,
  STAT_KEYS.GAME_SNAKE,
  STAT_KEYS.LAB_BOIDS,
  STAT_KEYS.LAB_ROCKETS,
  STAT_KEYS.LAB_FOURIER,
] as const

/** Recruiter-facing funnel metrics from portfolio stats. */
export function RecruiterFunnelStrip({ className = '' }: { className?: string }) {
  const { configured, getCount } = useStats()

  if (!configured) return null

  const visits = getCount(STAT_KEYS.VISITOR) ?? 0
  const toolUses = (getCount(STAT_KEYS.TOOL_PDF) ?? 0) + (getCount(STAT_KEYS.TOOL_BW) ?? 0)
  const sandboxPlays = GAME_LAB_KEYS.reduce((sum, key) => sum + (getCount(key) ?? 0), 0)
  const resumeClicks = getCount(STAT_KEYS.RESUME_DOWNLOAD) ?? 0

  const metrics = [
    { label: 'Portfolio visits', value: visits },
    { label: 'Tool uses', value: toolUses },
    { label: 'Sandbox plays', value: sandboxPlays },
    { label: 'Résumé downloads', value: resumeClicks },
  ]

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-slate-800/90 bg-slate-950/50 p-5 backdrop-blur-md sm:p-6 ${className}`}
    >
      <p className="text-right text-sm font-medium text-slate-400">Site activity</p>
      <dl className="mt-3 grid flex-1 grid-cols-2 grid-rows-2 gap-3">
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            className="flex min-h-[5.25rem] flex-col justify-between rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2.5 text-right"
          >
            <dt className="font-mono text-[9px] uppercase leading-snug tracking-wider text-slate-500">
              {label}
            </dt>
            <div className="mt-2">
              <dd className="font-mono text-lg font-semibold tabular-nums text-cyan-400/95">
                {formatStatCount(value)}
              </dd>
              {value === 0 ? (
                <p className="mt-0.5 font-mono text-[9px] text-slate-500">None yet</p>
              ) : null}
            </div>
          </div>
        ))}
      </dl>
      {import.meta.env.DEV ? (
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-slate-600">
          Dev audit: if visits ≫ sandbox plays, move live demos higher; if downloads lag visits, reduce
          résumé gate friction.
        </p>
      ) : null}
    </div>
  )
}
