import { LifeBuoy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppCard } from '../components/AppCard'
import { PORTFOLIO_APPS } from '../data/myApps'
import { usePageMeta } from '../hooks/usePageMeta'

export function AppsIndexPage() {
  usePageMeta('Weekend hobbies', 'Personal side-project apps by SalGorythm — store links, features, privacy policies, and support.')

  return (
    <div className="min-h-svh border-b border-cyan-500/10 pb-24 pt-24">
      <div className="page-container">
        <header className="mb-12 flex flex-col gap-4 border-b border-cyan-500/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/90">SalGorythm</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Weekend hobbies</h1>
            <p className="mt-3 text-sm text-slate-300">
              Apps I build on weekends as personal side projects, in my own time and separate from my
              day job. All local-first: no accounts, no tracking. Each app has its own page, privacy
              policy, and a shared support channel.
            </p>
          </div>
          <Link
            to="/support"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-600/80 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200 sm:self-auto"
          >
            <LifeBuoy className="h-3.5 w-3.5" aria-hidden />
            Support
          </Link>
        </header>

        <ul className="grid gap-8">
          {PORTFOLIO_APPS.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} />
          ))}
        </ul>
      </div>
    </div>
  )
}
