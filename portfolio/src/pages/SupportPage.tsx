import { Link } from 'react-router-dom'
import { ProductSupportPanel } from '../components/ProductSupportPanel'
import { SALGORYTHM_SUPPORT_PAGE_HASH } from '../data/myApps'

export function SupportPage() {
  return (
    <div className="min-h-svh border-b border-cyan-500/10 pb-24 pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-cyan-500/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-purple-400/90">
              SalGorythm
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Support
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              Official support page for SalGorythm apps and tools — use this URL in App Store
              Connect, Google Play Console, and privacy / help disclosures.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-600/80 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200"
          >
            ← Portfolio
          </Link>
        </header>

        <ProductSupportPanel className="scroll-mt-28" />

        <p className="mt-10 text-center font-mono text-[11px] text-slate-600">
          <Link to={`/#${SALGORYTHM_SUPPORT_PAGE_HASH}`} className="text-cyan-500/80 hover:text-cyan-400">
            Same panel on the portfolio → My apps
          </Link>
        </p>
      </div>
    </div>
  )
}
