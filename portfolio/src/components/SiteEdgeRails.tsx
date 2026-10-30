import { Link, useLocation } from 'react-router-dom'
import { KEYBOARD_SECTION_JUMPS } from '../constants/sections'
import { ARTICLES } from '../data/articles'
import { PORTFOLIO_APPS } from '../data/myApps'
import { useScrollStore } from '../store/scrollStore'
import { SocialLinks } from './SocialLinks'

const LEFT_METRICS = [
  { label: 'Years', value: '9' },
  { label: 'Hobby apps', value: String(PORTFOLIO_APPS.length) },
  { label: 'Articles', value: String(ARTICLES.length) },
] as const

const QUICK_LINKS = [
  { href: '/writing', label: 'Writing' },
  { href: '/sandbox', label: 'Sandbox' },
  { href: '/tools', label: 'Tools' },
  { href: '/apps', label: 'Hobbies' },
] as const

/** Fills left/right viewport gutters on wide screens — social, metrics, quick nav. */
export function SiteEdgeRails() {
  const { pathname } = useLocation()
  const isPortfolio = pathname === '/'
  const activeSection = useScrollStore((s) => s.activeSection)

  return (
    <>
      {/* Left rail */}
      <aside
        className="site-edge-rail site-edge-rail-left pointer-events-none fixed bottom-0 top-16 z-30 hidden xl:flex xl:w-[min(12vw,11rem)]"
        aria-hidden={false}
        aria-label="Site sidebar"
      >
        <div className="pointer-events-auto flex h-full w-full flex-col items-center justify-between py-8">
          <div className="flex flex-col items-center gap-6">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-500/50 [writing-mode:vertical-rl] rotate-180"
              aria-hidden
            >
              SalGorythm
            </p>
            <div className="h-24 w-px bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent" />
            <SocialLinks variant="sidebar" />
          </div>

          <ul className="space-y-3 text-center">
            {LEFT_METRICS.map((m) => (
              <li key={m.label}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">{m.label}</p>
                <p className="font-mono text-sm font-semibold text-cyan-300/90">{m.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right rail */}
      <aside
        className="site-edge-rail site-edge-rail-right pointer-events-none fixed bottom-0 top-16 z-30 hidden xl:flex xl:w-[min(12vw,11rem)]"
        aria-label="Quick navigation"
      >
        <div className="pointer-events-auto flex h-full w-full flex-col items-center justify-between py-8">
          {isPortfolio ? (
            <nav aria-label="Section progress" className="flex flex-col items-center gap-2">
              {KEYBOARD_SECTION_JUMPS.map(({ id, path, label, key }) => {
                const active = id ? activeSection === id : false
                const href = path ?? (id ? `#${id}` : '#')
                return (
                  <a
                    key={path ?? id ?? key}
                    href={href}
                    title={`${label} (${key})`}
                    className={`group flex items-center gap-2 text-[10px] transition ${
                      active ? 'text-cyan-300' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition ${
                        active
                          ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                          : 'bg-slate-700 group-hover:bg-slate-500'
                      }`}
                    />
                    <span className="max-w-[5rem] truncate font-medium">{label}</span>
                  </a>
                )
              })}
            </nav>
          ) : (
            <nav aria-label="Quick links" className="flex flex-col items-end gap-2">
              {QUICK_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  to={href}
                  className="text-[11px] text-slate-500 transition hover:text-purple-300"
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}

          <div className="text-center">
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Keys</p>
            <p className="mt-1 font-mono text-[10px] text-slate-500">1–9 jump</p>
            <div className="mt-4 h-24 w-px bg-gradient-to-b from-transparent via-purple-500/35 to-transparent" />
            <p
              className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] text-purple-500/45 [writing-mode:vertical-rl]"
              aria-hidden
            >
              New Delhi · Remote
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
