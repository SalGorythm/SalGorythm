import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { PortfolioPage } from '../pages/PortfolioPage'
import { SandboxPage } from '../pages/SandboxPage'
import { SupportPage } from '../pages/SupportPage'

const ToolsPage = lazy(() => import('../pages/ToolsPage').then((m) => ({ default: m.ToolsPage })))

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center font-mono text-xs uppercase tracking-widest text-slate-500">
      Loading…
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<PortfolioPage />} />
        <Route path="sandbox" element={<SandboxPage />} />
        <Route
          path="tools"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ToolsPage />
            </Suspense>
          }
        />
        <Route path="support" element={<SupportPage />} />
      </Route>
    </Routes>
  )
}
