import { Gamepad2, Menu, Wrench, X } from 'lucide-react'
import { useCallback, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { SectionId } from '../constants/sections'
import { BrandLogo } from './BrandLogo'

const LINKS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Home' },
  { id: 'case-studies', label: 'Case studies' },
  { id: 'live-demos', label: 'Live demos' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Contact' },
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

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-cyan-500/20 bg-slate-950/55 backdrop-blur-md lg:left-14"
      aria-label="Primary"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={onBrandClick}
          className="group flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-1 text-left transition hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
        >
          <BrandLogo variant="icon" className="transition group-hover:scale-105" />
          <span className="hidden sm:block">
            <span className="block text-xs font-medium text-slate-200">Salman Akhatar</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500/80">
              Data · AI · Architecture
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {isPortfolio ? (
            <ul className="flex items-center gap-1">
              {LINKS.map(({ id, label }) => {
                const active = activeId === id
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(id)}
                      className={`rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-wider transition ${
                        active
                          ? 'border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.12)]'
                          : 'border border-transparent text-slate-400 hover:border-purple-500/25 hover:bg-purple-500/5 hover:text-purple-200'
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-purple-200 transition hover:border-purple-400/50 hover:bg-purple-500/15"
            >
              Portfolio
            </button>
          )}
          <Link
            to="/tools"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-xs uppercase tracking-wider transition ${
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
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-xs uppercase tracking-wider transition ${
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
            aria-label="Sandbox arcade"
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
            LINKS.map(({ id, label }) => {
              const active = activeId === id
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    className={`w-full rounded-lg px-3 py-3 text-left font-mono text-sm uppercase tracking-wider transition ${
                      active
                        ? 'border border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                        : 'border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              )
            })
          ) : (
            <li>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setOpen(false)
                }}
                className="w-full rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-3 text-left font-mono text-sm uppercase tracking-wider text-purple-200"
              >
                Portfolio
              </button>
            </li>
          )}
          <li>
            <Link
              to="/tools"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-3 font-mono text-sm uppercase tracking-wider text-emerald-200"
            >
              <Wrench className="h-4 w-4" aria-hidden />
              Utility tools
            </Link>
          </li>
          <li>
            <Link
              to="/sandbox"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-3 py-3 font-mono text-sm uppercase tracking-wider text-cyan-200"
            >
              <Gamepad2 className="h-4 w-4" aria-hidden />
              Sandbox arcade
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
