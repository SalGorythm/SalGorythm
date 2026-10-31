import { useEffect, useState } from 'react'
import { PORTFOLIO_APPS } from '../../data/myApps'
import { IssTile } from './IssTile'

/** Career start — the mission clock counts from here. */
const LAUNCH = new Date('2016-01-04T09:00:00+05:30').getTime()

const PLANETS: { label: string; color: string; ring: 40 | 64 | 88; size?: number; ringed?: boolean }[] = [
  { label: 'AI & agents', color: '#E2553A', ring: 40, size: 20 },
  { label: 'Backend', color: '#8FC8FF', ring: 40 },
  { label: 'Data', color: '#E8B04B', ring: 64, size: 16 },
  { label: 'Frontend', color: '#6FD3B8', ring: 64 },
  { label: 'Mobile', color: '#C9A8FF', ring: 64, size: 15 },
  { label: 'Design', color: '#EDEAE0', ring: 88, size: 14 },
  { label: 'DevOps', color: '#E2553A', ring: 88, size: 22, ringed: true },
  { label: 'Growth', color: '#8FC8FF', ring: 88, size: 16 },
]
const PERIOD: Record<number, number> = { 40: 38, 64: 64, 88: 96 }

function formatMet(ms: number) {
  let s = Math.max(0, Math.floor(ms / 1000))
  const y = Math.floor(s / 31557600)
  s -= y * 31557600
  const d = Math.floor(s / 86400)
  s -= d * 86400
  const hh = Math.floor(s / 3600)
  s -= hh * 3600
  const mm = Math.floor(s / 60)
  s -= mm * 60
  const p = (n: number) => String(n).padStart(2, '0')
  return `T+ ${y}Y ${d}D ${p(hh)}:${p(mm)}:${p(s)}`
}

function MissionClock() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <b className="sp-met" aria-label="Mission elapsed time since January 2016">
      {formatMet(now - LAUNCH)}
    </b>
  )
}

function StarSystem() {
  const perRing: Record<number, number> = {}
  const labels = PLANETS.map((p) => p.label).join(', ')
  return (
    <div className="sp-system" role="img" aria-label={`A star system with Salman at the centre and his skills in orbit: ${labels}.`}>
      <div className="sp-ring" style={{ ['--d' as string]: 40 }} aria-hidden />
      <div className="sp-ring" style={{ ['--d' as string]: 64 }} aria-hidden />
      <div className="sp-ring sp-ring--solid" style={{ ['--d' as string]: 88 }} aria-hidden />
      <div className="sp-sun" aria-hidden>
        <span>SA</span>
      </div>
      {PLANETS.map((p) => {
        const onRing = PLANETS.filter((q) => q.ring === p.ring).length
        const idx = (perRing[p.ring] = (perRing[p.ring] ?? -1) + 1)
        const period = PERIOD[p.ring]
        const offset = -((idx / onRing) * period + p.ring / 10)
        return (
          <div
            key={p.label}
            className="sp-orbit"
            aria-hidden
            style={{ ['--d' as string]: p.ring, ['--t' as string]: `${period}s`, ['--o' as string]: `${offset}s` }}
          >
            <div className="sp-planet" style={{ ['--p' as string]: p.color, ['--s' as string]: `${p.size ?? 18}px` }}>
              <div className="sp-spin">
                <i className={p.ringed ? 'sp-ringed' : undefined} />
                <small>{p.label}</small>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function SpaceHero() {
  return (
    <>
      <header id="hero" className="sp-hero">
        <div className="sp-wrap">
          <div className="sp-hero-grid">
            <div className="sp-hero-copy">
              <p className="sp-mono">Senior Data Scientist · Forward Deployed Engineer</p>
              <h1>
                I don&#8217;t just build. I <em>launch.</em>
              </h1>
              <p className="sp-lede">
                Hand me a problem on the ground and I get it to orbit.{' '}
                <b>
                  Design, planning, backend, frontend, data, DevOps, AI agents, mobile apps, SEO and the store
                  listing
                </b>
                , with one person flying the whole mission.
              </p>
              <div className="sp-actions">
                <a className="sp-btn" href="#contact">
                  Open a channel
                </a>
                <a className="sp-btn sp-btn--line" href="#missions">
                  Read the mission log
                </a>
              </div>
            </div>
            <StarSystem />
          </div>
        </div>
        <div className="sp-horizon" aria-hidden />
      </header>

      <div className="sp-wrap">
        <div className="sp-telemetry" aria-label="Mission telemetry">
          <div className="sp-tm">
            <span className="sp-mono">Mission elapsed time</span>
            <MissionClock />
            <small>since my first production job, Jan 2016</small>
          </div>
          <div className="sp-tm">
            <span className="sp-mono">Probes launched</span>
            <b>{PORTFOLIO_APPS.length} apps</b>
            <small>built as Weekend Hobbies</small>
          </div>
          <div className="sp-tm">
            <span className="sp-mono">Honours</span>
            <b>IBM Tech 2026</b>
            <small>global awardee</small>
          </div>
          <IssTile />
        </div>
      </div>
    </>
  )
}
