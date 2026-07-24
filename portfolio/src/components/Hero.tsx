import { ArrowDownRight, Code2, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RECRUITER_SUMMARY } from '../data/recruiterSummary'

export function Hero() {
  const { tagline, stack, outcome, availability, email, github, linkedin } = RECRUITER_SUMMARY

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/40 pb-20 pt-28 backdrop-blur-sm sm:pt-32"
    >
      <div className="page-container">
        <div className="grid gap-10 lg:grid-cols-1 lg:gap-12">
          <div className="space-y-8">
            <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan-500/25 bg-slate-900/50 px-3 py-1 text-sm text-cyan-400/90">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              IBM · Senior data scientist · 9 years
            </p>

            <div className="space-y-4">
              <h1
                id="hero-heading"
                className="text-4xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl lg:text-6xl"
              >
                <span className="text-glow-cyan bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Senior Data Scientist
                </span>
                <br />
                <span className="text-slate-200">{RECRUITER_SUMMARY.name}</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">{tagline}</p>
            </div>

            <div className="space-y-2 rounded-xl border border-slate-800/90 bg-slate-950/60 p-5 text-sm leading-relaxed sm:p-6">
              <p className="text-slate-300">{stack}</p>
              <p className="text-emerald-300/95">{outcome}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-cyan-500/80" aria-hidden />
                {availability}
              </span>
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-11 items-center gap-1.5 text-cyan-300/90 transition hover:text-cyan-200"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {email}
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 leading-[44px] text-cyan-300/90 transition hover:text-cyan-200"
              >
                LinkedIn
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#case-studies"
                className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-sm font-medium text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition hover:scale-[1.02] hover:border-cyan-400/60 hover:bg-cyan-500/15"
              >
                View case studies
                <ArrowDownRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#resume"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-900/50 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200"
              >
                Download résumé
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-900/50 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-500/40 hover:text-purple-200"
              >
                Contact
              </a>
              <a
                href="#live-demos"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-purple-500/35 bg-purple-500/10 px-5 py-3 text-sm font-medium text-purple-100 transition hover:border-purple-400/50"
              >
                Live demos
              </a>
            </div>

            <div className="rounded-xl border border-slate-800/90 bg-slate-900/35 p-5 sm:p-6">
              <p className="text-sm font-medium text-slate-300">Code &amp; experiments</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-950/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500/35 hover:text-cyan-100"
                >
                  <Code2 className="h-4 w-4" aria-hidden />
                  GitHub
                </a>
                <Link
                  to="/sandbox"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/45"
                >
                  Sandbox
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:border-emerald-400/45"
                >
                  Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
