import { useEffect } from 'react'
import { useScrollStore } from '../store/scrollStore'

type PortfolioScrollInitProps = {
  reducedMotion: boolean
  webglEnabled: boolean
}

/** Syncs reduced-motion / WebGL capability flags into the scroll store on portfolio mount. */
export function usePortfolioScrollInit({ reducedMotion, webglEnabled }: PortfolioScrollInitProps) {
  const setReducedMotion = useScrollStore((s) => s.setReducedMotion)
  const setWebglEnabled = useScrollStore((s) => s.setWebglEnabled)

  useEffect(() => {
    setReducedMotion(reducedMotion)
    setWebglEnabled(webglEnabled)
  }, [reducedMotion, webglEnabled, setReducedMotion, setWebglEnabled])
}
