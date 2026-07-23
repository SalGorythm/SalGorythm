import { useCallback, useMemo, useState } from 'react'

const SESSION_KEY = 'salgorythm-webgl-disabled'

function detectWebGLSupport() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ?? canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

function readInitialForcedOff() {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

/**
 * Gate WebGL for reduced motion, weak hardware, prior context loss, or missing support.
 */
export function useWebGLCapability(reducedMotion: boolean) {
  const [forcedOff, setForcedOff] = useState(readInitialForcedOff)

  const webglEnabled = useMemo(() => {
    if (reducedMotion || forcedOff) return false
    if (typeof window === 'undefined') return false
    const cores = navigator.hardwareConcurrency ?? 8
    if (cores <= 4 && window.innerWidth < 1024) return false
    return detectWebGLSupport()
  }, [reducedMotion, forcedOff])

  const disableWebGL = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1')
    setForcedOff(true)
  }, [])

  return { webglEnabled, disableWebGL }
}
