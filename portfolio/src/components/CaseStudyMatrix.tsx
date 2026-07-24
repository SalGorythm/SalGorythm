import { ExternalLink, GitBranch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CASE_STUDIES } from '../data/caseStudies'
import { SectionHeader } from './SectionHeader'

export function CaseStudyMatrix() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/50 py-20 backdrop-blur-sm"
    >
      <div className="page-container">
        <SectionHeader
          domain="Case studies"
          title="Three projects where the constraint shaped the build"
          description="What the system had to handle, how it was put together, and where you can poke at it."
          id="case-studies-heading"
          className="mb-10"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <article
              key={study.id}
              data-case-study-card
              className="flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition hover:border-cyan-500/30 sm:p-6"
            >
              <p className="text-xs font-medium text-purple-400/90">{study.domain}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-100">{study.title}</h3>

              <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2.5">
                <p className="text-xs font-medium text-amber-400/90">The problem</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{study.constraintHook}</p>
              </div>

              <div className="mt-4 flex-1">
                <p className="text-xs font-medium text-cyan-500/80">How it&apos;s built</p>
                <ol className="mt-2 space-y-2">
                  {study.architecture.map((node, i) => (
                    <li
                      key={node.label}
                      className="flex gap-2 rounded-lg border border-slate-800/80 bg-slate-950/50 px-2.5 py-2 text-xs"
                    >
                      <span className="shrink-0 text-cyan-400/80">{i + 1}.</span>
                      <span>
                        <span className="font-semibold text-slate-200">{node.label}</span>
                        <span className="text-slate-500"> — </span>
                        <span className="text-slate-400">{node.role}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <ul className="mt-4 space-y-1 border-t border-slate-800/80 pt-4">
                {study.impactMetrics.map((metric) => (
                  <li key={metric} className="flex gap-2 text-xs text-emerald-300/90">
                    <span aria-hidden>▸</span>
                    {metric}
                  </li>
                ))}
              </ul>

              {study.verifyHref ? (
                study.verifyHref.startsWith('/') ? (
                  <Link
                    to={study.verifyHref}
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/50"
                  >
                    <GitBranch className="h-3.5 w-3.5" aria-hidden />
                    {study.verifyLabel ?? 'Open'}
                  </Link>
                ) : (
                  <a
                    href={study.verifyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    {study.verifyLabel ?? 'Open'}
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
