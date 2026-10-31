import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppCard } from './AppCard'
import { ProductSupportPanel } from './ProductSupportPanel'
import { PORTFOLIO_APPS, SALGORYTHM_SUPPORT_PAGE_HASH } from '../data/myApps'

export function MyAppsSection() {
  return (
    <section
      id="my-apps"
      aria-labelledby="my-apps-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 py-20"
    >
      <div className="page-container">
        <header className="mb-12 flex max-w-none flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-emerald-400/90">Weekend hobbies</p>
            <h2
              id="my-apps-heading"
              className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl"
            >
              Apps I build on weekends
            </h2>
            <p className="mt-3 text-slate-300">
              Personal side projects, built in my own time and separate from my day job — small,
              calm, local-first apps with no ads and no accounts.
            </p>
          </div>
          <Link
            to="/apps"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:border-cyan-400/60 sm:self-auto"
          >
            All hobby apps
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </header>

        <ul className="grid gap-8 lg:grid-cols-1">
          {PORTFOLIO_APPS.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} />
          ))}
        </ul>

        <ProductSupportPanel anchorId={SALGORYTHM_SUPPORT_PAGE_HASH} className="mt-12 scroll-mt-28" />
      </div>
    </section>
  )
}
