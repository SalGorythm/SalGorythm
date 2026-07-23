import { useScrollStore } from '../store/scrollStore'

export function useSceneDpr() {
  const performanceDegraded = useScrollStore((s) => s.performanceDegraded)
  if (typeof window === 'undefined') return 1
  const base = Math.min(window.devicePixelRatio, 2)
  if (performanceDegraded) return 1
  if (window.innerWidth < 1024) return Math.min(base, 1.25)
  return base
}
