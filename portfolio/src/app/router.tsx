import { Route, Routes } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { PortfolioPage } from '../pages/PortfolioPage'
import { SandboxPage } from '../pages/SandboxPage'
import { SupportPage } from '../pages/SupportPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<PortfolioPage />} />
        <Route path="sandbox" element={<SandboxPage />} />
        <Route path="support" element={<SupportPage />} />
      </Route>
    </Routes>
  )
}
