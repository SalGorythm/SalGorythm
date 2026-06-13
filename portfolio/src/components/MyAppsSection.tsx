import { Check, ExternalLink, Globe, Smartphone } from 'lucide-react'
import type { ReactNode } from 'react'
import { ProductSupportPanel } from './ProductSupportPanel'
import { PORTFOLIO_APPS, SALGORYTHM_SUPPORT_PAGE_HASH } from '../data/myApps'

function StoreLink({
  href,
  children,
  variant,
}: {
  href: string
  children: ReactNode
  variant: 'apple' | 'web' | 'play'
}) {
  const base =
    'inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider transition sm:flex-none'
  const styles =
    variant === 'apple'
      ? 'border-slate-600 bg-slate-900/80 text-slate-100 hover:border-cyan-500/45 hover:text-cyan-100'
      : variant === 'play'
        ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-100 hover:border-emerald-400/50'
        : 'border-purple-500/35 bg-purple-500/10 text-purple-100 hover:border-purple-400/50'

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles}`}>
      {children}
    </a>
  )
}

export function MyAppsSection() {
  return (
    <section
      id="my-apps"
      aria-labelledby="my-apps-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500/80">
            Products · shipped
          </p>
          <h2
            id="my-apps-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
          >
            My <span className="text-cyan-300 text-glow-cyan">apps</span>
          </h2>
          <p className="mt-3 text-slate-400">
            Installable clients and marketing sites — same engineering standards as enterprise work,
            tuned for calm UX and local-first privacy.
          </p>
        </header>

        <ul className="grid gap-8 lg:grid-cols-1">
          {PORTFOLIO_APPS.map((app, index) => (
            <li
              key={app.id}
              className={`group relative overflow-hidden rounded-2xl border bg-slate-900/35 p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8 ${
                index % 2 === 0
                  ? 'border-cyan-500/25 shadow-[0_0_36px_rgba(34,211,238,0.08)]'
                  : 'border-purple-500/25 shadow-[0_0_36px_rgba(168,85,247,0.08)]'
              }`}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl transition group-hover:opacity-60"
                style={{
                  background:
                    index % 2 === 0
                      ? 'radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)'
                      : 'radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)',
                }}
                aria-hidden
              />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl space-y-4">
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-lg font-bold tracking-tight text-white ${
                        index % 2 === 0
                          ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/25 to-slate-900'
                          : 'border-purple-500/40 bg-gradient-to-br from-purple-500/25 to-slate-900'
                      }`}
                      aria-hidden
                    >
                      {app.name.slice(0, 1)}
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-slate-50">{app.name}</h3>
                      <p className="mt-1 text-sm font-medium text-emerald-200/90">{app.tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">{app.description}</p>
                  <ul className="flex flex-wrap gap-2">
                    {app.highlights.map((h) => (
                      <li key={h}>
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/90 bg-slate-950/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-slate-300">
                          <Check className="h-3 w-3 text-emerald-400/90" aria-hidden />
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[280px]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Get the app
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-col">
                    <StoreLink href={app.websiteUrl} variant="web">
                      <Globe className="h-4 w-4 shrink-0" aria-hidden />
                      Website
                      <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                    </StoreLink>
                    {app.appStoreUrl ? (
                      <StoreLink href={app.appStoreUrl} variant="apple">
                        <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
                        App Store
                        <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                      </StoreLink>
                    ) : null}
                    {app.playStoreUrl ? (
                      <StoreLink href={app.playStoreUrl} variant="play">
                        <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
                        Google Play
                        <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                      </StoreLink>
                    ) : app.playStoreNote ? (
                      <span className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-700/80 bg-slate-950/60 px-4 py-2.5 font-mono text-[11px] text-slate-500">
                        {app.playStoreNote}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <ProductSupportPanel anchorId={SALGORYTHM_SUPPORT_PAGE_HASH} className="mt-12 scroll-mt-28" />
      </div>
    </section>
  )
}
