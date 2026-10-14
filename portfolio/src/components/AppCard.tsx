import { ArrowRight, Check, ExternalLink, Globe, ShieldCheck, Smartphone } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { appPath, appPrivacyPath, type PortfolioApp } from '../data/myApps'

export function StoreLink({
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

function StoreNote({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-700/80 bg-slate-950/60 px-4 py-2.5 font-mono text-[11px] text-slate-500">
      {children}
    </span>
  )
}

/** Website / App Store / Google Play buttons for one app. */
export function AppStoreLinks({ app }: { app: PortfolioApp }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-col">
      {app.websiteUrl ? (
        <StoreLink href={app.websiteUrl} variant="web">
          <Globe className="h-4 w-4 shrink-0" aria-hidden />
          Website
          <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
        </StoreLink>
      ) : null}
      {app.appStoreUrl ? (
        <StoreLink href={app.appStoreUrl} variant="apple">
          <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
          App Store
          <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
        </StoreLink>
      ) : app.appStoreNote ? (
        <StoreNote>{app.appStoreNote}</StoreNote>
      ) : null}
      {app.playStoreUrl ? (
        <StoreLink href={app.playStoreUrl} variant="play">
          <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
          Google Play
          <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
        </StoreLink>
      ) : app.playStoreNote ? (
        <StoreNote>{app.playStoreNote}</StoreNote>
      ) : null}
    </div>
  )
}

/** Accent alternates cyan / purple by list position. */
function appAccent(index: number) {
  return index % 2 === 0 ? 'cyan' : 'purple'
}

export function AppIcon({ app, index, size = 'md' }: { app: PortfolioApp; index: number; size?: 'md' | 'lg' }) {
  const accent = appAccent(index)
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl border font-bold tracking-tight text-white ${
        size === 'lg' ? 'h-20 w-20 text-3xl' : 'h-14 w-14 text-lg'
      } ${
        accent === 'cyan'
          ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/25 to-slate-900'
          : 'border-purple-500/40 bg-gradient-to-br from-purple-500/25 to-slate-900'
      }`}
      aria-hidden
    >
      {app.name.slice(0, 1)}
    </span>
  )
}

export function AppCard({ app, index }: { app: PortfolioApp; index: number }) {
  const accent = appAccent(index)
  return (
    <li
      className={`group relative overflow-hidden rounded-2xl border bg-slate-900/35 p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8 ${
        accent === 'cyan'
          ? 'border-cyan-500/25 shadow-[0_0_36px_rgba(34,211,238,0.08)]'
          : 'border-purple-500/25 shadow-[0_0_36px_rgba(168,85,247,0.08)]'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl transition group-hover:opacity-60"
        style={{
          background:
            accent === 'cyan'
              ? 'radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)'
              : 'radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <div className="flex items-start gap-4">
            <AppIcon app={app} index={index} />
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-50">
                <Link to={appPath(app.id)} className="hover:text-cyan-200">
                  {app.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm font-medium text-emerald-200/90">{app.tagline}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{app.description}</p>
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
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 font-mono text-xs">
            <Link
              to={appPath(app.id)}
              className="inline-flex items-center gap-1.5 text-cyan-300/95 hover:text-cyan-200"
            >
              App details
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              to={appPrivacyPath(app.id)}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Privacy policy
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[280px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Get the app</p>
          <AppStoreLinks app={app} />
        </div>
      </div>
    </li>
  )
}
