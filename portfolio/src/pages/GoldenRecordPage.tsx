import { Link } from 'react-router-dom'
import { GOLDEN_RECORD_PRINCIPLES } from '../data/goldenRecord'
import { usePageMeta } from '../hooks/usePageMeta'

/** Pulsar-map style etching: lines radiating from a centre with binary-ish tick marks. */
function PulsarMap() {
  const rays = [
    { a: -10, l: 92 }, { a: 18, l: 70 }, { a: 47, l: 84 }, { a: 80, l: 58 }, { a: 112, l: 96 }, { a: 140, l: 66 },
    { a: 171, l: 88 }, { a: 199, l: 74 }, { a: 228, l: 90 }, { a: 258, l: 62 }, { a: 290, l: 80 }, { a: 322, l: 94 }, { a: 345, l: 68 }, { a: 63, l: 44 },
  ]
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full" aria-hidden>
      {rays.map((r, i) => {
        const rad = (r.a * Math.PI) / 180
        const x = Math.cos(rad) * r.l
        const y = Math.sin(rad) * r.l
        return (
          <g key={i} stroke="#5a3d07" strokeWidth="0.7">
            <line x1="0" y1="0" x2={x} y2={y} />
            {Array.from({ length: 4 }, (_, k) => {
              const t = 0.45 + k * 0.12
              const px = x * t
              const py = y * t
              const nx = -Math.sin(rad) * (k % 2 ? 3 : 1.6)
              const ny = Math.cos(rad) * (k % 2 ? 3 : 1.6)
              return <line key={k} x1={px - nx} y1={py - ny} x2={px + nx} y2={py + ny} />
            })}
          </g>
        )
      })}
      <circle r="3" fill="#5a3d07" />
    </svg>
  )
}

export function GoldenRecordPage() {
  usePageMeta('The Golden Record', 'A hidden page: the principles I build by, etched for the next civilisation.')

  return (
    <main className="relative pb-24 pt-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-space-gold">Classified · you found it</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl">
          The Golden Record
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          In 1977 the Voyager probes left the solar system carrying a golden record: sounds and images chosen to
          explain who we are. This one is smaller. It carries how I build.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-12">
          <div
            className="relative aspect-square w-full max-w-[380px] shrink-0 rounded-full"
            style={{
              background:
                'repeating-radial-gradient(circle at 50% 50%, #e8b04b 0 2px, #d9a03a 2px 3px), radial-gradient(circle at 35% 30%, #ffe7a8, #c38a22 70%)',
              backgroundBlendMode: 'multiply',
              boxShadow: '0 0 0 6px #6e4d14, 0 0 80px rgb(232 176 75 / 0.35), inset 0 0 40px rgb(0 0 0 / 0.35)',
            }}
          >
            <div className="absolute inset-[14%]">
              <PulsarMap />
            </div>
            <div className="absolute left-1/2 top-1/2 h-[16%] w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#5a3d07] bg-[#e8b04b]">
              <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-space-void" />
            </div>
          </div>

          <ol className="min-w-[280px] flex-1 space-y-5">
            {GOLDEN_RECORD_PRINCIPLES.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[44px_1fr] gap-3">
                <span className="font-mono text-sm text-space-gold">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">{p.title}</h2>
                  <p className="mt-1 text-[15.5px] text-slate-300">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-14 font-mono text-xs uppercase tracking-[0.14em] text-slate-400">
          Return to <Link to="/" className="text-space-gold underline underline-offset-4">mission control</Link> · or
          press <kbd className="rounded border border-space-line px-1.5 py-0.5 text-space-gold">/</kbd> and try{' '}
          <span className="text-space-gold">sudo</span>
        </p>
      </div>
    </main>
  )
}
