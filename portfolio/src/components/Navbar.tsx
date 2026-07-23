import { Gamepad2, Menu, Wrench, X } from 'lucide-react'
import { useCallback, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { SectionId } from '../constants/sections'
import { BrandLogo } from './BrandLogo'

type SectionLink = { kind: 'section'; id: SectionId; label: string }
type RouteLink = { kind: 'route'; path: string; label: string; matchPrefix?: boolean }
type NavLink = SectionLink | RouteLink

const LINKS: NavLink[] = [
  { kind: 'section', id: 'hero', label: 'Home' },
  { kind: 'section', id: 'case-studies', label: 'Case studies' },
  { kind: 'section', id: 'live-demos', label: 'Live demos' },
  { kind: 'route', path: '/writing', label: 'Writing', matchPrefix: true },
  { kind: 'section', id: 'experience', label: 'Experience' },
  { kind: 'section', id: 'projects', label: 'Projects' },
  { kind: 'section', id: 'skills', label: 'Skills' },
  { kind: 'section', id: 'resume', label: 'Résumé' },
  { kind: 'section', id: 'contact', label: 'Contact' },
]

export type NavbarProps = {
  activeId: string
  /** When true, section jump links are shown; when false, show back-to-portfolio control. */
  isPortfolio: boolean
}

export function Navbar({ activeId, isPortfolio }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const scrollTo = useCallback((id: SectionId) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }, [])

  const onBrandClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault()
      scrollTo('hero')
    }
    setOpen(false)
  }

  const isLinkActive = (link: NavLink) => {
    if (link.kind === 'route') {
      return link.matchPrefix
        ? location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
        : location.pathname === link.path
    }
    return activeId === link.id
  }

  const linkClass = (active: boolean) =>
    active
      ? 'border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.12)]'
      : 'border border-transparent text-slate-400 hover:border-purple-500/25 hover:bg-purple-500/5 hover:text-purple-200'

  const renderNavLink = (link: NavLink, className: string) => {
    const active = isLinkActive(link)
    if (link.kind === 'route') {
      return (
        <Link
          to={link.path}
          onClick={() => setOpen(false)}
          className={`${className} ${linkClass(active)}`}
        >
          {link.label}
        </Link>
      )
    }
    return (
      <button type="button" onClick={() => scrollTo(link.id)} className={`${className} ${linkClass(active)}`}>
        {link.label}
      </button>
    )
  }

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-cyan-500/20 bg-slate-950/55 backdrop-blur-md"
      aria-label="Primary"
    >
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          onClick={onBrandClick}
          className="group flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-1 text-left transition hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
        >
          <BrandLogo variant="icon" className="transition group-hover:scale-105" />
          <span className="hidden sm:block">
            <span className="block text-xs font-medium text-slate-200">Salman Akhatar</span>
            <span className="block text-[11px] text-cyan-500/80">Senior data scientist · IBM</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {isPortfolio ? (
            <ul className="flex items-center gap-1">
              {LINKS.map((link) => (
                <li key={link.kind === 'route' ? link.path : link.id}>
                  {renderNavLink(link, 'rounded-lg px-3 py-2 text-sm transition')}
                </li>
              ))}
            </ul>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm text-purple-200 transition hover:border-purple-400/50 hover:bg-purple-500/15"
            >
              Portfolio
            </button>
          )}
          <Link
            to="/tools"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
              location.pathname === '/tools'
                ? 'border-emerald-500/45 bg-emerald-500/10 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.12)]'
                : 'border-slate-600/80 text-slate-300 hover:border-emerald-500/35 hover:bg-emerald-500/5 hover:text-emerald-200'
            }`}
          >
            <Wrench className="h-3.5 w-3.5" aria-hidden />
            Tools
          </Link>
          <Link
            to="/sandbox"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
              location.pathname === '/sandbox'
                ? 'border-cyan-500/45 bg-cyan-500/10 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.12)]'
                : 'border-slate-600/80 text-slate-300 hover:border-cyan-500/35 hover:bg-cyan-500/5 hover:text-cyan-200'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" aria-hidden />
            Sandbox
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/tools"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 px-2.5 text-emerald-300 transition hover:border-emerald-500/40"
            aria-label="Utility tools"
          >
            <Wrench className="h-5 w-5" />
          </Link>
          <Link
            to="/sandbox"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 px-2.5 text-cyan-300 transition hover:border-cyan-500/40"
            aria-label="Sandbox"
          >
            <Gamepad2 className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-cyan-500/15 bg-slate-950/90 backdrop-blur-lg md:hidden ${
          open ? 'max-h-[520px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        } transition-all duration-300 ease-out`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {isPortfolio ? (
            LINKS.map((link) => (
              <li key={link.kind === 'route' ? link.path : link.id}>
                {renderNavLink(link, 'w-full rounded-lg px-3 py-3 text-left text-sm transition')}
              </li>
            ))
          ) : (
            <li>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setOpen(false)
                }}
                className="w-full rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-3 text-left text-sm text-purple-200"
              >
                Portfolio
              </button>
            </li>
          )}
          <li>
            <Link
              to="/tools"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-3 text-sm text-emerald-200"
            >
              <Wrench className="h-4 w-4" aria-hidden />
              Utility tools
            </Link>
          </li>
          <li>
            <Link
              to="/sandbox"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-3 py-3 text-sm text-cyan-200"
            >
              <Gamepad2 className="h-4 w-4" aria-hidden />
              Sandbox
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
