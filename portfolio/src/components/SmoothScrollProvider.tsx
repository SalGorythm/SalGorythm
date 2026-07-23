import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import { useScrollStore } from '../store/scrollStore'

type SmoothScrollProviderProps = {
  children: ReactNode
  enabled: boolean
}

export function SmoothScrollProvider({ children, enabled }: SmoothScrollProviderProps) {
  const setScrollProgress = useScrollStore((s) => s.setScrollProgress)
  const reducedMotion = useScrollStore((s) => s.reducedMotion)

  useEffect(() => {
    if (!enabled || reducedMotion) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
    })

    let rafId = 0
    const onFrame = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(onFrame)
    }
    rafId = requestAnimationFrame(onFrame)

    const onScroll = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight
      const progress = limit > 0 ? window.scrollY / limit : 0
      setScrollProgress(Math.min(1, Math.max(0, progress)))
    }

    lenis.on('scroll', onScroll)
    onScroll()

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [enabled, reducedMotion, setScrollProgress])

  useEffect(() => {
    if (!enabled) return
    const onScroll = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight
      const progress = limit > 0 ? window.scrollY / limit : 0
      setScrollProgress(Math.min(1, Math.max(0, progress)))
    }
    if (reducedMotion) {
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    }
  }, [enabled, reducedMotion, setScrollProgress])

  return children
}
