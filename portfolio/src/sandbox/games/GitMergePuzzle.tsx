import { useCallback, useEffect, useMemo, useState } from 'react'

const SIZE = 4
/** 0 empty, -1 conflict, 1 feature, 2 dev, 3 staging, 4 main */
type Cell = number

const LABELS: Record<number, string> = {
  [-1]: 'CONFLICT',
  0: '',
  1: 'FEATURE',
  2: 'DEV',
  3: 'STAGING',
  4: 'MAIN',
}

function emptyGrid(): Cell[][] {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0 as Cell))
}

function clone(g: Cell[][]) {
  return g.map((row) => [...row])
}

function addRandom(g: Cell[][]) {
  const empties: [number, number][] = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (g[r][c] === 0) empties.push([r, c])
    }
  }
  if (!empties.length) return
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]!
  const roll = Math.random()
  g[r][c] = roll < 0.08 ? -1 : 1
}

function mergePair(a: Cell, b: Cell): Cell | null {
  if (a <= 0 || b <= 0) return null
  if (a === -1 || b === -1) return null
  if (a !== b) return null
  if (a === 4) return null
  return a + 1
}

function slideLine(line: Cell[]): { line: Cell[]; moved: boolean } {
  const orig = [...line]
  const tiles = line.filter((x) => x !== 0)
  const out: Cell[] = []
  let i = 0
  while (i < tiles.length) {
    const cur = tiles[i]!
    const nxt = tiles[i + 1]
    const merged = nxt !== undefined ? mergePair(cur, nxt) : null
    if (merged !== null) {
      out.push(merged)
      i += 2
    } else {
      out.push(cur)
      i += 1
    }
  }
  while (out.length < SIZE) out.push(0)
  const moved = out.some((v, idx) => v !== (orig[idx] ?? 0))
  return { line: out, moved }
}

function moveDir(g: Cell[][], dir: 'left' | 'right' | 'up' | 'down'): { g: Cell[][]; moved: boolean } {
  const ng = clone(g)
  let moved = false

  if (dir === 'left') {
    for (let r = 0; r < SIZE; r++) {
      const { line, moved: m } = slideLine(ng[r]!)
      ng[r] = line
      if (m) moved = true
    }
  } else if (dir === 'right') {
    for (let r = 0; r < SIZE; r++) {
      const rev = [...ng[r]!].reverse()
      const { line, moved: m } = slideLine(rev)
      ng[r] = line.reverse()
      if (m) moved = true
    }
  } else if (dir === 'up') {
    for (let c = 0; c < SIZE; c++) {
      const col: Cell[] = [ng[0]![c]!, ng[1]![c]!, ng[2]![c]!, ng[3]![c]!]
      const { line, moved: m } = slideLine(col)
      for (let r = 0; r < SIZE; r++) ng[r]![c] = line[r]!
      if (m) moved = true
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      const col: Cell[] = [ng[3]![c]!, ng[2]![c]!, ng[1]![c]!, ng[0]![c]!]
      const { line, moved: m } = slideLine(col)
      for (let r = 0; r < SIZE; r++) ng[3 - r]![c] = line[r]!
      if (m) moved = true
    }
  }

  return { g: ng, moved }
}

export function GitMergePuzzle() {
  const [grid, setGrid] = useState<Cell[][]>(() => {
    const g = emptyGrid()
    addRandom(g)
    addRandom(g)
    return g
  })
  const [gameOver, setGameOver] = useState(false)

  const maxRank = useMemo(() => {
    let m = 0
    for (const row of grid) {
      for (const v of row) {
        if (v > m) m = v
      }
    }
    return m
  }, [grid])

  const applyMove = useCallback(
    (dir: 'left' | 'right' | 'up' | 'down') => {
      if (gameOver) return
      const { g, moved } = moveDir(grid, dir)
      if (!moved) return
      addRandom(g)
      setGrid(g)
      const full = !g.flat().includes(0)
      if (full) setGameOver(true)
    },
    [grid, gameOver],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        applyMove('left')
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        applyMove('right')
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        applyMove('up')
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        applyMove('down')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [applyMove])

  const reset = () => {
    const g = emptyGrid()
    addRandom(g)
    addRandom(g)
    setGrid(g)
    setGameOver(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        2048-style merges: FEATURE → DEV → STAGING → MAIN. CONFLICT tiles do not merge. Arrow keys
        or buttons to slide.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-400">
        <span>Highest branch: {LABELS[maxRank] ?? maxRank}</span>
        {gameOver && <span className="text-amber-300">Grid full — reset to continue</span>}
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-600 px-2 py-1 text-slate-200 hover:border-cyan-500/40"
        >
          Reset
        </button>
      </div>
      <div className="mx-auto grid w-max grid-cols-4 gap-2 rounded-xl border border-cyan-500/25 bg-slate-950/80 p-3">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`flex h-16 w-16 items-center justify-center rounded-lg border text-center font-mono text-[10px] font-semibold uppercase leading-tight ${
                cell === 0
                  ? 'border-slate-800/80 bg-slate-900/40 text-transparent'
                  : cell === -1
                    ? 'border-red-500/50 bg-red-500/15 text-red-200'
                    : cell === 1
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-100'
                      : cell === 2
                        ? 'border-purple-500/40 bg-purple-500/10 text-purple-100'
                        : cell === 3
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
                          : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
              }`}
            >
              {LABELS[cell] ?? ''}
            </div>
          )),
        )}
      </div>
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2 font-mono text-xs">
        <span />
        <button
          type="button"
          className="rounded-lg border border-slate-600 py-2 text-slate-200 hover:border-cyan-500/40"
          onClick={() => applyMove('up')}
        >
          ↑
        </button>
        <span />
        <button
          type="button"
          className="rounded-lg border border-slate-600 py-2 text-slate-200 hover:border-cyan-500/40"
          onClick={() => applyMove('left')}
        >
          ←
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-600 py-2 text-slate-200 hover:border-cyan-500/40"
          onClick={() => applyMove('down')}
        >
          ↓
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-600 py-2 text-slate-200 hover:border-cyan-500/40"
          onClick={() => applyMove('right')}
        >
          →
        </button>
      </div>
    </div>
  )
}
