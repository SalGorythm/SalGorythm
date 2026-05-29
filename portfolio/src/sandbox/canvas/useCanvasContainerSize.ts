import { useEffect, useState, type RefObject } from 'react'

export type CanvasSize = { cssW: number; cssH: number; dpr: number }

/**
 * Tracks parent element size for responsive canvas (CSS pixels + devicePixelRatio).
 */
export function useCanvasContainerSize(
  containerRef: RefObject<HTMLElement | null>,
  aspectRatio: number,
  minW = 320,
  minH = 220,
): CanvasSize {
  const [size, setSize] = useState<CanvasSize>(() => ({
    cssW: minW,
    cssH: Math.max(minH, Math.round(minW / Math.max(aspectRatio, 0.01))),
    dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio ?? 1, 2) : 1,
  }))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const measure = () => {
      const r = el.getBoundingClientRect()
      const cssW = Math.max(minW, Math.floor(r.width))
      const cssH = Math.max(minH, Math.floor(cssW / aspectRatio))
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      setSize((prev) => {
        if (prev.cssW === cssW && prev.cssH === cssH && prev.dpr === dpr) return prev
        return { cssW, cssH, dpr }
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [aspectRatio, minH, minW, containerRef])

  return size
}

export function applyCanvasBitmapSize(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number,
  dpr: number,
): void {
  const bw = Math.max(1, Math.floor(cssW * dpr))
  const bh = Math.max(1, Math.floor(cssH * dpr))
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw
    canvas.height = bh
  }
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`
}
