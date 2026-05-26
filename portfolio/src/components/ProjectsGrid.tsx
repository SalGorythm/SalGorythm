import { useState } from 'react'
import { PROJECT_TABS, PROJECTS_BY_TAB, type ProjectTabId } from '../data/projects'

export function ProjectsGrid() {
  const [tab, setTab] = useState<ProjectTabId>('genai')
  const items = PROJECTS_BY_TAB[tab]

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
              Highlights mapped from public portfolio README and CV — architecture and outcomes
              are representative of production delivery.
            </p>
          </div>
        </header>

        <div
          className="mb-8 flex flex-wrap gap-2 rounded-xl border border-slate-800/90 bg-slate-900/35 p-2 backdrop-blur-md"
          role="tablist"
          aria-label="Project categories"
        >
          {PROJECT_TABS.map(({ id, label, icon: Icon }) => {
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
          aria-label={PROJECT_TABS.find((t) => t.id === tab)?.label}
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
