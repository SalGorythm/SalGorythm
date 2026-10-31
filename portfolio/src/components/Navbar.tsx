import { Menu, SquareTerminal, Volume2, VolumeX, X } from 'lucide-react'
import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { SectionId } from '../constants/sections'
import { RECRUITER_SUMMARY } from '../data/recruiterSummary'
import { startHum, stopHum } from '../lib/spaceSound'
import { useSpaceStore } from '../store/spaceStore'

type SectionLink = { kind: 'section'; id: SectionId; label: string; activeFor: SectionId[] }
type RouteLink = { kind: 'route'; path: string; label: string }
type NavItem = SectionLink | RouteLink

const LINKS: NavItem[] = [
  { kind: 'section', id: 'missions', label: 'Missions', activeFor: ['sequence', 'missions', 'payload'] },
  { kind: 'section', id: 'ground', label: 'Services', activeFor: ['ground'] },
  { kind: 'route', path: '/writing', label: 'Writing' },
  { kind: 'route', path: '/apps', label: 'Weekend Hobbies' },
  { kind: 'route', path: '/sandbox', label: 'Sandbox' },
  { kind: 'route', path: '/tools', label: 'Tools' },
]

export type NavbarProps = {
  activeId: string
  isPortfolio: boolean
}

/** A small sun: the brand mark. */
function SunMark() {
  return (
    <span
      aria-hidden
      className="block h-[22px] w-[22px] shrink-0 rounded-full shadow-[0_0_0_3px_rgb(232_176_75/0.18)]"
      style={{ background: 'radial-gradient(circle at 35% 35%, #FFE3A3, #E8B04B 55%, #9C6A16)' }}
    />
  )
}

export function Navbar({ activeId, isPortfolio }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const soundOn = useSpaceStore((s) => s.soundOn)
  const setSoundOn = useSpaceStore((s) => s.setSoundOn)
  const setConsoleOpen = useSpaceStore((s) => s.setConsoleOpen)

  const toggleSound = () => {
    if (soundOn) stopHum()
    else startHum()
    setSoundOn(!soundOn)
  }

  const iconBtn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-space-line text-space-dim transition hover:border-space-gold hover:text-space-gold'

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const goToSection = (id: SectionId) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setOpen(false)
    if (isPortfolio) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', `#${id}`)
    } else {
      navigate(`/#${id}`)
    }
  }

  const onBrandClick = (e: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false)
    if (isPortfolio) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isActive = (link: NavItem) =>
    link.kind === 'route'
      ? location.pathname === link.path || location.pathname.startsWith(`${link.path}/`)
      : isPortfolio && link.activeFor.includes(activeId as SectionId)

  const linkClass = (active: boolean, mobile = false) =>
    [
      mobile ? 'block w-full px-3 py-3 text-sm' : 'px-2.5 py-2 text-[11.5px]',
      'font-mono uppercase tracking-[0.12em] transition',
      active
        ? 'text-space-gold underline decoration-space-gold decoration-1 underline-offset-[7px]'
        : 'text-space-dim hover:text-space-gold',
    ].join(' ')

  const renderLink = (link: NavItem, mobile = false) => {
    const active = isActive(link)
    if (link.kind === 'route') {
      return (
        <Link
          to={link.path}
          onClick={() => setOpen(false)}
          className={linkClass(active, mobile)}
          aria-current={active ? 'page' : undefined}
        >
          {link.label}
        </Link>
      )
    }
    return (
      <a href={`/#${link.id}`} onClick={goToSection(link.id)} className={linkClass(active, mobile)}>
        {link.label}
      </a>
    )
  }

  const contactBtn =
    'inline-flex min-h-11 items-center rounded-full bg-space-gold px-5 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-space-void transition hover:-translate-y-0.5 hover:bg-[#f3c86f]'

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[100] border-b border-space-line bg-space-void/80 backdrop-blur-md"
      aria-label="Primary"
    >
      <div className="mx-auto flex h-16 max-w-[1260px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        <Link to="/" onClick={onBrandClick} className="flex min-w-0 shrink-0 items-center gap-3">
          <SunMark />
          <span className="min-w-0 leading-none">
            <span className="block truncate font-display text-[15px] font-semibold uppercase tracking-[0.06em] text-space-star">
              {RECRUITER_SUMMARY.name}
            </span>
            <span className="mt-0.5 hidden truncate font-mono text-[10px] uppercase tracking-[0.14em] text-space-dim sm:block">
              {RECRUITER_SUMMARY.navSubtitle}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center">
            {LINKS.map((link) => (
              <li key={link.label}>{renderLink(link)}</li>
            ))}
          </ul>
          <button type="button" className={`ml-1 ${iconBtn}`} onClick={() => setConsoleOpen(true)} aria-label="Open mission console" title="Mission console ( / )">
            <SquareTerminal className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            className={iconBtn}
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label="Ambient sound"
            title={soundOn ? 'Sound on' : 'Sound off'}
          >
            {soundOn ? <Volume2 className="h-4 w-4 text-space-gold" aria-hidden /> : <VolumeX className="h-4 w-4" aria-hidden />}
          </button>
          <a href="/#contact" onClick={goToSection('contact')} className={`ml-2 ${contactBtn}`}>
            Open a channel
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-space-line text-space-star transition hover:border-space-gold hover:text-space-gold lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-space-line bg-space-void/95 backdrop-blur-md lg:hidden ${
          open ? 'max-h-[min(85svh,640px)] opacity-100' : 'invisible max-h-0 overflow-hidden opacity-0'
        } transition-all duration-300 ease-out`}
      >
        <ul className="flex max-h-[min(85svh,640px)] flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-4">
          {LINKS.map((link) => (
            <li key={link.label}>{renderLink(link, true)}</li>
          ))}
          <li className="flex gap-2 pt-3">
            <button type="button" className={iconBtn} onClick={() => { setOpen(false); setConsoleOpen(true) }} aria-label="Open mission console">
              <SquareTerminal className="h-4 w-4" aria-hidden />
            </button>
            <button type="button" className={iconBtn} onClick={toggleSound} aria-pressed={soundOn} aria-label="Ambient sound">
              {soundOn ? <Volume2 className="h-4 w-4 text-space-gold" aria-hidden /> : <VolumeX className="h-4 w-4" aria-hidden />}
            </button>
          </li>
          <li className="pt-1">
            <a href="/#contact" onClick={goToSection('contact')} className={contactBtn}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
