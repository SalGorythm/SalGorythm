import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { PortfolioPage } from '../pages/PortfolioPage'
import { SandboxPage } from '../pages/SandboxPage'
import { SupportPage } from '../pages/SupportPage'
import { AppsIndexPage } from '../pages/AppsIndexPage'
import { AppDetailPage } from '../pages/AppDetailPage'
import { AppLegalPage } from '../pages/AppLegalPage'
import { GoldenRecordPage } from '../pages/GoldenRecordPage'

const ToolsPage = lazy(() => import('../pages/ToolsPage').then((m) => ({ default: m.ToolsPage })))
const WritingIndexPage = lazy(() =>
  import('../pages/WritingIndexPage').then((m) => ({ default: m.WritingIndexPage })),
)
const ArticlePage = lazy(() => import('../pages/ArticlePage').then((m) => ({ default: m.ArticlePage })))

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">
      Loading…
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<PortfolioPage />} />
        <Route
          path="writing"
          element={
            <Suspense fallback={<RouteFallback />}>
              <WritingIndexPage />
            </Suspense>
          }
        />
        <Route
          path="writing/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ArticlePage />
            </Suspense>
          }
        />
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
        <Route path="golden-record" element={<GoldenRecordPage />} />
        <Route path="apps" element={<AppsIndexPage />} />
        <Route path="apps/:appId" element={<AppDetailPage />} />
        <Route path="apps/:appId/privacy" element={<AppLegalPage kind="privacy" />} />
        <Route path="apps/:appId/terms" element={<AppLegalPage kind="terms" />} />
      </Route>
    </Routes>
  )
}
