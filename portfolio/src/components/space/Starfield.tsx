import { useEffect, useRef, useState } from 'react'
import { altAz, localSiderealDeg, OBSERVER, project, starColor, type SkyData } from '../../lib/sky'
import { useSpaceStore, warpAmount, type Lens } from '../../store/spaceStore'

type Dot = { x: number; y: number; r: number; a: number; c: string; tw: number; sp: number; z: number }
type Figure = { name: string; segs: { x: number; y: number }[][]; pts: { x: number; y: number }[] }
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number }

/** Andromeda Galaxy (M31), J2000. Drawn larger than life so it reads as a galaxy. */
const M31 = { ra: 10.6847, dec: 41.2687 }

function drawSpiral(g: CanvasRenderingContext2D, cx: number, cy: number, R: number, tilt: number, rot: number) {
  const core = g.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35)
  core.addColorStop(0, 'rgba(255,236,196,0.55)')
  core.addColorStop(0.4, 'rgba(232,176,75,0.18)')
  core.addColorStop(1, 'rgba(232,176,75,0)')
  g.fillStyle = core
  g.beginPath()
  g.ellipse(cx, cy, R * 0.35, R * 0.35 * tilt, rot, 0, Math.PI * 2)
  g.fill()
  for (let arm = 0; arm < 2; arm++) {
    for (let i = 0; i < 900; i++) {
      const t = i / 900
      const r = t * R
      const theta = t * 7.2 + arm * Math.PI + (Math.random() - 0.5) * 0.55
      const j = (Math.random() - 0.5) * R * 0.06 * (1 - t * 0.4)
      const px = Math.cos(theta) * (r + j)
      const py = Math.sin(theta) * (r + j) * tilt
      g.fillStyle = t < 0.25 ? `rgba(255,226,170,${(1 - t) * 0.5 * Math.random() + 0.04})` : `rgba(170,200,255,${(1 - t) * 0.5 * Math.random() + 0.04})`
      g.fillRect(cx + px * Math.cos(rot) - py * Math.sin(rot), cy + px * Math.sin(rot) + py * Math.cos(rot), Math.random() < 0.08 ? 1.6 : 1, 1)
    }
  }
}

function drawElliptical(g: CanvasRenderingContext2D, cx: number, cy: number, R: number, rot: number) {
  for (let i = 0; i < 260; i++) {
    const a = Math.random() * Math.PI * 2
    const d = Math.pow(Math.random(), 2) * R
    const px = Math.cos(a) * d
    const py = Math.sin(a) * d * 0.55
    g.fillStyle = `rgba(255,214,170,${(1 - d / R) * 0.35})`
    g.fillRect(cx + px * Math.cos(rot) - py * Math.sin(rot), cy + px * Math.sin(rot) + py * Math.cos(rot), 1, 1)
  }
}

/** Point-mass lens: returns the primary image and (close in) a faint secondary image. */
function lensed(x: number, y: number, lens: Lens, out: number[]) {
  const dx = x - lens.x
  const dy = y - lens.y
  const r = Math.hypot(dx, dy)
  const Re = lens.r
  out.length = 0
  if (r > Re * 7 || r < 0.001) {
    out.push(x, y, 1)
    return
  }
  const s = Math.sqrt(r * r + 4 * Re * Re)
  const r1 = (r + s) / 2
  out.push(lens.x + (dx / r) * r1, lens.y + (dy / r) * r1, 1 + (Re / (r + Re)) * 1.4)
  if (r < Re * 3) {
    const r2 = (r - s) / 2
    out.push(lens.x + (dx / r) * r2, lens.y + (dy / r) * r2, ((Re / (r + Re)) ** 2) * 1.2)
  }
}

const timeLabel = (d: Date) =>
  d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })

/**
 * Fixed deep-space backdrop behind every route.
 * - The real sky over New Delhi at the visitor's current time (catalogue in /sky.json).
 * - Hover a patch of sky (desktop) to trace its constellation; Andromeda is drawn where it really is.
 * - Shooting stars, warp-speed streaks on navigation, and gravitational lensing around the
 *   contact-section black hole that follows the cursor when it comes close.
 * Static, with no streaks or lensing motion, when reduced motion is on.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [caption, setCaption] = useState<string | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let W = 0
    let H = 0
    let dust: Dot[] = []
    let sky: Dot[] = []
    let figures: Figure[] = []
    let andromeda: { x: number; y: number } | null = null
    let galaxies: HTMLCanvasElement | null = null
    let data: SkyData | null = null
    let meteor: Meteor | null = null
    let nextMeteor = performance.now() + 4000
    let raf = 0
    let pointer = { x: -9999, y: -9999 }
    let hover: Figure | null = null
    let hoverAlpha = 0
    let lensPos: Lens | null = null
    const lensOff = { x: 0, y: 0, k: 1 }
    const tmp: number[] = []

    const projectSky = () => {
      if (!data) return
      const now = new Date()
      const lst = localSiderealDeg(now, OBSERVER.lon)
      const cx = W / 2
      const cy = H * 0.42
      const scale = Math.max(W, H) * 0.62
      sky = []
      for (const [ra, dec, mag, bv] of data.stars) {
        const { alt, az } = altAz(ra, dec, lst, OBSERVER.lat)
        const p = project(alt, az, cx, cy, scale)
        if (!p) continue
        sky.push({
          x: p.x,
          y: p.y,
          r: Math.max(0.35, 2.3 - mag * 0.38),
          a: Math.min(1, Math.max(0.25, 1.15 - mag * 0.15)),
          c: starColor(bv),
          tw: Math.random() * Math.PI * 2,
          sp: Math.random() * 0.02 + 0.004,
          z: 0.12,
        })
      }
      figures = data.constellations
        .map((c) => {
          const segs = c.lines
            .map((seg) =>
              seg
                .map(([ra, dec]) => {
                  const { alt, az } = altAz(ra, dec, lst, OBSERVER.lat)
                  return project(alt, az, cx, cy, scale)
                })
                .filter((p): p is { x: number; y: number } => p !== null),
            )
            .filter((s) => s.length > 1)
          return { name: c.name, segs, pts: segs.flat() }
        })
        .filter((f) => f.pts.length > 2)
      const m = altAz(M31.ra, M31.dec, lst, OBSERVER.lat)
      andromeda = project(m.alt, m.az, cx, cy, scale)
      buildGalaxies()
    }

    const buildGalaxies = () => {
      galaxies = document.createElement('canvas')
      galaxies.width = W * dpr
      galaxies.height = H * dpr
      const g = galaxies.getContext('2d')
      if (!g) return
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      const R = Math.max(60, Math.min(W, H) * 0.12)
      if (andromeda) drawSpiral(g, andromeda.x, andromeda.y, R, 0.32, -0.6)
      else drawSpiral(g, W * 0.86, H * 0.2, R, 0.42, -0.45)
      drawElliptical(g, W * 0.08, H * 0.82, Math.max(34, R * 0.4), 0.5)
    }

    const build = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dust = Array.from({ length: Math.round((W * H) / 4200) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.7 + 0.2,
        a: Math.random() * 0.4 + 0.15,
        c: Math.random() < 0.15 ? '143,200,255' : '237,234,224',
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.004,
        z: Math.random() * 0.6 + 0.2,
      }))
      if (data) projectSky()
      else buildGalaxies()
    }

    const pickFigure = () => {
      if (!finePointer || pointer.x < 0) return null
      let best: Figure | null = null
      let bestD = 70
      const shift = skyShift()
      for (const f of figures) {
        for (const p of f.pts) {
          const d = Math.hypot(p.x - pointer.x, p.y + shift - pointer.y)
          if (d < bestD) {
            bestD = d
            best = f
          }
        }
      }
      return best
    }

    const skyShift = () => -Math.min(window.scrollY * 0.04, H * 0.25)

    const drawDot = (d: Dot, x: number, y: number, a: number, warp: number) => {
      if (warp > 0.02) {
        const dx = x - W / 2
        const dy = y - H / 2
        ctx.strokeStyle = `rgba(${d.c},${Math.min(1, a * (1 + warp)).toFixed(3)})`
        ctx.lineWidth = Math.max(0.6, d.r)
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + dx * warp * 0.45, y + dy * warp * 0.45)
        ctx.stroke()
        return
      }
      ctx.beginPath()
      ctx.arc(x, y, d.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${d.c},${Math.min(1, a).toFixed(3)})`
      ctx.fill()
    }

    const draw = (t: number) => {
      const scroll = window.scrollY
      const { warpAt, blackHole } = useSpaceStore.getState()
      const warp = reduce ? 0 : warpAmount(t, warpAt)

      // lens: sits on the black hole and drifts toward a cursor that comes close
      if (blackHole) {
        const near = !reduce && Math.hypot(pointer.x - blackHole.x, pointer.y - blackHole.y) < blackHole.r * 4
        const tx = near ? (pointer.x - blackHole.x) * 0.45 : 0
        const ty = near ? (pointer.y - blackHole.y) * 0.45 : 0
        const tr = near ? 1.35 : 1
        lensOff.x += (tx - lensOff.x) * 0.12
        lensOff.y += (ty - lensOff.y) * 0.12
        lensOff.k += (tr - lensOff.k) * 0.1
        lensPos = { x: blackHole.x + lensOff.x, y: blackHole.y + lensOff.y, r: blackHole.r * lensOff.k }
      } else {
        lensPos = null
      }

      ctx.clearRect(0, 0, W, H)
      const shift = skyShift()
      if (galaxies && warp < 0.5) {
        ctx.globalAlpha = 0.85 * (1 - warp * 2)
        ctx.drawImage(galaxies, 0, shift, W, H)
        ctx.globalAlpha = 1
      }

      const render = (d: Dot, x: number, y: number) => {
        const a = reduce ? d.a : d.a * (0.7 + 0.3 * Math.sin(d.tw + t * d.sp * 0.06))
        if (lensPos && warp < 0.02) {
          lensed(x, y, lensPos, tmp)
          for (let i = 0; i < tmp.length; i += 3) drawDot(d, tmp[i], tmp[i + 1], a * tmp[i + 2], 0)
        } else {
          drawDot(d, x, y, a, warp)
        }
      }

      for (const d of dust) render(d, d.x, (((d.y - scroll * d.z * 0.25) % H) + H) % H)
      for (const d of sky) render(d, d.x, d.y + shift)

      // constellation trace under the pointer
      const target = warp > 0 ? null : pickFigure()
      if (target !== hover) {
        if (target || hoverAlpha <= 0.02) {
          hover = target
          setCaption(target ? target.name : null)
        }
      }
      hoverAlpha += ((target && target === hover ? 1 : 0) - hoverAlpha) * 0.12
      if (hover && hoverAlpha > 0.01) {
        ctx.strokeStyle = `rgba(232,176,75,${(0.55 * hoverAlpha).toFixed(3)})`
        ctx.lineWidth = 1
        for (const seg of hover.segs) {
          ctx.beginPath()
          seg.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y + shift) : ctx.moveTo(p.x, p.y + shift)))
          ctx.stroke()
        }
      }

      if (reduce) return

      if (!meteor && warp === 0 && t > nextMeteor) {
        const speed = 11 + Math.random() * 5
        meteor = { x: Math.random() * W * 0.7 + W * 0.15, y: Math.random() * H * 0.35, vx: -speed, vy: speed * 0.42, life: 0, max: 55 }
      }
      if (meteor) {
        const m = meteor
        m.life += 1
        m.x += m.vx
        m.y += m.vy
        const fade = 1 - m.life / m.max
        const tail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 9, m.y - m.vy * 9)
        tail.addColorStop(0, `rgba(255,244,214,${0.9 * fade})`)
        tail.addColorStop(1, 'rgba(255,244,214,0)')
        ctx.strokeStyle = tail
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * 9, m.y - m.vy * 9)
        ctx.stroke()
        if (m.life >= m.max) {
          meteor = null
          nextMeteor = t + 6000 + Math.random() * 9000
        }
      }
      raf = requestAnimationFrame(draw)
    }

    build()
    fetch('/sky.json')
      .then((r) => (r.ok ? (r.json() as Promise<SkyData>) : null))
      .then((d) => {
        if (!d) return
        data = d
        projectSky()
        if (reduce) draw(0)
      })
      .catch(() => {})

    const reproject = window.setInterval(projectSky, 60_000)
    const onResize = () => {
      build()
      if (reduce) draw(0)
    }
    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY }
      if (reduce) draw(0)
    }
    const onLeave = () => {
      pointer = { x: -9999, y: -9999 }
    }
    const onScroll = () => draw(0)
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    if (reduce) {
      draw(0)
      window.addEventListener('scroll', onScroll, { passive: true })
    } else {
      raf = requestAnimationFrame(draw)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(reproject)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
      <p
        aria-hidden
        className={`pointer-events-none fixed bottom-4 left-4 z-[5] rounded-full border border-space-line bg-space-void/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-space-dim backdrop-blur-sm transition-opacity duration-300 ${
          caption ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="text-space-gold">{caption ?? ' '}</span> · Sky over {OBSERVER.name} · {timeLabel(new Date())} IST
      </p>
    </>
  )
}
