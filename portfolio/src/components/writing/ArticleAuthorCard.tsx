import { Download, Mail } from 'lucide-react'
import { BrandLogo } from '../BrandLogo'
import { RECRUITER_SUMMARY } from '../../data/recruiterSummary'

const AUTHOR_BIO =
  'Production LLM systems, agent workflows, and eval gates — IBM WatsonX and EY-scale delivery.'

export function ArticleAuthorCard() {
  const { name, navSubtitle } = RECRUITER_SUMMARY

  return (
    <aside
      aria-label="About the author"
      className="mt-14 rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 backdrop-blur-md sm:flex sm:items-center sm:gap-5 sm:p-6"
    >
      <div className="flex items-start gap-4 sm:items-center">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-500/30 bg-slate-950/80 p-1.5">
          <BrandLogo variant="icon" className="h-full w-full rounded-full" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-100">
            {name}
            <span className="font-normal text-slate-400"> — {navSubtitle}</span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{AUTHOR_BIO}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:shrink-0 sm:flex-col lg:flex-row">
        <a
          href="/#contact"
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/50 hover:bg-cyan-500/15 sm:flex-none"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden />
          Contact
        </a>
        <a
          href="/#resume"
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-600/80 bg-slate-950/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-purple-500/35 hover:text-purple-100 sm:flex-none"
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          Download résumé
        </a>
      </div>
    </aside>
  )
}
