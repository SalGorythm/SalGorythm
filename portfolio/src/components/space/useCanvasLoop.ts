import { useEffect, type RefObject } from 'react'

export type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void

/**
 * Runs `draw` every frame while the canvas is on screen, sized to its CSS box at device pixel ratio.
 * With reduced motion it draws a single still frame.
 */
export function useCanvasLoop(ref: RefObject<HTMLCanvasElement | null>, draw: DrawFn) {
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0
    let visible = false

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, w, h, reduce ? 1200 : performance.now())
    }
    const frame = (t: number) => {
      draw(ctx, w, h, t)
      if (visible && !reduce) raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduce) raf = requestAnimationFrame(frame)
    })
    io.observe(canvas)
    resize()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [ref, draw])
}
