import { useEffect, useMemo, useState } from 'react'

type Player = 'X' | 'O' | null
type Board = Player[]

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function winnerOf(b: Board): Player | 'draw' | null {
  for (const [a, c, d] of WIN_LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]!
  }
  if (b.every((x) => x !== null)) return 'draw'
  return null
}

function emptyCells(b: Board) {
  return b.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0)
}

function nextPlayer(b: Board): 'X' | 'O' {
  const xs = b.filter((x) => x === 'X').length
  const os = b.filter((x) => x === 'O').length
  return xs === os ? 'X' : 'O'
}

function minimax(b: Board, ai: 'X' | 'O', human: 'X' | 'O'): number {
  const w = winnerOf(b)
  if (w === ai) return 1
  if (w === human) return -1
  if (w === 'draw') return 0
  const p = nextPlayer(b)
  const moves = emptyCells(b)
  const isMax = p === ai
  if (isMax) {
    let v = -Infinity
    for (const i of moves) {
      const nb = [...b] as Board
      nb[i] = p
      v = Math.max(v, minimax(nb, ai, human))
    }
    return v
  }
  let v = Infinity
  for (const i of moves) {
    const nb = [...b] as Board
    nb[i] = p
    v = Math.min(v, minimax(nb, ai, human))
  }
  return v
}

function bestMove(b: Board, ai: 'X' | 'O', human: 'X' | 'O'): number {
  let best = -Infinity
  let choice = -1
  for (const i of emptyCells(b)) {
    const nb = [...b] as Board
    nb[i] = ai
    const score = minimax(nb, ai, human)
    if (score > best) {
      best = score
      choice = i
    }
  }
  return choice
}

const initialBoard = (): Board => Array.from({ length: 9 }, () => null)

export function CyberTicTacToe() {
  const [board, setBoard] = useState<Board>(initialBoard)
  const [human, setHuman] = useState<'X' | 'O'>('X')
  const [vsAi, setVsAi] = useState(true)

  const ai = useMemo(() => (human === 'X' ? 'O' : 'X'), [human])
  const turn = useMemo(() => nextPlayer(board), [board])
  const result = winnerOf(board)

  const play = (idx: number) => {
    if (board[idx] || result) return
    if (vsAi && turn !== human) return
    const nb = [...board] as Board
    nb[idx] = turn
    setBoard(nb)
  }

  useEffect(() => {
    if (!vsAi || result) return
    if (turn === human) return
    const id = window.setTimeout(() => {
      setBoard((b) => {
        if (winnerOf(b)) return b
        const idx = bestMove(b, ai, human)
        if (idx < 0) return b
        const nb = [...b] as Board
        nb[idx] = ai
        return nb
      })
    }, 80)
    return () => window.clearTimeout(id)
  }, [board, vsAi, turn, human, ai, result])

  const reset = () => setBoard(initialBoard())

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Neon tic-tac-toe. Versus AI uses minimax (perfect play). If you play as O, the AI opens
        as X.
      </p>
      <div className="flex flex-wrap gap-3 font-mono text-xs">
        <label className="flex items-center gap-2 text-slate-300">
          <input type="checkbox" checked={vsAi} onChange={(e) => setVsAi(e.target.checked)} />
          vs AI (minimax)
        </label>
        <label className="flex items-center gap-2 text-slate-300">
          Play as
          <select
            value={human}
            onChange={(e) => {
              setHuman(e.target.value as 'X' | 'O')
              setBoard(initialBoard())
            }}
            className="rounded border border-slate-600 bg-slate-950 px-2 py-1 text-slate-200"
          >
            <option value="X">X</option>
            <option value="O">O</option>
          </select>
        </label>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-600 px-2 py-1 text-slate-200 hover:border-cyan-500/40"
        >
          Reset board
        </button>
      </div>
      {result && (
        <p className="font-mono text-sm text-cyan-200">
          {result === 'draw' ? 'Draw.' : `Winner: ${result}`}
        </p>
      )}
      <div className="mx-auto grid w-max grid-cols-3 gap-3">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => play(i)}
            className={`flex h-20 w-20 items-center justify-center rounded-xl border text-3xl font-bold transition ${
              cell === 'X'
                ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.25)]'
                : cell === 'O'
                  ? 'border-purple-400/60 bg-purple-500/15 text-purple-200 shadow-[0_0_24px_rgba(192,132,252,0.25)]'
                  : 'border-slate-700/80 bg-slate-900/50 text-slate-600 hover:border-cyan-500/30'
            }`}
          >
            {cell ?? '＋'}
          </button>
        ))}
      </div>
      <p className="text-center font-mono text-[11px] text-slate-500">
        Turn: {result ? '—' : turn}
        {vsAi ? ` · You are ${human}` : ''}
      </p>
    </div>
  )
}
