import { BrainCircuit, Building2, ChevronRight, Globe2, Lock } from 'lucide-react'
import { useState } from 'react'

type Role = {
  id: string
  org: string
  title: string
  period: string
  summary: string
  tags: string[]
  icon: typeof Building2
}

const ROLES: Role[] = [
  {
    id: 'ey',
    org: 'Big Four / EY-class delivery',
    title: 'Senior Data Science & Advisory',
    period: '2018 — Present',
    summary:
      'Led analytics and modeling workstreams for Fortune-scale clients: regulated reporting, risk analytics, and executive-ready insights with audit-grade rigor.',
    tags: ['Stakeholder governance', 'Model validation', 'Executive storytelling'],
    icon: Building2,
  },
  {
    id: 'enterprise',
    org: 'Enterprise consulting',
    title: 'Principal Consultant · Data & AI',
    period: 'Multi-industry',
    summary:
      'End-to-end solutioning from discovery to production: data contracts, MLOps patterns, and cross-functional pods spanning engineering, security, and product.',
    tags: ['Pod leadership', 'Architecture', 'Value framing'],
    icon: Globe2,
  },
  {
    id: 'cyber',
    org: 'Cybersecurity-informed analytics',
    title: 'Secure data platforms',
    period: 'Ongoing',
    summary:
      'Designed telemetry and analytical surfaces with threat-aware controls, least-privilege access patterns, and defensible data lineage for sensitive workloads.',
    tags: ['Zero-trust alignment', 'Telemetry', 'Compliance'],
    icon: Lock,
  },
  {
    id: 'llm',
    org: 'LLM architectures',
    title: 'Multi-model orchestration',
    period: 'GenAI era',
    summary:
      'Production patterns for routing, evaluation, guardrails, and enterprise deployments — including WatsonX-style stacks and Granite/Llama-style model mixes.',
    tags: ['WatsonX.ai', 'Granite / Llama', 'RAG & eval'],
    icon: BrainCircuit,
  },
]

export function ExperienceTimeline() {
  const [openId, setOpenId] = useState<string>(ROLES[0]?.id ?? '')

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-500/80">
            Trace / timeline
          </p>
          <h2
            id="experience-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
          >
            Senior roles &{' '}
            <span className="text-purple-300 text-glow-purple">high-trust delivery</span>
          </h2>
          <p className="mt-3 text-slate-400">
            Select a node to expand mission context. Optimized for recruiters scanning depth
            quickly.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <ol className="relative space-y-0 border-l border-cyan-500/20 pl-6">
            {ROLES.map((role, index) => {
              const active = openId === role.id
              return (
                <li key={role.id} className="pb-10 last:pb-2">
                  <span
                    className={`absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 transition ${
                      active
                        ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]'
                        : 'bg-slate-600'
                    }`}
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={() => setOpenId(role.id)}
                    className={`group w-full rounded-xl border px-4 py-3 text-left transition sm:px-5 sm:py-4 ${
                      active
                        ? 'border-cyan-500/45 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.1)]'
                        : 'border-transparent bg-slate-900/30 hover:border-purple-500/25 hover:bg-slate-900/55'
                    }`}
                    aria-expanded={active}
                    aria-controls={`role-panel-${role.id}`}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      Node {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-100">{role.org}</span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 text-cyan-400 transition group-hover:translate-x-0.5 ${
                          active ? 'rotate-90' : ''
                        }`}
                        aria-hidden
                      />
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">{role.title}</span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="min-h-[280px]">
            {ROLES.map((role) => {
              if (role.id !== openId) return null
              const Icon = role.icon
              return (
                <article
                  key={role.id}
                  id={`role-panel-${role.id}`}
                  className="h-full rounded-2xl border border-purple-500/25 bg-slate-900/40 p-6 shadow-[0_0_35px_rgba(168,85,247,0.08)] backdrop-blur-md sm:p-8"
                  role="region"
                  aria-label={role.org}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-700/70 pb-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/35 bg-purple-500/10 text-purple-300">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-50">{role.title}</h3>
                        <p className="font-mono text-xs text-cyan-400/90">{role.period}</p>
                      </div>
                    </div>
                    <span className="rounded-md border border-slate-700/80 bg-slate-950/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {role.org}
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {role.summary}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {role.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 font-mono text-[11px] text-cyan-200/90">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
