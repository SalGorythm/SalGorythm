import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { PortfolioPage } from '../pages/PortfolioPage'
import { SandboxPage } from '../pages/SandboxPage'
import { SupportPage } from '../pages/SupportPage'

const ToolsPage = lazy(() => import('../pages/ToolsPage').then((m) => ({ default: m.ToolsPage })))
const WritingIndexPage = lazy(() =>
  import('../pages/WritingIndexPage').then((m) => ({ default: m.WritingIndexPage })),
)
const ArticlePage = lazy(() => import('../pages/ArticlePage').then((m) => ({ default: m.ArticlePage })))

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
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
      </Route>
    </Routes>
  )
}
