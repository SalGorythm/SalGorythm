import { useCallback, useEffect, useReducer } from 'react'

const W = 14
const H = 14
const TICK_MS = 140

type Pt = { x: number; y: number }

const INITIAL_SNAKE: Pt[] = [
  { x: 4, y: 7 },
  { x: 3, y: 7 },
  { x: 2, y: 7 },
]

function randFood(snake: Pt[]): Pt {
  for (let k = 0; k < 200; k++) {
    const x = Math.floor(Math.random() * W)
    const y = Math.floor(Math.random() * H)
    if (!snake.some((s) => s.x === x && s.y === y)) return { x, y }
  }
  return { x: 0, y: 0 }
}

type GameState = {
  snake: Pt[]
  food: Pt
  dir: Pt
  alive: boolean
  score: number
}

function initialGameState(): GameState {
  const snake = INITIAL_SNAKE
  return {
    snake,
    food: randFood(snake),
    dir: { x: 1, y: 0 },
    alive: true,
    score: 0,
  }
}

type GameAction =
  | { type: 'TICK' }
  | { type: 'RESET' }
  | { type: 'STEER'; dir: Pt }

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'RESET') {
    return initialGameState()
  }

  if (action.type === 'STEER') {
    if (!state.alive) return state
    const { dir } = state
    const nd = action.dir
    if (dir.x === -nd.x && dir.y === -nd.y) return state
    return { ...state, dir: nd }
  }

  if (action.type === 'TICK') {
    if (!state.alive) return state

    const { snake, food, dir } = state
    const head = snake[0]!
    const nh = { x: (head.x + dir.x + W) % W, y: (head.y + dir.y + H) % H }
    const ate = nh.x === food.x && nh.y === food.y
    const body = ate ? snake : snake.slice(0, -1)

    if (body.some((s) => s.x === nh.x && s.y === nh.y)) {
      return { ...state, alive: false }
    }

    const nextSnake = [nh, ...body]

    if (ate) {
      return {
        ...state,
        snake: nextSnake,
        food: randFood(nextSnake),
        score: state.score + 1,
      }
    }

    return { ...state, snake: nextSnake }
  }

  return state
}

export function NeonSnake() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialGameState)
  const { snake, food, alive, score } = state

  useEffect(() => {
    if (!alive) return
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK' })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [alive])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const steer = useCallback((dx: number, dy: number) => {
    dispatch({ type: 'STEER', dir: { x: dx, y: dy } })
  }, [])

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
      <p className="text-sm text-slate-300">
        Toroidal neon snake — wrap through walls. Eat glitches to grow. Arrow keys or on-screen
        D-pad.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-400">
        <span>
          Score: {score} · Length: {snake.length}
        </span>
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
                  ? 'rounded-sm bg-cyan-400'
                  : isBody
                    ? 'rounded-sm bg-cyan-600/80'
                    : isFood
                      ? 'rounded-full bg-purple-400'
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
