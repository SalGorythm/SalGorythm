import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Act = 'tanh' | 'relu' | 'sigmoid'

function actFn(a: Act, x: number): number {
  if (a === 'relu') return Math.max(0, x)
  if (a === 'sigmoid') return 1 / (1 + Math.exp(-x))
  return Math.tanh(x)
}

function actDeriv(a: Act, x: number, y: number): number {
  if (a === 'relu') return x > 0 ? 1 : 0
  if (a === 'sigmoid') return y * (1 - y)
  return 1 - y * y
}

type Pt = { x: number; y: number; label: number }

function makeSpiral(nPer: number): Pt[] {
  const pts: Pt[] = []
  for (let lab = 0; lab < 2; lab++) {
    for (let i = 0; i < nPer; i++) {
      const r = (i / nPer) * 1.1 + 0.05
      const t = (i / nPer) * 5 * Math.PI + lab * Math.PI
      const x = r * Math.sin(t) + (Math.random() - 0.5) * 0.08
      const y = r * Math.cos(t) + (Math.random() - 0.5) * 0.08
      pts.push({ x, y, label: lab })
    }
  }
  return pts
}

export function NeuralTuningSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [lr, setLr] = useState(0.15)
  const [hidden, setHidden] = useState(8)
  const [activation, setActivation] = useState<Act>('tanh')
  const [running, setRunning] = useState(false)
  const pts = useMemo(() => makeSpiral(55), [])

  const wRef = useRef<{ w1: number[][]; b1: number[]; w2: number[]; b: number } | null>(null)

  const resetNet = useCallback(() => {
    const h = Math.max(2, Math.min(24, hidden))
    const w1: number[][] = Array.from({ length: h }, () => [
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.8,
    ])
    const b1 = Array.from({ length: h }, () => (Math.random() - 0.5) * 0.2)
    const w2 = Array.from({ length: h }, () => (Math.random() - 0.5) * 0.5)
    const b = (Math.random() - 0.5) * 0.2
    wRef.current = { w1, b1, w2, b }
  }, [hidden])

  useEffect(() => {
    resetNet()
  }, [resetNet])

  const draw = useCallback(() => {
    const c = canvasRef.current
    const net = wRef.current
    if (!c || !net) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const W = c.width
    const H = c.height
    ctx.fillStyle = '#020617'
    ctx.fillRect(0, 0, W, H)

    const pad = 24
    const sx = (x: number) => pad + ((x + 1.4) / 2.8) * (W - pad * 2)
    const sy = (y: number) => H - pad - ((y + 1.4) / 2.8) * (H - pad * 2)

    const grid = 56
    for (let gx = 0; gx < grid; gx++) {
      for (let gy = 0; gy < grid; gy++) {
        const nx = (gx / (grid - 1)) * 2.8 - 1.4
        const ny = (gy / (grid - 1)) * 2.8 - 1.4
        let z = net.b
        for (let j = 0; j < net.w1.length; j++) {
          const pre = net.w1[j][0] * nx + net.w1[j][1] * ny + net.b1[j]
          z += net.w2[j] * actFn(activation, pre)
        }
        const p = 1 / (1 + Math.exp(-z))
        const r = Math.floor(10 + p * 40)
        const g = Math.floor(15 + (1 - p) * 120)
        const b = Math.floor(35 + p * 160)
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(Math.floor(sx(nx) - 3), Math.floor(sy(ny) - 3), 6, 6)
      }
    }

    for (const p of pts) {
      const pre = p.label === 0
      ctx.beginPath()
      ctx.arc(sx(p.x), sy(p.y), 4, 0, Math.PI * 2)
      ctx.fillStyle = pre ? '#22d3ee' : '#c084fc'
      ctx.fill()
    }

    ctx.strokeStyle = 'rgba(148,163,184,0.35)'
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2)
  }, [activation, pts])

  const step = useCallback(() => {
    const net = wRef.current
    if (!net) return
    const h = net.w1.length
    for (let s = 0; s < 8; s++) {
      const p = pts[Math.floor(Math.random() * pts.length)]
      const x0 = p.x
      const x1 = p.y
      const y = p.label
      const pre: number[] = []
      const act: number[] = []
      for (let j = 0; j < h; j++) {
        const z = net.w1[j][0] * x0 + net.w1[j][1] * x1 + net.b1[j]
        pre.push(z)
        act.push(actFn(activation, z))
      }
      let logit = net.b
      for (let j = 0; j < h; j++) logit += net.w2[j] * act[j]
      const pred = 1 / (1 + Math.exp(-logit))
      const err = pred - y
      const dLogit = err * pred * (1 - pred)
      const dAct: number[] = []
      for (let j = 0; j < h; j++) {
        const da = dLogit * net.w2[j]
        dAct.push(da * actDeriv(activation, pre[j], act[j]))
      }
      for (let j = 0; j < h; j++) {
        net.w2[j] -= lr * dLogit * act[j]
        net.w1[j][0] -= lr * dAct[j] * x0
        net.w1[j][1] -= lr * dAct[j] * x1
        net.b1[j] -= lr * dAct[j]
      }
      net.b -= lr * dLogit
    }
  }, [activation, lr, pts])

  useEffect(() => {
    draw()
  }, [draw, hidden, activation])

  useEffect(() => {
    if (!running) return
    let id = 0
    const tick = () => {
      step()
      draw()
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [running, step, draw])

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        Tune a tiny 2→H→1 classifier on a synthetic two-spiral dataset. Training runs fully in your
        browser — no API calls.
      </p>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <canvas
          ref={canvasRef}
          width={520}
          height={420}
          className="h-auto w-full max-w-full rounded-xl border border-cyan-500/25 bg-slate-950"
        />
        <div className="space-y-4 rounded-xl border border-slate-800/90 bg-slate-900/40 p-4 font-mono text-xs">
          <label className="block text-slate-400">
            Learning rate: {lr.toFixed(2)}
            <input
              type="range"
              min={0.02}
              max={0.45}
              step={0.01}
              value={lr}
              onChange={(e) => setLr(Number(e.target.value))}
              className="mt-1 w-full accent-cyan-400"
            />
          </label>
          <label className="block text-slate-400">
            Hidden units: {hidden}
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={hidden}
              onChange={(e) => setHidden(Number(e.target.value))}
              className="mt-1 w-full accent-cyan-400"
            />
          </label>
          <fieldset className="space-y-1 text-slate-400">
            <legend className="mb-1 text-[10px] uppercase tracking-widest">Activation</legend>
            {(['tanh', 'relu', 'sigmoid'] as Act[]).map((a) => (
              <label key={a} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="act"
                  checked={activation === a}
                  onChange={() => setActivation(a)}
                />
                {a}
              </label>
            ))}
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRunning((v) => !v)}
              className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-2 text-cyan-100 transition hover:bg-cyan-500/25"
            >
              {running ? 'Pause' : 'Train'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetNet()
                draw()
              }}
              className="rounded-lg border border-slate-600 px-3 py-2 text-slate-200 hover:border-purple-500/40"
            >
              Reset weights
            </button>
            <button
              type="button"
              onClick={() => {
                step()
                draw()
              }}
              className="rounded-lg border border-slate-600 px-3 py-2 text-slate-200 hover:border-purple-500/40"
            >
              Step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
