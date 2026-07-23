import { ArrowDownRight } from 'lucide-react'

const METRICS = [
  { value: 'IBM Tech 2026', label: 'Global awardee' },
  { value: '25,000+', label: 'Endpoints automated (EY)' },
  { value: '9 years', label: 'Production engineering' },
  { value: 'New Delhi', label: 'Remote-friendly' },
] as const

export function CredibilityStrip() {
  return (
    <section
      id="credibility"
      aria-labelledby="credibility-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/50 py-10"
    >
      <div className="page-container">
        <h2 id="credibility-heading" className="sr-only">
          Credibility highlights
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <li
              key={m.label}
              className="rounded-xl border border-slate-800/90 bg-slate-900/40 px-4 py-4 text-center backdrop-blur-sm"
            >
              <p className="font-mono text-lg font-semibold text-cyan-300">{m.value}</p>
              <p className="mt-1 text-xs text-slate-400">{m.label}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center">
          <a
            href="#case-studies"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-cyan-300/90 transition hover:text-cyan-200"
          >
            See how the numbers show up in work
            <ArrowDownRight className="h-4 w-4" aria-hidden />
          </a>
        </p>
      </div>
    </section>
  )
}
