import { useEffect, useRef, type RefObject } from 'react'
import { useSpaceStore } from '../../store/spaceStore'
import { useCanvasLoop, type DrawFn } from './useCanvasLoop'

const BANDS = 22
const SEGMENTS = 56

/** Accretion disk drawn as banded ellipse segments: hotter inside, brighter on the approaching (left) side. */
function disk(ctx: CanvasRenderingContext2D, cx: number, cy: number, rh: number, t: number, front: boolean) {
  const start = front ? 0 : Math.PI
  const step = Math.PI / SEGMENTS
  for (let b = 0; b < BANDS; b++) {
    const k = b / BANDS
    const rx = rh * (1.45 + k * 1.3)
    const ry = rx * 0.17
    const heat = 1 - k
    const r = 255
    const g = Math.round(170 + 80 * heat)
    const bl = Math.round(90 + 140 * heat * heat)
    for (let s = 0; s < SEGMENTS; s++) {
      const a0 = start + s * step
      const doppler = 0.55 + 0.45 * -Math.cos(a0)
      const swirl = 0.7 + 0.3 * Math.sin(a0 * 7 - t * 0.0016 * (1.6 - k) + b * 0.9)
      const alpha = (1 - k) * 0.55 * doppler * swirl + 0.03
      ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha.toFixed(3)})`
      ctx.lineWidth = rh * 0.06
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, -0.06, a0, a0 + step + 0.01)
      ctx.stroke()
    }
  }
}

const draw: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2
  const cy = h * 0.52
  const rh = Math.min(w / 6.4, h / 3.2)

  // elliptical glow that fades out before the canvas edge
  const gr = w / 2
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1, Math.min(cy, h - cy) / gr)
  const glow = ctx.createRadialGradient(0, 0, rh * 0.6, 0, 0, gr)
  glow.addColorStop(0, 'rgba(232,176,75,0.24)')
  glow.addColorStop(1, 'rgba(232,176,75,0)')
  ctx.fillStyle = glow
  ctx.fillRect(-gr, -gr, gr * 2, gr * 2)
  ctx.restore()

  disk(ctx, cx, cy, rh, t, false)

  // gravitationally lensed light: a halo bent over and under the shadow
  const halo = ctx.createRadialGradient(cx, cy, rh * 1.02, cx, cy, rh * 1.55)
  halo.addColorStop(0, 'rgba(255,240,205,0.95)')
  halo.addColorStop(0.18, 'rgba(240,190,95,0.55)')
  halo.addColorStop(1, 'rgba(232,176,75,0)')
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(cx, cy, rh * 1.55, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(cx, cy, rh, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,246,222,0.9)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(cx, cy, rh * 1.02, 0, Math.PI * 2)
  ctx.stroke()

  disk(ctx, cx, cy, rh, t, true)
}

/** Publishes the hole's screen position so the starfield behind it can bend light around it. */
function useLensPublisher(ref: RefObject<HTMLCanvasElement | null>) {
  const setBlackHole = useSpaceStore((s) => s.setBlackHole)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let visible = false
    let raf = 0
    const publish = () => {
      raf = 0
      if (!visible) return
      const r = el.getBoundingClientRect()
      const rh = Math.min(r.width / 6.4, r.height / 3.2)
      setBlackHole({ x: r.left + r.width / 2, y: r.top + r.height * 0.52, r: rh * 1.6 })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(publish)
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
      else setBlackHole(null)
    })
    io.observe(el)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      setBlackHole(null)
    }
  }, [ref, setBlackHole])
}

export function BlackHole() {
  const ref = useRef<HTMLCanvasElement>(null)
  useCanvasLoop(ref, draw)
  useLensPublisher(ref)
  return (
    <div className="sp-blackhole" role="img" aria-label="A black hole with a glowing accretion disk.">
      <canvas ref={ref} aria-hidden />
    </div>
  )
}
