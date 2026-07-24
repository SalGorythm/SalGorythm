import { Atom, Brain, Orbit, Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { applyCanvasBitmapSize, useCanvasContainerSize } from './useCanvasContainerSize'

export type FourierMode = 'quantum' | 'neural' | 'gravity'

const MODES: { id: FourierMode; label: string; icon: typeof Sparkles }[] = [
  { id: 'quantum', label: 'Quantum Chaos', icon: Atom },
  { id: 'neural', label: 'Neural Synapse', icon: Brain },
  { id: 'gravity', label: 'Gravity Well', icon: Orbit },
]

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

export function FourierWaveCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { cssW, cssH, dpr } = useCanvasContainerSize(wrapRef, 16 / 9, 360, 220)

  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const modeRef = useRef<FourierMode>('quantum')
  const runningRef = useRef(true)
  const rafRef = useRef(0)
  const tRef = useRef(0)

  const [running, setRunning] = useState(true)
  const [mode, setMode] = useState<FourierMode>('quantum')

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    runningRef.current = running
  }, [running])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    applyCanvasBitmapSize(canvas, cssW, cssH, dpr)
  }, [cssW, cssH, dpr])

  const resetField = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d', { alpha: false })
    if (!ctx) return
    ctx.fillStyle = '#020617'
    ctx.fillRect(0, 0, c.width, c.height)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const sampleField = (
      px: number,
      py: number,
      w: number,
      h: number,
      cx: number,
      cy: number,
      m: FourierMode,
      time: number,
      mdx: number,
      mdy: number,
    ): number => {
      const dx = px - cx
      const dy = py - cy
      const r = Math.hypot(dx, dy) + 1e-4
      const ang = Math.atan2(dy, dx)
      const mx = mdx * 0.018
      const my = mdy * 0.018
      let v = 0

      if (m === 'quantum') {
        for (let k = 1; k <= 6; k++) {
          const wk = k * 0.9
          v += Math.sin(r * 0.035 * wk + time * (0.4 + k * 0.07) + mx * k + my * (k * 0.5))
          v += 0.55 * Math.cos(ang * k + time * 0.3 + r * 0.02)
        }
        v *= 0.22
      } else if (m === 'neural') {
        const n1 = Math.sin(r * 0.05 + time * 0.5) * Math.cos(ang * 3 + time * 0.2)
        const pulse = Math.exp(-r / (w * 0.18)) * Math.sin(time * 2 + r * 0.08)
        const syn = Math.sin((px - cx - mx * 40) * 0.02) * Math.sin((py - cy - my * 40) * 0.02 + time)
        v = (n1 + pulse + syn * 0.6) * 0.35
      } else {
        const gx = cx + mx * w * 0.35
        const gy = cy + my * h * 0.35
        const gr = Math.hypot(px - gx, py - gy) + 40
        const well = -800 / (gr * 0.08)
        const swirl = Math.sin(ang * 5 + time * 0.4 + 120 / gr)
        v = (well * 0.004 + swirl * 0.4) * 0.25
      }
      return v
    }

    const step = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w * 0.5
      const cy = h * 0.5
      const m = modeRef.current
      const mouse = mouseRef.current

      if (runningRef.current) {
        tRef.current += 1
        const time = tRef.current * 0.016

        ctx.fillStyle = 'rgba(2,6,23,0.14)'
        ctx.fillRect(0, 0, w, h)

        const cols = 72
        const rows = 42
        const cellX = w / cols
        const cellY = h / rows

        const mdx = mouse.active ? mouse.x - cx : Math.sin(time * 0.7) * w * 0.15
        const mdy = mouse.active ? mouse.y - cy : Math.cos(time * 0.55) * h * 0.12

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const px = (i + 0.5) * cellX
            const py = (j + 0.5) * cellY
            const v = sampleField(px, py, w, h, cx, cy, m, time, mdx, mdy)
            const u = clamp01(v * 0.5 + 0.5)
            const hue = 190 + u * 90 + (m === 'neural' ? 40 : 0)
            const lit = 45 + u * 40
            ctx.fillStyle = `hsla(${hue}, 85%, ${lit}%, ${0.06 + u * 0.22})`
            ctx.fillRect(Math.floor(i * cellX), Math.floor(j * cellY), Math.ceil(cellX) + 1, Math.ceil(cellY) + 1)
          }
        }

        if (mouse.active) {
          ctx.beginPath()
          ctx.arc(mouse.x, mouse.y, 6 * dpr, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(34,211,238,0.5)'
          ctx.lineWidth = 2 * dpr
          ctx.stroke()
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    ctx.fillStyle = '#020617'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [dpr])

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - r.left) * (c.width / r.width),
      y: (e.clientY - r.top) * (c.height / r.height),
      active: true,
    }
  }

  const onLeave = () => {
    mouseRef.current.active = false
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        <Sparkles className="mb-0.5 mr-1 inline h-4 w-4 text-purple-400" aria-hidden />
        Fourier-style harmonics over a polar field — mouse position warps phase; modes swap how
        interference, synaptic pulses, or synthetic gravity sculpt the neon field.
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
          onClick={resetField}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 font-mono text-xs text-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear canvas
        </button>
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Visual algorithm
        </span>
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] ${
              mode === id
                ? 'border-purple-400/50 bg-purple-500/15 text-purple-100'
                : 'border-slate-700 text-slate-400 hover:border-cyan-500/30'
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </button>
        ))}
      </div>
      <div ref={wrapRef} className="overflow-hidden rounded-xl border border-purple-500/25 bg-slate-950">
        <canvas
          ref={canvasRef}
          className="block w-full cursor-crosshair"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          role="img"
          aria-label="Fourier interference generative canvas"
        />
      </div>
    </div>
  )
}
