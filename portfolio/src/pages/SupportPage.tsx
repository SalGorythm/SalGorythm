import { Link } from 'react-router-dom'
import { ProductSupportPanel } from '../components/ProductSupportPanel'
import { PORTFOLIO_APPS, SALGORYTHM_SUPPORT_PAGE_HASH, appPath, appPrivacyPath } from '../data/myApps'
import { usePageMeta } from '../hooks/usePageMeta'

export function SupportPage() {
  usePageMeta('Support', 'Support for SalGorythm apps — contact, privacy policies, and app pages.')

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

        <section aria-labelledby="support-apps-heading" className="mt-10">
          <h2 id="support-apps-heading" className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
            Apps covered
          </h2>
          <ul className="mt-4 divide-y divide-slate-800/90 rounded-2xl border border-slate-800/90 bg-slate-900/40">
            {PORTFOLIO_APPS.map((app) => (
              <li key={app.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <Link to={appPath(app.id)} className="font-semibold text-slate-100 hover:text-cyan-200">
                  {app.name}
                </Link>
                <Link to={appPrivacyPath(app.id)} className="font-mono text-xs text-slate-400 hover:text-emerald-200">
                  Privacy policy →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center font-mono text-[11px] text-slate-600">
          <Link to={`/#${SALGORYTHM_SUPPORT_PAGE_HASH}`} className="text-cyan-500/80 hover:text-cyan-400">
            Same panel on the portfolio → My apps
          </Link>
        </p>
      </div>
    </div>
  )
}
