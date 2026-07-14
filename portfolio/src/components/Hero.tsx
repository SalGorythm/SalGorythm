import { ArrowDownRight, Code2, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RECRUITER_SUMMARY } from '../data/recruiterSummary'
import { RecruiterCvGate } from './RecruiterCvGate'

export function Hero() {
  const { valueHook, primaryStack, impactMetric, availability, email, github, linkedin } =
    RECRUITER_SUMMARY

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 pb-20 pt-28 sm:pt-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-8">
            <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan-500/25 bg-slate-900/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/90 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              IBM Tech 2026 · Agentic AI · 9+ years
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
                <span className="text-slate-200">Salman Akhatar</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                Production GenAI, agentic workflows, and cybersecurity automation — from 25,000+
                endpoint deployments at EY to WatsonX-class orchestration at IBM.
              </p>
            </div>

            {/* High-contrast validation strip */}
            <div className="space-y-2 rounded-xl border border-cyan-500/30 bg-slate-950/70 p-4 font-mono text-xs sm:text-sm">
              <p>
                <span className="font-bold uppercase tracking-wider text-cyan-400">Value hook:</span>{' '}
                <span className="text-slate-200">{valueHook}</span>
              </p>
              <p>
                <span className="font-bold uppercase tracking-wider text-cyan-400">Primary stack:</span>{' '}
                <span className="text-slate-300">{primaryStack}</span>
              </p>
              <p>
                <span className="font-bold uppercase tracking-wider text-cyan-400">Impact metric:</span>{' '}
                <span className="text-emerald-300/95">{impactMetric}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
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

            {/* Step 2 — code proof */}
            <div className="rounded-xl border border-slate-800/90 bg-slate-900/35 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-purple-400/90">
                Step 2 · code proof
              </p>
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

          <div className="relative lg:sticky lg:top-28">
            <RecruiterCvGate variant="compact" />
          </div>
        </div>
      </div>
    </section>
  )
}
