import { ENGINEERING_DECISIONS } from '../data/engineeringDecisions'
import { SectionHeader } from './SectionHeader'

export function EngineeringDecisionLog() {
  return (
    <section
      id="engineering-log"
      aria-labelledby="engineering-log-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          domain="Trade-offs"
          title="Decisions under deadline"
          description="A few calls I made when the timeline was fixed and the trade-offs were real."
          id="engineering-log-heading"
          className="mb-10"
        />

        <div className="space-y-6">
          {ENGINEERING_DECISIONS.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 sm:p-6 backdrop-blur-md"
            >
              <h3 className="text-lg font-semibold text-slate-100">{entry.title}</h3>

              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                  <p className="text-xs font-medium text-slate-500">Why</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">{entry.context}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{entry.constraint}</p>
                </div>

                <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                  <p className="text-xs font-medium text-slate-500">What we picked</p>
                  <p className="mt-1 text-sm text-slate-200">{entry.decision}</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-500">
                    {entry.options.map((opt) => (
                      <li key={opt}>Also considered: {opt}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                    <p className="text-xs font-medium text-purple-400/90">What it cost</p>
                    <p className="mt-1 text-sm text-slate-300">{entry.tradeOff}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="text-xs font-medium text-emerald-400/90">What we got</p>
                    <p className="mt-1 text-sm text-slate-200">{entry.outcome}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
