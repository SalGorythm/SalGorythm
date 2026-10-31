import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SmoothScrollProvider } from '../components/SmoothScrollProvider'
import { Channel } from '../components/space/Channel'
import { CrewRecord } from '../components/space/CrewRecord'
import { GroundControl } from '../components/space/GroundControl'
import { LaunchSequence } from '../components/space/LaunchSequence'
import { MissionLog } from '../components/space/MissionLog'
import { PayloadBay } from '../components/space/PayloadBay'
import { SpaceHero } from '../components/space/SpaceHero'
import { Trajectory } from '../components/space/Trajectory'
import { Transmissions } from '../components/space/Transmissions'
import '../components/space/space.css'
import { useKeyboardSectionJumps } from '../hooks/useKeyboardSectionJumps'
import { usePortfolioScrollInit } from '../hooks/usePortfolioScrollInit'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** Scrolls to `/#section` after arriving from another route (e.g. navbar links on /writing). */
function useHashScroll() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
    return () => window.clearTimeout(t)
  }, [hash])
}

export function PortfolioPage() {
  const reducedMotion = useReducedMotion()
  usePortfolioScrollInit({ reducedMotion, webglEnabled: false })
  useKeyboardSectionJumps(true)
  useHashScroll()

  return (
    <SmoothScrollProvider enabled>
      <Trajectory />
      <main className="space-home">
        <SpaceHero />
        <LaunchSequence />
        <MissionLog />
        <PayloadBay />
        <Transmissions />
        <GroundControl />
        <CrewRecord />
        <Channel />
      </main>
    </SmoothScrollProvider>
  )
}
