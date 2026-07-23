import { Cloud, Code2, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

type Category = 'languages' | 'cloud' | 'ai'

const TABS: { id: Category; label: string; icon: typeof Code2 }[] = [
  { id: 'languages', label: 'Languages / Frameworks', icon: Code2 },
  { id: 'cloud', label: 'Cloud', icon: Cloud },
  { id: 'ai', label: 'AI / Data', icon: Sparkles },
]

const SKILLS: Record<Category, string[]> = {
  languages: [
    'Python · JavaScript',
    'FastAPI · Django · Flask',
    'ORMs (Django, SQLAlchemy)',
    'RESTful APIs · Git',
    'TypeScript / React (product surfaces)',
  ],
  cloud: [
    'Docker · Podman · Kubernetes',
    'Microservices architecture',
    'CI/CD · AWS / Azure / GCP',
    'Azure VMs · enterprise integration',
    'Ansible-driven automation',
  ],
  ai: [
    'LLM · GenAI · RAG · NLP · ML',
    'LangChain · AutoGen · prompt engineering',
    'PostgreSQL · Elasticsearch · PySpark',
    'Kafka · Confluent · Airflow · Celery',
    'Vector DB · WatsonX.ai · multi-model orchestration',
  ],
}

export function SkillsTerminal() {
  const [cat, setCat] = useState<Category>('languages')
  const lines = useMemo(() => SKILLS[cat], [cat])

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 py-20"
    >
      <div className="page-container">
        <header className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-purple-400/90">Skills</p>
          <h2
            id="skills-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
          >
            Stack
          </h2>
          <p className="mt-3 text-slate-400">
            Languages, cloud, and AI/data — grouped for quick scanning.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/60 shadow-[0_0_30px_rgba(34,211,238,0.06)] backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/90 bg-slate-900/50 px-3 py-2 sm:px-4">
            <span className="mr-1 hidden h-3 w-3 rounded-full bg-red-500/80 sm:inline" aria-hidden />
            <span className="mr-1 hidden h-3 w-3 rounded-full bg-amber-400/80 sm:inline" aria-hidden />
            <span className="mr-2 hidden h-3 w-3 rounded-full bg-emerald-400/80 sm:inline" aria-hidden />
            <span className="font-mono text-[11px] text-slate-500">user@salgorythm</span>
            <span className="font-mono text-[11px] text-cyan-500/70">:~$</span>
            <span className="font-mono text-[11px] text-slate-400">./filter-skills</span>
          </div>

          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-0 sm:p-0">
            <nav
              className="flex shrink-0 flex-row gap-2 overflow-x-auto border-slate-800/90 sm:w-56 sm:flex-col sm:border-r sm:p-4"
              aria-label="Skill categories"
            >
              {TABS.map((tab) => {
                const Icon = tab.icon
                const active = cat === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCat(tab.id)}
                    className={`flex min-w-[200px] items-center gap-2 rounded-lg border px-3 py-2.5 text-left font-mono text-xs transition sm:min-w-0 sm:text-[11px] ${
                      active
                        ? 'border-cyan-500/45 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]'
                        : 'border-transparent text-slate-400 hover:border-purple-500/25 hover:bg-slate-900/80 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-cyan-400/80" aria-hidden />
                    <span className="uppercase tracking-wider">{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="min-h-[220px] flex-1 border-t border-slate-800/90 p-4 font-mono text-sm sm:border-t-0 sm:p-6">
              <p className="text-xs text-slate-500">
                <span className="text-emerald-400/90">➜</span> output —{' '}
                <span className="text-cyan-400/90">{cat}</span>.log
              </p>
              <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-slate-300">
                {lines.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="select-none text-purple-400/80">▹</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 animate-pulse text-xs text-slate-600">
                <span className="text-cyan-500/80">_</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
