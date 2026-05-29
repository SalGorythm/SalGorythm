import { Dna, Pause, Play, RotateCcw, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { applyCanvasBitmapSize, useCanvasContainerSize } from './useCanvasContainerSize'

const POP = 25
const GENOME_LEN = 54
const TICKS_PER_GENE = 5
const PHASE_TICKS = GENOME_LEN * TICKS_PER_GENE // 270 ≈ 4.5s @ 60fps

type Rocket = {
  x: number
  y: number
  vx: number
  vy: number
  h: number
  alive: boolean
  minDist: number
  genome: number[]
}

function randGenome(): number[] {
  const g: number[] = []
  for (let i = 0; i < GENOME_LEN; i++) g.push(Math.random() * 2 - 1)
  return g
}

function initRocket(w: number, h: number, genome: number[]): Rocket {
  return {
    x: w * 0.08,
    y: h * 0.78,
    vx: 0,
    vy: 0,
    h: -Math.PI / 2 + (Math.random() - 0.5) * 0.4,
    alive: true,
    minDist: 1e9,
    genome,
  }
}

function obstacleRect(w: number, h: number) {
  const ow = w * 0.22
  const oh = h * 0.14
  return { x: w * 0.5 - ow / 2, y: h * 0.44 - oh / 2, w: ow, h: oh }
}

function inObstacle(x: number, y: number, w: number, h: number): boolean {
  const o = obstacleRect(w, h)
  return x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h
}

function fitnessOf(r: Rocket, w: number, h: number): number {
  const tx = w * 0.92
  const ty = h * 0.15
  const d = Math.hypot(tx - r.x, ty - r.y)
  let f = 2000 / (d + 8)
  if (d < 36) f += 400
  if (!r.alive) f *= 0.35
  f += 800 / (r.minDist + 12)
  return f
}

function breed(a: number[], b: number[], mut: number): number[] {
  const cut = 1 + Math.floor(Math.random() * (GENOME_LEN - 2))
  const out: number[] = []
  for (let i = 0; i < GENOME_LEN; i++) {
    let v = i < cut ? a[i]! : b[i]!
    if (Math.random() < mut) v += (Math.random() * 2 - 1) * 0.85
    v = Math.max(-1, Math.min(1, v))
    out.push(v)
  }
  return out
}

export function GeneticEvolutionSim() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { cssW, cssH, dpr } = useCanvasContainerSize(wrapRef, 18 / 10, 400, 240)

  const popRef = useRef<Rocket[]>([])
  const tickRef = useRef(0)
  const runningRef = useRef(true)
  const mutRef = useRef(0.12)
  const rafRef = useRef(0)

  const [running, setRunning] = useState(true)
  const [generation, setGeneration] = useState(1)
  const [mutationPct, setMutationPct] = useState(12)
  const [maxFitness, setMaxFitness] = useState(0)
  const [fitnessSeries, setFitnessSeries] = useState<number[]>([])

  useEffect(() => {
    mutRef.current = mutationPct / 100
  }, [mutationPct])

  useEffect(() => {
    runningRef.current = running
  }, [running])

  const resetAll = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    const w = c.width
    const h = c.height
    popRef.current = Array.from({ length: POP }, () => initRocket(w, h, randGenome()))
    tickRef.current = 0
    setGeneration(1)
    setMaxFitness(0)
    setFitnessSeries([])
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    applyCanvasBitmapSize(canvas, cssW, cssH, dpr)
    popRef.current = Array.from({ length: POP }, () => initRocket(canvas.width, canvas.height, randGenome()))
    tickRef.current = 0
  }, [cssW, cssH, dpr])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const tx = () => canvas.width * 0.92
    const ty = () => canvas.height * 0.15

    const step = () => {
      const w = canvas.width
      const h = canvas.height
      const obs = obstacleRect(w, h)

      if (runningRef.current) {
        const t = tickRef.current
        const pop = popRef.current

        if (t >= PHASE_TICKS) {
          const scored = pop.map((r) => ({ r, f: fitnessOf(r, w, h) }))
          scored.sort((a, b) => b.f - a.f)
          const bestF = scored[0]!.f
          setMaxFitness(bestF)
          setFitnessSeries((s) => [...s.slice(-48), bestF])
          setGeneration((g) => g + 1)

          const elite = scored.slice(0, 2).map((s) => s.r.genome)
          const nextGenomes: number[][] = [...elite]
          const mut = mutRef.current
          while (nextGenomes.length < POP) {
            const pa = scored[Math.floor(Math.random() * 8)]!.r.genome
            const pb = scored[Math.floor(Math.random() * 8)]!.r.genome
            nextGenomes.push(breed(pa, pb, mut))
          }
          popRef.current = nextGenomes.map((g) => initRocket(w, h, g))
          tickRef.current = 0
        } else {
          const gi = Math.min(GENOME_LEN - 1, Math.floor(t / TICKS_PER_GENE))
          const thrust = 0.42 * dpr
          const turnMax = 0.18

          for (const r of pop) {
            if (!r.alive) continue
            const steer = r.genome[gi]! * turnMax
            r.h += steer
            r.vx = Math.cos(r.h) * thrust
            r.vy = Math.sin(r.h) * thrust
            r.x += r.vx
            r.y += r.vy
            const d = Math.hypot(tx() - r.x, ty() - r.y)
            if (d < r.minDist) r.minDist = d
            if (r.x < 4 || r.x > w - 4 || r.y < 4 || r.y > h - 4) r.alive = false
            if (inObstacle(r.x, r.y, w, h)) r.alive = false
          }
          tickRef.current += 1
        }
      }

      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(34,211,238,0.08)'
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, h)
        ctx.stroke()
      }

      ctx.fillStyle = 'rgba(15,23,42,0.95)'
      ctx.strokeStyle = 'rgba(148,163,184,0.5)'
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h)
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h)
      ctx.font = `${10 * dpr}px monospace`
      ctx.fillStyle = '#64748b'
      ctx.fillText('BARRIER', obs.x + 6 * dpr, obs.y + 14 * dpr)

      ctx.fillStyle = 'rgba(34,211,238,0.25)'
      ctx.fillRect(w * 0.04, h * 0.74, w * 0.1, h * 0.08)
      ctx.strokeStyle = '#22d3ee'
      ctx.strokeRect(w * 0.04, h * 0.74, w * 0.1, h * 0.08)
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('LAUNCH', w * 0.045, h * 0.79)

      ctx.beginPath()
      ctx.arc(tx(), ty(), 22 * dpr, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(192,132,252,0.2)'
      ctx.fill()
      ctx.strokeStyle = '#c084fc'
      ctx.stroke()
      ctx.fillStyle = '#e9d5ff'
      ctx.fillText('TARGET', tx() - 24 * dpr, ty() + 4 * dpr)

      for (const r of popRef.current) {
        if (!r.alive) continue
        ctx.save()
        ctx.translate(r.x, r.y)
        ctx.rotate(r.h)
        ctx.fillStyle = 'rgba(34,211,238,0.9)'
        ctx.beginPath()
        ctx.moveTo(8 * dpr, 0)
        ctx.lineTo(-5 * dpr, 4 * dpr)
        ctx.lineTo(-4 * dpr, 0)
        ctx.lineTo(-5 * dpr, -4 * dpr)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      const prog = tickRef.current / PHASE_TICKS
      ctx.fillStyle = 'rgba(34,211,238,0.15)'
      ctx.fillRect(8, h - 16 * dpr, (w - 16) * prog, 4 * dpr)
      ctx.strokeStyle = 'rgba(34,211,238,0.4)'
      ctx.strokeRect(8, h - 16 * dpr, w - 16, 4 * dpr)

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [dpr])

  const maxSeries = fitnessSeries.length ? Math.max(...fitnessSeries, 1) : 1

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        <Dna className="mb-0.5 mr-1 inline h-4 w-4 text-purple-400" aria-hidden />
        Micro-rockets evolve steering genes to reach the target past a central barrier — full GA
        crossover, elitism, and mutation runs <strong className="text-slate-200">locally</strong> in
        your browser.
      </p>
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400">
        <button
          type="button"
          onClick={() => setRunning((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-purple-100"
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Pause' : 'Resume'}
        </button>
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 text-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset GA
        </button>
        <span className="rounded border border-cyan-500/25 bg-cyan-500/5 px-2 py-1 text-cyan-200/90">
          Gen <span className="text-cyan-100">{generation}</span>
        </span>
        <span className="rounded border border-slate-700 px-2 py-1">
          Max fitness <span className="text-emerald-400/90">{maxFitness.toFixed(1)}</span>
        </span>
        <label className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-slate-500" aria-hidden />
          Mutation %
          <input
            type="range"
            min={2}
            max={35}
            value={mutationPct}
            onChange={(e) => setMutationPct(Number(e.target.value))}
            className="w-28 accent-purple-400"
          />
          <span className="text-purple-300/90">{mutationPct}%</span>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
        <div ref={wrapRef} className="overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950">
          <canvas ref={canvasRef} className="block w-full" role="img" aria-label="Genetic rocket evolution" />
        </div>
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Max fitness
          </p>
          <svg viewBox="0 0 100 60" className="h-36 w-full text-cyan-400" preserveAspectRatio="none">
            <rect width="100" height="60" fill="rgba(15,23,42,0.6)" rx="4" />
            {fitnessSeries.length > 1 && (
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                points={fitnessSeries
                  .map((v, i) => {
                    const x = (i / Math.max(fitnessSeries.length - 1, 1)) * 96 + 2
                    const y = 58 - (v / maxSeries) * 52
                    return `${x},${y}`
                  })
                  .join(' ')}
              />
            )}
            {fitnessSeries.length === 1 && (
              <circle cx="50" cy="30" r="2" fill="currentColor" className="text-cyan-400" />
            )}
            {fitnessSeries.length === 0 && (
              <text x="50" y="32" textAnchor="middle" className="fill-slate-600 text-[6px]">
                Evolving…
              </text>
            )}
          </svg>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-slate-500">
            {POP} rockets · {GENOME_LEN} genes · {PHASE_TICKS} ticks / gen (~{Math.round((PHASE_TICKS / 60) * 10) / 10}s)
          </p>
        </div>
      </div>
    </div>
  )
}
