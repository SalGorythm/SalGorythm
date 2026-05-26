import { useCallback, useEffect, useRef, useState } from 'react'

const COLORS = [
  { id: 0, name: 'Cyan', className: 'bg-cyan-500/80 shadow-[0_0_24px_rgba(34,211,238,0.6)]' },
  { id: 1, name: 'Purple', className: 'bg-purple-500/80 shadow-[0_0_24px_rgba(168,85,247,0.6)]' },
  { id: 2, name: 'Emerald', className: 'bg-emerald-500/80 shadow-[0_0_24px_rgba(52,211,153,0.55)]' },
  { id: 3, name: 'Amber', className: 'bg-amber-500/80 shadow-[0_0_24px_rgba(251,191,36,0.55)]' },
] as const

type Phase = 'idle' | 'playback' | 'input' | 'gameover'

export function NeonSimon() {
  const [seq, setSeq] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [inputIdx, setInputIdx] = useState(0)
  const [highlight, setHighlight] = useState<number | null>(null)
  const [round, setRound] = useState(0)
  const [message, setMessage] = useState('Press Start to calibrate pattern buffer.')
  const playbackRef = useRef<number | null>(null)

  const clearPlayback = () => {
    if (playbackRef.current) window.clearTimeout(playbackRef.current)
    playbackRef.current = null
  }

  const playSequence = useCallback((full: number[]) => {
    clearPlayback()
    setPhase('playback')
    setHighlight(null)
    let i = 0
    const step = () => {
      if (i >= full.length) {
        setPhase('input')
        setInputIdx(0)
        setMessage('Repeat the sequence.')
        return
      }
      const c = full[i]!
      setHighlight(c)
      playbackRef.current = window.setTimeout(() => {
        setHighlight(null)
        playbackRef.current = window.setTimeout(() => {
          i += 1
          step()
        }, 120)
      }, 420)
    }
    step()
  }, [])

  useEffect(() => () => clearPlayback(), [])

  const start = () => {
    clearPlayback()
    const first = Math.floor(Math.random() * 4)
    const next = [first]
    setSeq(next)
    setRound(1)
    setMessage('Watch closely…')
    playSequence(next)
  }

  const onPadPress = (id: number) => {
    if (phase !== 'input') return
    const expected = seq[inputIdx]
    if (id !== expected) {
      setPhase('gameover')
      setMessage(`Signal mismatch at index ${inputIdx + 1}. Reset to retry.`)
      return
    }
    const nextIdx = inputIdx + 1
    if (nextIdx >= seq.length) {
      setMessage('Pattern locked. Advancing difficulty…')
      setPhase('playback')
      window.setTimeout(() => {
        setSeq((prev) => {
          const n = Math.floor(Math.random() * 4)
          const extended = [...prev, n]
          window.setTimeout(() => {
            setRound(extended.length)
            setMessage(`Round ${extended.length}.`)
            playSequence(extended)
          }, 0)
          return extended
        })
      }, 450)
      return
    }
    setInputIdx(nextIdx)
  }

  const reset = () => {
    clearPlayback()
    setSeq([])
    setPhase('idle')
    setInputIdx(0)
    setHighlight(null)
    setRound(0)
    setMessage('Press Start to calibrate pattern buffer.')
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Memory rhythm game: watch the neon pulse sequence, then tap the pads in the same order.
        Each success adds one more step.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-400">
        <span>Round: {round || '—'}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={start}
            disabled={phase === 'playback'}
            className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 text-cyan-100 transition hover:bg-cyan-500/25 disabled:opacity-40"
          >
            Start
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-200 hover:border-purple-500/40"
          >
            Reset
          </button>
        </div>
      </div>
      <p className="rounded-lg border border-slate-800/90 bg-slate-900/50 px-3 py-2 font-mono text-sm text-slate-300">
        {message}
      </p>
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-4 p-2">
        {COLORS.map((c) => {
          const lit = highlight === c.id
          return (
            <button
              key={c.id}
              type="button"
              aria-label={c.name}
              onClick={() => onPadPress(c.id)}
              className={`aspect-square rounded-2xl border-2 border-slate-700/80 transition ${
                lit ? `${c.className} scale-105 border-white/40` : 'bg-slate-900/70 hover:border-cyan-500/30'
              } ${phase === 'gameover' ? 'opacity-50' : ''}`}
            />
          )
        })}
      </div>
      <p className="text-center font-mono text-[10px] uppercase tracking-widest text-slate-600">
        Phase: {phase}
      </p>
    </div>
  )
}
