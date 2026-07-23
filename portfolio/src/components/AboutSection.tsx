import { Mail } from 'lucide-react'
import { RECRUITER_SUMMARY } from '../data/recruiterSummary'
import { SectionHeader } from './SectionHeader'

export function AboutSection() {
  const { email, linkedin, availability } = RECRUITER_SUMMARY

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 py-20"
    >
      <div className="page-container">
        <SectionHeader
          domain="About"
          title="Production ML engineer, not slide-deck ML"
          description="Nine years shipping data systems — now focused on agents and evaluation at IBM."
          id="about-heading"
          className="mb-8 max-w-2xl"
        />
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-400 sm:text-base">
          <p>
            At <strong className="font-medium text-slate-200">IBM</strong> I work on super agents,
            evaluation agents, and staffing tooling for consulting workflows — LangChain and AutoGen
            orchestration, WatsonX.ai integrations, and eval gates before anything reaches production.
          </p>
          <p>
            Before that, at <strong className="font-medium text-slate-200">EY</strong>, I built
            endpoint automation across 25,000+ machines (Atom Bot), cybersecurity microservices
            (Quark), and NL→SQL / document Q&A systems (Quasar, Qbot). That background is why I
            care about governance and scale, not just model benchmarks.
          </p>
          <p>
            I also ship consumer iOS apps — <strong className="font-medium text-slate-200">Casette</strong>{' '}
            and <strong className="font-medium text-slate-200">EasySalah</strong> — local-first,
            no-account where possible. Same engineering bar as enterprise work, tuned for calm UX.
          </p>
          <p className="text-slate-500">{availability}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-xl border border-slate-600/80 bg-slate-900/50 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/45"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Email
          </a>
        </div>
      </div>
    </section>
  )
}
