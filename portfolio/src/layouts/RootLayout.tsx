import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { SocialLinks } from '../components/SocialLinks'
import { SECTION_IDS } from '../constants/sections'
import { useActiveSection } from '../hooks/useActiveSection'

export function RootLayout() {
  const { pathname } = useLocation()
  const isPortfolio = pathname === '/'
  const activeId = useActiveSection(SECTION_IDS, isPortfolio)

  return (
    <div className="relative flex min-h-svh">
      <aside
        className="fixed left-0 top-0 z-40 hidden h-full w-14 flex-col items-center border-r border-cyan-500/15 bg-slate-950/80 py-20 backdrop-blur-md lg:flex"
        aria-label="Social links sidebar"
      >
        <SocialLinks variant="sidebar" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-14">
        <Navbar activeId={activeId} isPortfolio={isPortfolio} />
        <Outlet />
        <footer className="border-t border-slate-800/90 bg-slate-950/80 py-8 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
            <SocialLinks variant="footer" />
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-600">
              © {new Date().getFullYear()} Salman Akhatar · SalGorythm · Vite + React + Tailwind
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
