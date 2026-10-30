import { Mail } from 'lucide-react'
import { RECRUITER_SUMMARY } from '../data/recruiterSummary'
import { SectionHeader } from './SectionHeader'
import { PORTFOLIO_APPS } from '../data/myApps'

export function AboutSection() {
  const { email, linkedin, location } = RECRUITER_SUMMARY

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 py-20"
    >
      <div className="page-container">
        <SectionHeader
          domain="About"
          title="Engineer by trade, tinkerer by habit"
          description="Nine years of building software — and a lot of curiosity about how things work."
          id="about-heading"
          className="mb-8 max-w-2xl"
        />
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
          <p>
            I&apos;m a senior data scientist and engineer. Over nine years I&apos;ve worked across
            backend services, data pipelines, and — most recently — generative AI: LLM integration,
            agent workflows, and evaluation. The Experience section below has the public-level
            outline; LinkedIn has the rest.
          </p>
          <p>
            I&apos;m happiest learning by building. This site is where that curiosity lands:{' '}
            <a href="/writing" className="text-cyan-300/90 hover:text-cyan-200">articles</a> on
            things I&apos;ve figured out, browser experiments in the sandbox, and privacy-friendly
            tools that run entirely on your device.
          </p>
          <p>
            On weekends, as a personal hobby, I build small consumer apps —{' '}
            <strong className="font-medium text-slate-200">
              {PORTFOLIO_APPS.map((app) => app.name).join(', ')}
            </strong>{' '}
            — local-first and no-account where possible. They&apos;re side projects, built in my own
            time and separate from my day job.
          </p>
          <p className="text-slate-400">{location}</p>
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
