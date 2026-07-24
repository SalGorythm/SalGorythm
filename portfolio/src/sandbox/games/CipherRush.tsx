import { useMemo, useState } from 'react'

const WORDS = [
  'VECTOR',
  'PYTHON',
  'COGNITO',
  'PIPELINE',
  'GRANITE',
  'WATSONX',
  'ENCRYPT',
  'LATENCY',
]

function caesar(text: string, shift: number) {
  const s = ((shift % 26) + 26) % 26
  return text
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0) - 65
      if (code < 0 || code > 25) return ch
      return String.fromCharCode(65 + ((code + s) % 26))
    })
    .join('')
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function buildChoices(plain: string): string[] {
  const wrong: string[] = []
  while (wrong.length < 3) {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)]!
    if (w !== plain && !wrong.includes(w)) wrong.push(w)
  }
  return shuffle([plain, ...wrong])
}

export function CipherRush() {
  const [plain, setPlain] = useState(WORDS[0]!)
  const [shift, setShift] = useState(3)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [choices, setChoices] = useState<string[]>(() => buildChoices(WORDS[0]!))

  const cipher = useMemo(() => caesar(plain, shift), [plain, shift])

  const pick = (word: string) => {
    if (word === plain) {
      setScore((s) => s + 1)
      setFeedback('Checksum OK.')
      const next = WORDS[(WORDS.indexOf(plain) + 1) % WORDS.length]!
      setPlain(next)
      setChoices(buildChoices(next))
      queueMicrotask(() => {
        setShift(1 + Math.floor(Math.random() * 22))
      })
    } else {
      setFeedback('Hash mismatch — try another plaintext.')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        ROT-K Caesar on A–Z only. Decode the ciphertext — four candidate plaintexts, one correct
        per round.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-400">
        <span>Score: {score}</span>
        <span>K = {shift}</span>
      </div>
      <div className="rounded-xl border border-purple-500/30 bg-slate-950/70 p-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Ciphertext</p>
        <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.2em] text-purple-200">
          {cipher}
        </p>
      </div>
      {feedback && <p className="font-mono text-sm text-cyan-300/90">{feedback}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {choices.map((w) => (
          <button
            key={`${plain}-${w}`}
            type="button"
            onClick={() => pick(w)}
            className="rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-3 font-mono text-sm text-slate-100 transition hover:border-cyan-500/40 hover:text-cyan-100"
          >
            {w}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setScore(0)
          setPlain(WORDS[0]!)
          setShift(3)
          setFeedback(null)
          setChoices(buildChoices(WORDS[0]!))
        }}
        className="text-xs font-mono text-slate-500 underline hover:text-slate-300"
      >
        Reset score
      </button>
    </div>
  )
}
