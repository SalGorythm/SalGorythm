import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { EasterEggs } from '../components/space/EasterEggs'
import { MissionConsole } from '../components/space/MissionConsole'
import { Starfield } from '../components/space/Starfield'
import '../components/space/space-global.css'
import { SocialLinks } from '../components/SocialLinks'
import { VisitorCounter } from '../components/StatBadge'
import { SECTION_IDS } from '../constants/sections'
import { RECRUITER_SUMMARY } from '../data/recruiterSummary'
import { useActiveSection } from '../hooks/useActiveSection'
import { whoosh } from '../lib/spaceSound'
import { useSpaceStore } from '../store/spaceStore'

const FOOTER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/writing', label: 'Writing' },
  { to: '/apps', label: 'Weekend Hobbies' },
  { to: '/support', label: 'App support' },
  { to: '/sandbox', label: 'Sandbox' },
  { to: '/tools', label: 'Tools' },
]

/** Every route change is a hyperspace jump: warp the starfield and start the new page at the top. */
function useWarpOnNavigate(pathname: string) {
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    useSpaceStore.getState().warp()
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  useEffect(() => useSpaceStore.subscribe((s, prev) => {
    if (s.warpAt !== prev.warpAt) whoosh()
  }), [])
}

export function RootLayout() {
  const { pathname } = useLocation()
  const isPortfolio = pathname === '/'
  const activeId = useActiveSection(SECTION_IDS, isPortfolio)
  useWarpOnNavigate(pathname)

  return (
    <div className="relative min-h-svh overflow-x-clip bg-space-void">
      <Starfield />
      <EasterEggs />
      <MissionConsole />
      <div className="relative z-10 flex min-h-svh flex-col">
        <Navbar activeId={activeId} isPortfolio={isPortfolio} />
        <Outlet />
        <footer className="relative border-t border-space-line bg-space-void/85 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 py-10 sm:px-6 lg:px-12">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex flex-col gap-2">
                <p className="font-display text-xl font-semibold text-space-star">
                  You&#8217;ve reached the edge of the observable portfolio.
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-space-dim">
                  Transmitting from New Delhi · Earth
                </p>
                <p className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-space-dim lg:block">
                  Press <kbd className="rounded border border-space-line px-1.5 py-0.5 text-space-gold">/</kbd> for the
                  mission console
                </p>
              </div>
              <SocialLinks variant="inline" className="justify-start!" />
            </div>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {FOOTER_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="font-mono text-xs uppercase tracking-[0.12em] text-space-dim transition hover:text-space-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-3 border-t border-space-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-relaxed text-space-dim">
                Personal website. Views, articles, apps and projects here are my own, made in my own time, and
                are not affiliated with or endorsed by any employer, past or present.
              </p>
              <div className="flex flex-col gap-1 sm:items-end">
                <VisitorCounter />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-space-dim">
                  © {new Date().getFullYear()} {RECRUITER_SUMMARY.name} · salgorythm.com
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
