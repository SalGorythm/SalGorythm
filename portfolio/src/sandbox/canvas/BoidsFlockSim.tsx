import {
  Orbit,
  Pause,
  Play,
  Radar,
  RotateCcw,
  Skull,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { applyCanvasBitmapSize, useCanvasContainerSize } from './useCanvasContainerSize'

const N_BOIDS = 165
const MAX_NODES = 12

type Vec2 = { x: number; y: number }
type Boid = { x: number; y: number; vx: number; vy: number }
type FieldNode = { x: number; y: number; kind: 'predator' | 'attractor' }

function len(v: Vec2): number {
  return Math.hypot(v.x, v.y) || 1e-6
}

function norm(v: Vec2): Vec2 {
  const l = len(v)
  return { x: v.x / l, y: v.y / l }
}

function clampMag(v: Vec2, max: number): Vec2 {
  const l = len(v)
  if (l <= max) return v
  const s = max / l
  return { x: v.x * s, y: v.y * s }
}

function randRange(a: number, b: number): number {
  return a + Math.random() * (b - a)
}

function initBoids(w: number, h: number): Boid[] {
  const out: Boid[] = []
  for (let i = 0; i < N_BOIDS; i++) {
    out.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: randRange(-0.8, 0.8),
      vy: randRange(-0.8, 0.8),
    })
  }
  return out
}

export function BoidsFlockSim() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { cssW, cssH, dpr } = useCanvasContainerSize(wrapRef, 16 / 10, 360, 260)

  const boidsRef = useRef<Boid[]>([])
  const nodesRef = useRef<FieldNode[]>([])
  const runningRef = useRef(true)
  const rafRef = useRef(0)

  const [running, setRunning] = useState(true)
  const [placement, setPlacement] = useState<'predator' | 'attractor' | null>(null)

  const [sep, setSep] = useState(1.2)
  const [align, setAlign] = useState(1)
  const [coh, setCoh] = useState(0.85)
  const [maxSpeed, setMaxSpeed] = useState(2.8)
  const [perception, setPerception] = useState(72)

  const paramsRef = useRef({ sep, align, coh, maxSpeed, perception })
  useEffect(() => {
    paramsRef.current = { sep, align, coh, maxSpeed, perception }
  }, [sep, align, coh, maxSpeed, perception])

  const resetFlock = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    boidsRef.current = initBoids(c.width, c.height)
    nodesRef.current = []
  }, [])

  useEffect(() => {
    runningRef.current = running
  }, [running])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    applyCanvasBitmapSize(canvas, cssW, cssH, dpr)
    boidsRef.current = initBoids(canvas.width, canvas.height)
    nodesRef.current = []
  }, [cssW, cssH, dpr])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const step = () => {
      const w = canvas.width
      const h = canvas.height

      if (runningRef.current) {
        const { sep: sW, align: aW, coh: cW, maxSpeed: vMax, perception: Rcss } = paramsRef.current
        const scale = w / Math.max(cssW, 1)
        const R = Rcss * scale
        const R2 = R * R
        const boids = boidsRef.current
        const nodes = nodesRef.current

        for (let i = 0; i < boids.length; i++) {
        const b = boids[i]!
        let fsx = 0
        let fsy = 0
        let alx = 0
        let aly = 0
        let aln = 0
        let cx = 0
        let cy = 0
        let cn = 0

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue
          const o = boids[j]!
          const dx = o.x - b.x
          const dy = o.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > R2 || d2 < 1e-4) continue
          const d = Math.sqrt(d2)
          const inv = 1 / d
          fsx -= (dx * inv) / d
          fsy -= (dy * inv) / d
          alx += o.vx
          aly += o.vy
          aln += 1
          cx += o.x
          cy += o.y
          cn += 1
        }

        let ax = 0
        let ay = 0
        if (aln > 0) {
          ax += ((alx / aln - b.vx) * aW) / 40
          ay += ((aly / aln - b.vy) * aW) / 40
        }
        if (cn > 0) {
          const mx = cx / cn - b.x
          const my = cy / cn - b.y
          const m = norm({ x: mx, y: my })
          ax += m.x * cW * 0.04
          ay += m.y * cW * 0.04
        }
        ax += fsx * sW * 0.35
        ay += fsy * sW * 0.35

        for (const n of nodes) {
          const dx = b.x - n.x
          const dy = b.y - n.y
          const d2 = dx * dx + dy * dy + 400
          const d = Math.sqrt(d2)
          const inv3 = 1 / (d * d2)
          if (n.kind === 'predator') {
            const f = 18000 * inv3
            ax += (dx / d) * f
            ay += (dy / d) * f
          } else {
            const f = 9000 * inv3
            ax -= (dx / d) * f
            ay -= (dy / d) * f
          }
        }

        b.vx += ax
        b.vy += ay
        const vm = clampMag({ x: b.vx, y: b.vy }, vMax)
        b.vx = vm.x
        b.vy = vm.y
        b.x += b.vx
        b.y += b.vy
        if (b.x < 0) b.x += w
        if (b.x >= w) b.x -= w
        if (b.y < 0) b.y += h
        if (b.y >= h) b.y -= h
        }
      }

      const boids = boidsRef.current
      const nodes = nodesRef.current

      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(34,211,238,0.06)'
      ctx.lineWidth = 1
      const g = 48
      for (let x = 0; x < w; x += g) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += g) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 14 * dpr, 0, Math.PI * 2)
        ctx.fillStyle = n.kind === 'predator' ? 'rgba(248,113,113,0.35)' : 'rgba(192,132,252,0.4)'
        ctx.fill()
        ctx.strokeStyle = n.kind === 'predator' ? '#f87171' : '#c084fc'
        ctx.lineWidth = 2 * dpr
        ctx.stroke()
      }

      ctx.fillStyle = 'rgba(34,211,238,0.85)'
      for (const b of boids) {
        ctx.beginPath()
        ctx.arc(b.x, b.y, 2.2 * dpr, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [dpr, cssW, cssH])

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!placement) return
    const canvas = canvasRef.current
    if (!canvas) return
    const r = canvas.getBoundingClientRect()
    const sx = (e.clientX - r.left) * (canvas.width / r.width)
    const sy = (e.clientY - r.top) * (canvas.height / r.height)
    if (nodesRef.current.length >= MAX_NODES) nodesRef.current.shift()
    nodesRef.current.push({
      x: sx,
      y: sy,
      kind: placement === 'predator' ? 'predator' : 'attractor',
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-3">
        <p className="text-sm text-slate-300">
          <Orbit className="mb-0.5 mr-1 inline h-4 w-4 text-cyan-400" aria-hidden />
          Reynolds flocking — <span className="text-cyan-200/90">separation</span>,{' '}
          <span className="text-purple-200/90">alignment</span>,{' '}
          <span className="text-slate-200">cohesion</span>. Choose a node mode and click the field to
          drop repulsors or attractors.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRunning((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs text-cyan-100"
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={resetFlock}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 font-mono text-xs text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset flock
          </button>
          <button
            type="button"
            onClick={() => {
              nodesRef.current = []
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 font-mono text-xs text-slate-200"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear nodes
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPlacement((p) => (p === 'predator' ? null : 'predator'))}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs ${
              placement === 'predator'
                ? 'border-red-400/50 bg-red-500/15 text-red-100'
                : 'border-slate-600 text-slate-300'
            }`}
          >
            <Skull className="h-3.5 w-3.5" />
            Predator node
          </button>
          <button
            type="button"
            onClick={() => setPlacement((p) => (p === 'attractor' ? null : 'attractor'))}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs ${
              placement === 'attractor'
                ? 'border-purple-400/50 bg-purple-500/15 text-purple-100'
                : 'border-slate-600 text-slate-300'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            Attractor node
          </button>
          <span className="self-center font-mono text-[10px] text-slate-500">
            {placement ? 'Click canvas to place' : 'Select a mode to place'}
          </span>
        </div>
        <div
          ref={wrapRef}
          className={`overflow-hidden rounded-xl border bg-slate-950 ${
            placement ? 'border-cyan-500/40 ring-1 ring-cyan-500/20' : 'border-cyan-500/20'
          }`}
        >
          <canvas
            ref={canvasRef}
            className={`block w-full max-w-full ${placement ? 'cursor-crosshair' : 'cursor-default'}`}
            onClick={onCanvasClick}
            role="img"
            aria-label="Boids flock simulation"
          />
        </div>
      </div>

      <aside className="space-y-4 rounded-xl border border-purple-500/25 bg-slate-900/50 p-4 backdrop-blur-md">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-purple-300/90">
          <Radar className="h-4 w-4" aria-hidden />
          Field parameters
        </p>
        {[
          { label: 'Separation', v: sep, set: setSep, min: 0, max: 3, step: 0.05 },
          { label: 'Alignment', v: align, set: setAlign, min: 0, max: 3, step: 0.05 },
          { label: 'Cohesion', v: coh, set: setCoh, min: 0, max: 3, step: 0.05 },
          { label: 'Max speed', v: maxSpeed, set: setMaxSpeed, min: 0.5, max: 5, step: 0.1 },
          { label: 'Perception px', v: perception, set: setPerception, min: 24, max: 140, step: 2 },
        ].map((s) => (
          <label key={s.label} className="block text-xs text-slate-400">
            <span className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {s.label}
              <span className="text-cyan-400/90">{s.v.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.v}
              onChange={(e) => s.set(Number(e.target.value))}
              className="mt-1 w-full accent-cyan-400"
            />
          </label>
        ))}
        <p className="border-t border-slate-800 pt-3 font-mono text-[10px] leading-relaxed text-slate-300">
          <Sparkles className="mb-1 inline h-3 w-3 text-purple-400" aria-hidden />
          {N_BOIDS} agents · toroidal wrap · local-first (no network)
        </p>
      </aside>
    </div>
  )
}
