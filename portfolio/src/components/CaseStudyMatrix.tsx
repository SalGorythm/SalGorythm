import { ExternalLink, GitBranch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CASE_STUDIES } from '../data/caseStudies'
import { SectionHeader } from './SectionHeader'

export function CaseStudyMatrix() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/40 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          domain="ARCHITECTURE · CASE STUDIES"
          title="System constraint → architecture → verification"
          description="Flagship delivery mapped as repeatable case studies — constraint hook, component map, and a single low-friction proof link."
          id="case-studies-heading"
          className="mb-10"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <article
              key={study.id}
              className="flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md transition hover:border-cyan-500/30"
            >
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400/90">
                {study.domain}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-100">{study.title}</h3>

              <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400/90">
                  System constraint
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{study.constraintHook}</p>
              </div>

              <div className="mt-4 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-500/80">
                  Component map
                </p>
                <ol className="mt-2 space-y-2">
                  {study.architecture.map((node, i) => (
                    <li
                      key={node.label}
                      className="flex gap-2 rounded-lg border border-slate-800/80 bg-slate-950/50 px-2.5 py-2 text-xs"
                    >
                      <span className="shrink-0 font-mono text-cyan-400/80">{i + 1}.</span>
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
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:border-cyan-400/50"
                  >
                    <GitBranch className="h-3.5 w-3.5" aria-hidden />
                    {study.verifyLabel ?? 'Verify'}
                  </Link>
                ) : (
                  <a
                    href={study.verifyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:border-cyan-400/50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    {study.verifyLabel ?? 'Verify'}
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
