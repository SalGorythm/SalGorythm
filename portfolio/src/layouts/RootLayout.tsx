import { Link, Outlet, useLocation } from 'react-router-dom'
import { AmbientBackground } from '../components/AmbientBackground'
import { Navbar } from '../components/Navbar'
import { SiteEdgeRails } from '../components/SiteEdgeRails'
import { SocialLinks } from '../components/SocialLinks'
import { VisitorCounter } from '../components/StatBadge'
import { SECTION_IDS } from '../constants/sections'
import { RECRUITER_SUMMARY } from '../data/recruiterSummary'
import { useActiveSection } from '../hooks/useActiveSection'

const FOOTER_LINKS = [
  { to: '/apps', label: 'Weekend hobbies' },
  { to: '/support', label: 'Support' },
  { to: '/writing', label: 'Writing' },
  { to: '/tools', label: 'Tools' },
]

export function RootLayout() {
  const { pathname } = useLocation()
  const isPortfolio = pathname === '/'
  const activeId = useActiveSection(SECTION_IDS, isPortfolio)

  return (
    <div className="page-vignette relative min-h-svh overflow-x-clip">
      <AmbientBackground />
      <SiteEdgeRails />

      <div className="relative z-10 flex min-h-svh flex-col">
        <Navbar activeId={activeId} isPortfolio={isPortfolio} />
        <Outlet />
        <footer className="full-bleed border-t border-slate-800/90 bg-slate-950/80 py-8 backdrop-blur-md">
          <div className="page-container flex flex-col items-center gap-4">
            <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {FOOTER_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="text-slate-400 transition hover:text-cyan-200">
                  {l.label}
                </Link>
              ))}
            </nav>
            <SocialLinks variant="footer" />
            <VisitorCounter />
            <p className="max-w-xl text-center text-xs leading-relaxed text-slate-500">
              Personal website. Views, articles, apps and projects here are my own, made in my own
              time, and are not affiliated with or endorsed by any employer, past or present.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-600">
              © {new Date().getFullYear()} {RECRUITER_SUMMARY.name} · SalGorythm · Vite + React + Tailwind
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
