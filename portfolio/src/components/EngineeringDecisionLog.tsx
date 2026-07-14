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
          domain="ENGINEERING · DECISION LOG"
          title="Trade-offs under real delivery pressure"
          description="How choices were made — context, constraints, options, and outcomes. Grounded narrative, not buzzword soup."
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

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Context
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-300">{entry.context}</dd>
                </div>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-amber-400/90">
                    Constraint
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-300">{entry.constraint}</dd>
                </div>
              </dl>

              <div className="mt-3 rounded-lg border border-slate-800/80 bg-slate-950/40 p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Options considered
                </p>
                <ul className="mt-2 space-y-1">
                  {entry.options.map((opt) => (
                    <li key={opt} className="text-sm text-slate-400">
                      · {opt}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/5 p-3 sm:col-span-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/90">
                    Decision
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{entry.decision}</p>
                </div>
                <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-purple-400/90">
                    Trade-off
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{entry.tradeOff}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/90">
                    Outcome
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{entry.outcome}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
