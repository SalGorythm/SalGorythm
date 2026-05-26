import { Menu, X, Terminal } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { SectionId } from '../constants/sections'

const LINKS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'recruiter', label: 'Recruiter AI' },
  { id: 'contact', label: 'Contact' },
]

type NavbarProps = {
  activeId: string
}

export function Navbar({ activeId }: NavbarProps) {
  const [open, setOpen] = useState(false)

  const scrollTo = useCallback((id: SectionId) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }, [])

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-cyan-500/20 bg-slate-950/55 backdrop-blur-md"
      aria-label="Primary"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => scrollTo('hero')}
          className="group flex items-center gap-2 rounded-lg border border-transparent px-2 py-1 text-left transition hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-500/40 bg-slate-900/80 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] transition group-hover:scale-105">
            <Terminal className="h-4 w-4" aria-hidden />
          </span>
          <span className="hidden sm:block">
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500/80">
              SalGorythm
            </span>
            <span className="block text-sm font-semibold tracking-tight text-slate-100">
              Data · AI · Architecture
            </span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
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

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-cyan-500/15 bg-slate-950/90 backdrop-blur-lg md:hidden ${
          open ? 'max-h-[420px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        } transition-all duration-300 ease-out`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {LINKS.map(({ id, label }) => {
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
          })}
        </ul>
      </div>
    </nav>
  )
}
