import { Database, Layers, Smartphone } from 'lucide-react'
import { useState } from 'react'

type TabId = 'genai' | 'data' | 'local'

type Project = {
  title: string
  blurb: string
  stack: string[]
}

const TABS: { id: TabId; label: string; icon: typeof Layers }[] = [
  { id: 'genai', label: 'Generative AI & LLMs', icon: Layers },
  { id: 'data', label: 'Data Engineering & Analytics', icon: Database },
  { id: 'local', label: 'Local-First Architecture', icon: Smartphone },
]

const PROJECTS: Record<TabId, Project[]> = {
  genai: [
    {
      title: 'Enterprise LLM rollout',
      blurb:
        'Governed deployment with evaluation loops, policy filters, and multi-tenant usage accounting for regulated industries.',
      stack: ['WatsonX.ai', 'Guardrails', 'Observability'],
    },
    {
      title: 'Multi-model orchestration',
      blurb:
        'Routing layer across Granite / Llama-class models with cost-aware selection, caching, and structured output contracts.',
      stack: ['Orchestrator', 'OpenAI-compatible APIs', 'JSON schema'],
    },
    {
      title: 'RAG knowledge mesh',
      blurb:
        'Hybrid retrieval, chunking strategies tuned per domain, and offline eval sets for regression on answer quality.',
      stack: ['Vector store', 'Embeddings', 'Eval harness'],
    },
  ],
  data: [
    {
      title: 'Cloud-native lakehouse spine',
      blurb:
        'Batch + incremental pipelines with idempotent loads, schema evolution, and data quality gates in CI.',
      stack: ['Spark / SQL', 'Airflow-style DAGs', 'dbt patterns'],
    },
    {
      title: 'Real-time analytics plane',
      blurb:
        'Low-latency aggregates for product telemetry with backpressure-aware consumers and cost dashboards.',
      stack: ['Streaming', 'Warehouse', 'Metrics'],
    },
    {
      title: 'Executive analytics cockpit',
      blurb:
        'Curated semantic layer, drill paths, and narrative automation so leaders see defensible numbers.',
      stack: ['BI embed', 'Metric defs', 'Access controls'],
    },
  ],
  local: [
    {
      title: 'Offline-first mobile shell',
      blurb:
        'Encrypted device storage, sync when online, and conflict resolution tuned for field operators.',
      stack: ['SQLite / Realm-class', 'E2EE patterns', 'Capacitor / RN'],
    },
    {
      title: 'High-performance web client',
      blurb:
        'Indexed storage, web workers for heavy transforms, and minimal network chatter for snappy UX.',
      stack: ['IndexedDB', 'Workers', 'Vite'],
    },
    {
      title: 'Privacy-preserving analytics',
      blurb:
        'On-device aggregation with optional differential-style noise before any server round-trip.',
      stack: ['Local compute', 'Consent UX', 'Edge'],
    },
  ],
}

export function ProjectsGrid() {
  const [tab, setTab] = useState<TabId>('genai')
  const items = PROJECTS[tab]

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-500/80">
              Deployed artifacts
            </p>
            <h2
              id="projects-heading"
              className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
            >
              Project <span className="text-purple-300">matrix</span>
            </h2>
            <p className="mt-3 text-slate-400">
              Representative engagements — names anonymized, architecture and outcomes are real.
            </p>
          </div>
        </header>

        <div
          className="mb-8 flex flex-wrap gap-2 rounded-xl border border-slate-800/90 bg-slate-900/35 p-2 backdrop-blur-md"
          role="tablist"
          aria-label="Project categories"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-center font-mono text-[11px] uppercase tracking-wider transition min-[420px]:flex-none sm:px-4 ${
                  active
                    ? 'border-cyan-500/45 bg-cyan-500/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                    : 'border-transparent text-slate-400 hover:border-purple-500/25 hover:bg-slate-900/80 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">
                  {id === 'genai' ? 'GenAI' : id === 'data' ? 'Data' : 'Local'}
                </span>
              </button>
            )
          })}
        </div>

        <div
          role="tabpanel"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          aria-label={TABS.find((t) => t.id === tab)?.label}
        >
          {items.map((project) => (
            <article
              key={project.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 shadow-[0_0_0_0_rgba(0,0,0,0)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                aria-hidden
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-purple-500/10 blur-3xl" />
              </div>
              <h3 className="relative text-lg font-semibold text-slate-50">{project.title}</h3>
              <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                {project.blurb}
              </p>
              <ul className="relative mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s}>
                    <span className="inline-flex rounded-md border border-purple-500/25 bg-purple-500/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-purple-200/90">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
