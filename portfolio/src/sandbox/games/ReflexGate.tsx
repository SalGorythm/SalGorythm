import { useRef, useState } from 'react'

type Phase = 'idle' | 'armed' | 'ready' | 'result'

export function ReflexGate() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [ms, setMs] = useState<number | null>(null)
  const [penalty, setPenalty] = useState<string | null>(null)
  const startRef = useRef<number>(0)
  const timeoutRef = useRef<number | null>(null)

  const clearT = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const arm = () => {
    clearT()
    setPenalty(null)
    setMs(null)
    setPhase('armed')
    const delay = 800 + Math.random() * 2800
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now()
      setPhase('ready')
    }, delay)
  }

  const tap = () => {
    if (phase === 'idle') return
    if (phase === 'armed') {
      clearT()
      setPhase('result')
      setPenalty('Early trigger — wait for the gate to open.')
      setMs(null)
      return
    }
    if (phase === 'ready') {
      const elapsed = Math.round(performance.now() - startRef.current)
      setMs(elapsed)
      setPhase('result')
      setPenalty(null)
      return
    }
  }

  const reset = () => {
    clearT()
    setPhase('idle')
    setMs(null)
    setPenalty(null)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Latency lab: arm the gate, wait for the cyan pulse, then tap as fast as you can. Early
        clicks count as faults.
      </p>
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={arm}
          disabled={phase === 'armed'}
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-2 text-cyan-100 transition hover:bg-cyan-500/25 disabled:opacity-40"
        >
          Arm gate
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-slate-600 px-3 py-2 text-slate-200 hover:border-purple-500/40"
        >
          Reset
        </button>
      </div>
      <button
        type="button"
        onClick={tap}
        className={`relative w-full overflow-hidden rounded-2xl border-2 px-6 py-16 font-mono text-lg font-semibold uppercase tracking-[0.3em] transition ${
          phase === 'ready'
            ? 'border-cyan-400 bg-cyan-500/25 text-cyan-50 shadow-[0_0_40px_rgba(34,211,238,0.35)]'
            : phase === 'armed'
              ? 'border-slate-600 bg-slate-900/80 text-slate-500'
              : 'border-slate-700 bg-slate-950/80 text-slate-400'
        }`}
      >
        {phase === 'idle' && 'Stand by'}
        {phase === 'armed' && 'Wait…'}
        {phase === 'ready' && 'Tap now'}
        {phase === 'result' && (ms !== null ? `${ms} ms` : 'Fault')}
      </button>
      {penalty && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          {penalty}
        </p>
      )}
      {phase === 'result' && ms !== null && (
        <p className="font-mono text-sm text-slate-400">
          Sub-200ms is elite hand–eye; displays vary with input latency.
        </p>
      )}
    </div>
  )
}
