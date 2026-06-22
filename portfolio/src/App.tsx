import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './app/router'
import { StatsProvider } from './context/StatsProvider'

export default function App() {
  return (
    <BrowserRouter>
      <StatsProvider>
        <AppRoutes />
      </StatsProvider>
    </BrowserRouter>
  )
}
