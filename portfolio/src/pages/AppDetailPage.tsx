import { ArrowLeft, Check, FileText, Info, LifeBuoy, ShieldCheck } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AppIcon, AppStoreLinks } from '../components/AppCard'
import { ProductSupportPanel } from '../components/ProductSupportPanel'
import { PORTFOLIO_APPS, appPrivacyPath, appTermsPath, getAppById } from '../data/myApps'
import { usePageMeta } from '../hooks/usePageMeta'
import { getAppLegalDoc } from '../lib/appLegal'

export function AppDetailPage() {
  const { appId } = useParams()
  const app = getAppById(appId)
  usePageMeta(app?.name ?? 'Weekend Hobbies', app?.tagline)

  if (!app) return <Navigate to="/apps" replace />
  const index = PORTFOLIO_APPS.indexOf(app)
  const hasTerms = getAppLegalDoc('terms', app.id) !== null

  return (
    <div className="min-h-svh border-b border-cyan-500/10 pb-24 pt-24">
      <div className="page-container">
        <Link
          to="/apps"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-400 transition hover:text-cyan-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Weekend Hobbies
        </Link>

        <header className="mt-6 flex flex-col gap-8 border-b border-cyan-500/15 pb-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-5">
              <AppIcon app={app} index={index} size="lg" />
              <div>
                <h1 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl">{app.name}</h1>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  {app.category} · {app.platforms.join(' · ')}
                </p>
              </div>
            </div>
            <p className="text-lg font-medium text-emerald-200/90">{app.tagline}</p>
            <p className="leading-relaxed text-slate-300">{app.description}</p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[280px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Get the app</p>
            <AppStoreLinks app={app} />
          </div>
        </header>

        <section aria-labelledby="app-features-heading" className="py-12">
          <h2 id="app-features-heading" className="text-2xl font-semibold tracking-tight text-slate-50">
            Features
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {app.features.map((f) => (
              <li key={f.title} className="rounded-2xl border border-slate-800/90 bg-slate-900/40 p-5 backdrop-blur-md">
                <h3 className="font-semibold text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{f.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {app.plans ? (
          <section aria-labelledby="app-plans-heading" className="pb-12">
            <h2 id="app-plans-heading" className="text-2xl font-semibold tracking-tight text-slate-50">
              Free vs Pro
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { label: 'Free', items: app.plans.free, tone: 'border-slate-700/90 bg-slate-900/40' },
                { label: app.plans.proLabel, items: app.plans.pro, tone: 'border-purple-500/30 bg-purple-500/5' },
              ].map((plan) => (
                <div key={plan.label} className={`rounded-2xl border p-5 backdrop-blur-md ${plan.tone}`}>
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-300">{plan.label}</h3>
                  <ul className="mt-4 space-y-2">
                    {plan.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {app.plans.note ? <p className="mt-4 text-sm text-slate-400">{app.plans.note}</p> : null}
          </section>
        ) : null}

        {app.faq?.length ? (
          <section aria-labelledby="app-faq-heading" className="pb-12">
            <h2 id="app-faq-heading" className="text-2xl font-semibold tracking-tight text-slate-50">
              FAQ
            </h2>
            <div className="mt-6 divide-y divide-slate-800/90 rounded-2xl border border-slate-800/90 bg-slate-900/40">
              {app.faq.map((item) => (
                <details key={item.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none font-medium text-slate-100 marker:hidden hover:text-cyan-200">
                    <span className="mr-2 inline-block font-mono text-cyan-400/80 transition group-open:rotate-90">›</span>
                    {item.q}
                  </summary>
                  <p className="mt-3 pl-5 text-sm leading-relaxed text-slate-300">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-label="Privacy and support" className="grid gap-4 sm:grid-cols-2">
          <Link
            to={appPrivacyPath(app.id)}
            className="group flex items-start gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 transition hover:border-emerald-400/50"
          >
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden />
            <span>
              <span className="block font-semibold text-slate-100 group-hover:text-emerald-100">Privacy policy</span>
              <span className="mt-1 block text-sm text-slate-400">
                What {app.name} stores, where, and what it never collects. Updated {app.privacyLastUpdated}.
              </span>
            </span>
          </Link>
          <Link
            to="/support"
            className="group flex items-start gap-4 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-5 transition hover:border-cyan-400/50"
          >
            <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" aria-hidden />
            <span>
              <span className="block font-semibold text-slate-100 group-hover:text-cyan-100">Support</span>
              <span className="mt-1 block text-sm text-slate-400">
                Questions, bug reports, or feedback about {app.name}.
              </span>
            </span>
          </Link>
        </section>

        {hasTerms ? (
          <Link
            to={appTermsPath(app.id)}
            className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-slate-200"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden />
            Terms of Use
          </Link>
        ) : null}

        {app.notice ? (
          <p className="mt-8 flex gap-2 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {app.notice}
          </p>
        ) : null}

        <ProductSupportPanel className="mt-12" />
      </div>
    </div>
  )
}
