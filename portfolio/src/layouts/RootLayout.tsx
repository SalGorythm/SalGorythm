import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { SiteEdgeRails } from '../components/SiteEdgeRails'
import { SocialLinks } from '../components/SocialLinks'
import { VisitorCounter } from '../components/StatBadge'
import { SECTION_IDS } from '../constants/sections'
import { useActiveSection } from '../hooks/useActiveSection'

export function RootLayout() {
  const { pathname } = useLocation()
  const isPortfolio = pathname === '/'
  const activeId = useActiveSection(SECTION_IDS, isPortfolio)

  return (
    <div className="page-vignette relative min-h-svh">
      <SiteEdgeRails />

      <div className="relative flex min-h-svh flex-col">
        <Navbar activeId={activeId} isPortfolio={isPortfolio} />
        <Outlet />
        <footer className="full-bleed border-t border-slate-800/90 bg-slate-950/80 py-8 backdrop-blur-md">
          <div className="page-container flex flex-col items-center gap-4">
            <SocialLinks variant="footer" />
            <VisitorCounter />
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-600">
              © {new Date().getFullYear()} Salman Akhatar · SalGorythm · Vite + React + Tailwind
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
