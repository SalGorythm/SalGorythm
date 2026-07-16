import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PROJECT_TABS,
  PROJECTS_BY_TAB,
  VERTICAL_LENSES,
  type ProjectTabId,
  type ProjectVertical,
} from '../data/projects'
import { SectionHeader } from './SectionHeader'

export function ProjectsGrid() {
  const [tab, setTab] = useState<ProjectTabId>('genai')
  const [vertical, setVertical] = useState<ProjectVertical>('enterprise')

  const items = useMemo(() => {
    const tabItems = PROJECTS_BY_TAB[tab]
    return [...tabItems]
      .filter((p) => p.verticals.includes(vertical))
      .sort((a, b) => {
        const aPrimary = a.verticals[0] === vertical ? 0 : 1
        const bPrimary = b.verticals[0] === vertical ? 0 : 1
        return aPrimary - bPrimary
      })
  }, [tab, vertical])

  const displayItems = items.length > 0 ? items : PROJECTS_BY_TAB[tab]

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          domain="Projects"
          title="Selected work"
          description="Filter by context — enterprise scale, GenAI delivery, or local-first product work."
          id="projects-heading"
          className="mb-8"
        />

        <p className="mb-3 text-sm font-medium text-slate-500">Filter by context</p>

        <div
          className="mb-4 flex flex-wrap gap-2 rounded-xl border border-purple-500/20 bg-purple-500/5 p-2"
          role="tablist"
          aria-label="Target vertical"
        >
          {VERTICAL_LENSES.map(({ id, label }) => {
            const active = vertical === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setVertical(id)}
                className={`rounded-lg border px-3 py-2 text-sm transition sm:px-4 ${
                  active
                    ? 'border-purple-500/45 bg-purple-500/15 text-purple-100'
                    : 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

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
          {displayItems.map((project) => (
            <article
              key={project.href ? `${project.title}-${project.href}` : project.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 shadow-[0_0_0_0_rgba(0,0,0,0)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/90">
                {project.metrics[vertical]}
              </p>
              <h3 className="relative mt-2 text-lg font-semibold text-slate-50">{project.title}</h3>
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
              {project.href ? (
                project.href.startsWith('/') ? (
                  <Link
                    to={project.href}
                    className="relative mt-4 inline-flex items-center gap-1 font-mono text-xs font-medium text-cyan-400/95 underline-offset-4 transition hover:text-cyan-300 hover:underline"
                  >
                    {project.linkLabel ?? 'Open link'}
                    <span aria-hidden>→</span>
                  </Link>
                ) : (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative mt-4 inline-flex items-center gap-1 font-mono text-xs font-medium text-cyan-400/95 underline-offset-4 transition hover:text-cyan-300 hover:underline"
                  >
                    {project.linkLabel ?? 'Open link'}
                    <span aria-hidden>↗</span>
                  </a>
                )
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
