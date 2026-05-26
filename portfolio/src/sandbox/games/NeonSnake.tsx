import { useCallback, useEffect, useRef, useState } from 'react'

const W = 14
const H = 14
const TICK_MS = 140

type Pt = { x: number; y: number }

function randFood(snake: Pt[]): Pt {
  for (let k = 0; k < 200; k++) {
    const x = Math.floor(Math.random() * W)
    const y = Math.floor(Math.random() * H)
    if (!snake.some((s) => s.x === x && s.y === y)) return { x, y }
  }
  return { x: 0, y: 0 }
}

export function NeonSnake() {
  const [snake, setSnake] = useState<Pt[]>([
    { x: 4, y: 7 },
    { x: 3, y: 7 },
    { x: 2, y: 7 },
  ])
  const [food, setFood] = useState<Pt>(() => randFood([{ x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }]))
  const foodRef = useRef(food)

  const [dir, setDir] = useState<Pt>({ x: 1, y: 0 })
  const [alive, setAlive] = useState(true)
  const [score, setScore] = useState(0)
  const dirRef = useRef(dir)

  useEffect(() => {
    foodRef.current = food
  }, [food])

  useEffect(() => {
    dirRef.current = dir
  }, [dir])

  const reset = useCallback(() => {
    const s = [
      { x: 4, y: 7 },
      { x: 3, y: 7 },
      { x: 2, y: 7 },
    ]
    setSnake(s)
    const f = randFood(s)
    setFood(f)
    foodRef.current = f
    setDir({ x: 1, y: 0 })
    setAlive(true)
    setScore(0)
  }, [])

  useEffect(() => {
    if (!alive) return
    const id = window.setInterval(() => {
      setSnake((prev) => {
        const d = dirRef.current
        const head = prev[0]!
        const nh = { x: (head.x + d.x + W) % W, y: (head.y + d.y + H) % H }
        const f = foodRef.current
        const ate = nh.x === f.x && nh.y === f.y
        const body = ate ? prev : prev.slice(0, -1)
        if (body.some((s) => s.x === nh.x && s.y === nh.y)) {
          setAlive(false)
          return prev
        }
        const next = [nh, ...body]
        if (ate) {
          setScore((sc) => sc + 1)
          const nf = randFood(next)
          foodRef.current = nf
          setFood(nf)
        }
        return next
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [alive])

  const steer = useCallback(
    (dx: number, dy: number) => {
      if (!alive) return
      setDir((d) => {
        if (d.x === -dx && d.y === -dy) return d
        return { x: dx, y: dy }
      })
    },
    [alive],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        steer(0, -1)
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        steer(0, 1)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        steer(-1, 0)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        steer(1, 0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [steer])

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Toroidal neon snake — wrap through walls. Eat glitches to grow. Arrow keys or on-screen
        D-pad.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-400">
        <span>Score: {score}</span>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-600 px-2 py-1 text-slate-200 hover:border-cyan-500/40"
        >
          Reset run
        </button>
      </div>
      {!alive && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          Collision — snake halted. Reset to respawn.
        </p>
      )}
      <div
        className="mx-auto grid w-max gap-0.5 rounded-xl border border-cyan-500/25 bg-slate-950 p-2"
        style={{ gridTemplateColumns: `repeat(${W}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: H * W }).map((_, i) => {
          const x = i % W
          const y = Math.floor(i / W)
          const isHead = snake[0]?.x === x && snake[0]?.y === y
          const isBody = snake.slice(1).some((s) => s.x === x && s.y === y)
          const isFood = food.x === x && food.y === y
          return (
            <div
              key={i}
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                isHead
                  ? 'rounded-sm bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'
                  : isBody
                    ? 'rounded-sm bg-cyan-600/80'
                    : isFood
                      ? 'rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.7)]'
                      : 'bg-slate-900/60'
              }`}
            />
          )
        })}
      </div>
      <div className="mx-auto grid max-w-[200px] grid-cols-3 gap-2 font-mono text-xs">
        <span />
        <button
          type="button"
          className="rounded-lg border border-slate-600 py-2 text-slate-200 hover:border-cyan-500/40"
          onClick={() => steer(0, -1)}
        >
          ↑
        </button>
        <span />
        <button
          type="button"
          className="rounded-lg border border-slate-600 py-2 text-slate-200 hover:border-cyan-500/40"
          onClick={() => steer(-1, 0)}
        >
          ←
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-600 py-2 text-slate-200 hover:border-cyan-500/40"
          onClick={() => steer(0, 1)}
        >
          ↓
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-600 py-2 text-slate-200 hover:border-cyan-500/40"
          onClick={() => steer(1, 0)}
        >
          →
        </button>
      </div>
    </div>
  )
}
