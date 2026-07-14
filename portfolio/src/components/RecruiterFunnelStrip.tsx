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
      className={`rounded-2xl border border-slate-800/90 bg-slate-950/50 p-4 backdrop-blur-md ${className}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
        Velocity · engagement funnel
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2">
            <dt className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{label}</dt>
            <dd className="mt-1 font-mono text-lg font-semibold text-cyan-400/95">
              {formatStatCount(value)}
            </dd>
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
