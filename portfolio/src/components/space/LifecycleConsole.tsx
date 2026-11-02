import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { LIFECYCLE, type Actor } from '../../data/lifecycle'
import { pointAt, TRACK_D } from '../../data/lifecycleTrack'
import { useSpaceStore } from '../../store/spaceStore'
import './lifecycle.css'

const N = LIFECYCLE.length
/** Where each stage sits along the flight path (0 = launch pad, 1 = top of the climb). */
const POS = LIFECYCLE.map((_, i) => 0.02 + (i * 0.96) / (N - 1))
const NODES = POS.map((f) => pointAt(f))
const ORBIT = { cx: 210, cy: 64, rx: 180, ry: 30 }
const GATE_MS = 1100
const AUTOPILOT_MS = 7000
const PARTICLES = 16

const tcode = (i: number) => `T−${String(N - 1 - i).padStart(2, '0')}`
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el instanceof HTMLElement && el.isContentEditable)

function ActorIcon({ actor }: { actor: Actor }) {
  return actor === 'ai' ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="7" width="14" height="11" rx="3" />
      <path d="M12 3v4M9 12h.01M15 12h.01M9 15.5h6M2.5 11v3M21.5 11v3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.3-3.6 4.2-5.5 7.5-5.5s6.2 1.9 7.5 5.5" />
    </svg>
  )
}

/**
 * The homepage launch sequence: a rocket climbs a flight path one stage at a time while a mission
 * briefing explains the stage, how AI and I split the work, and the gate that must pass before the
 * next stage. Guided with Back / Proceed or ← →, any stage is clickable, and Autopilot advances on
 * its own. With reduced motion the rocket jumps, nothing animates and gates pass instantly.
 */
export function LifecycleConsole() {
  const [cur, setCur] = useState(0)
  const [passed, setPassed] = useState(-1)
  const [gatePass, setGatePass] = useState(false)
  const [auto, setAuto] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const rocketRef = useRef<SVGGElement>(null)
  const flownRef = useRef<SVGPathElement>(null)
  const particlesRef = useRef<SVGGElement>(null)
  const loopRef = useRef<HTMLDivElement>(null)
  const pulseRef = useRef<HTMLSpanElement>(null)
  const autobarRef = useRef<HTMLElement>(null)
  const altRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  // mirrors for the animation loop and key handler
  const live = useRef({ cur: 0, passed: -1, auto: false, hovering: false, autoStart: 0 })

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(N - 1, i))
    if (next === live.current.cur) return
    live.current.cur = next
    setGatePass(false)
    setCur(next)
  }, [])

  const proceed = () => {
    if (cur === N - 1) {
      live.current.cur = 0
      setPassed(-1)
      setGatePass(false)
      setCur(0)
    } else go(cur + 1)
  }

  useEffect(() => {
    live.current.cur = cur
    live.current.passed = passed
    live.current.auto = auto
  }, [cur, passed, auto])

  // gate check for the current stage
  useEffect(() => {
    if (gatePass) return
    const t = window.setTimeout(
      () => {
        setGatePass(true)
        setPassed((p) => Math.max(p, cur))
        live.current.autoStart = performance.now()
      },
      reducedMotion() ? 0 : GATE_MS,
    )
    return () => window.clearTimeout(t)
  }, [cur, gatePass])

  // keep the current chip visible on the mobile rail
  useEffect(() => {
    const rail = railRef.current
    if (!rail || window.innerWidth > 900) return
    const btn = rail.children[cur] as HTMLElement | undefined
    btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' })
  }, [cur])

  // ← → while the section is on screen
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target) || useSpaceStore.getState().consoleOpen) return
      const r = rootRef.current?.getBoundingClientRect()
      if (!r || r.bottom < 80 || r.top > window.innerHeight - 80) return
      const c = live.current.cur
      if (e.key === 'ArrowRight' && c < N - 1) {
        e.preventDefault()
        go(c + 1)
      } else if (e.key === 'ArrowLeft' && c > 0) {
        e.preventDefault()
        go(c - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // animation loop: rocket, trail, particles, collaboration pulse, autopilot
  useEffect(() => {
    const reduce = reducedMotion()
    let visual = POS[0]
    let orbitT = 0
    let last = performance.now()
    let raf = 0
    let onScreen = true
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen && !raf) raf = requestAnimationFrame(frame)
    })
    if (rootRef.current) io.observe(rootRef.current)

    function frame(t: number) {
      raf = 0
      const dt = Math.min(64, t - last)
      last = t
      const { cur: c, passed: p, auto: a, hovering, autoStart } = live.current
      const target = POS[c]
      visual += (target - visual) * (reduce ? 1 : Math.min(1, dt * 0.0045))

      let x: number
      let y: number
      let angle: number
      const base = pointAt(visual)
      if (c === N - 1 && Math.abs(target - visual) < 0.004 && !reduce) {
        orbitT += dt * 0.00035
        const th = -Math.PI / 2 + orbitT
        const blend = Math.min(1, orbitT * 2.2)
        x = base.x + (ORBIT.cx + ORBIT.rx * Math.cos(th) - base.x) * blend
        y = base.y + (ORBIT.cy + ORBIT.ry * Math.sin(th) - base.y) * blend
        angle = ((Math.atan2(ORBIT.ry * Math.cos(th), -ORBIT.rx * Math.sin(th)) * 180) / Math.PI + 90) * blend
      } else {
        orbitT = 0
        x = base.x
        y = base.y
        angle = base.angle
      }
      rocketRef.current?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(1.15)`)
      flownRef.current?.setAttribute('stroke-dashoffset', String(1 - visual))
      if (altRef.current) altRef.current.textContent = `${Math.round((visual / 0.98) * 408)} km`

      if (!reduce) {
        const dots = particlesRef.current?.children
        if (dots) {
          for (let i = 0; i < dots.length; i++) {
            const s = (t * 0.00008 + i / dots.length) % 1
            const q = pointAt(visual * s)
            dots[i].setAttribute('cx', q.x.toFixed(1))
            dots[i].setAttribute('cy', q.y.toFixed(1))
            dots[i].setAttribute('opacity', (visual > 0.03 ? 0.25 + 0.6 * s : 0).toFixed(2))
          }
        }
        const lp = (t * 0.00045) % 1
        const lit = Math.min(2, Math.floor(lp * 3))
        const steps = loopRef.current?.querySelectorAll<HTMLElement>('.lc-step')
        steps?.forEach((el, j) => el.classList.toggle('is-lit', j === lit))
        if (pulseRef.current) {
          pulseRef.current.style.left = `${8 + 84 * lp}%`
          pulseRef.current.dataset.actor = steps?.[lit]?.dataset.actor ?? 'ai'
        }
        if (a && p >= c && !hovering) {
          const e = (t - autoStart) / AUTOPILOT_MS
          if (autobarRef.current) autobarRef.current.style.width = `${Math.min(100, e * 100)}%`
          if (e >= 1) {
            if (c < N - 1) go(c + 1)
            else setAuto(false)
          }
        } else if (autobarRef.current) {
          autobarRef.current.style.width = a ? autobarRef.current.style.width : '0%'
        }
      }
      if (onScreen && (!reduce || Math.abs(target - visual) > 0.0001)) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [go])

  // reduced motion: redraw the rocket once per stage change
  useEffect(() => {
    if (!reducedMotion()) return
    const p = pointAt(POS[cur])
    rocketRef.current?.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.angle.toFixed(1)}) scale(1.15)`)
    flownRef.current?.setAttribute('stroke-dashoffset', String(1 - POS[cur]))
    if (altRef.current) altRef.current.textContent = `${Math.round((POS[cur] / 0.98) * 408)} km`
  }, [cur])

  const stage = LIFECYCLE[cur]
  const isDone = (j: number) => j < cur || (j <= passed && (j !== cur || gatePass))
  const onNodeKey = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      go(i)
    }
  }

  return (
    <div
      className="lc"
      ref={rootRef}
      onPointerEnter={() => (live.current.hovering = true)}
      onPointerLeave={() => (live.current.hovering = false)}
    >
      <div className="lc-flight">
        <svg viewBox="0 0 420 900" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Flight path">
          <defs>
            <radialGradient id="lc-earth" cx="50%" cy="0%" r="70%">
              <stop offset="0%" stopColor="#2b3a8f" />
              <stop offset="40%" stopColor="#16205a" />
              <stop offset="100%" stopColor="#0b0e26" />
            </radialGradient>
            <linearGradient id="lc-trail" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#8FC8FF" />
              <stop offset="100%" stopColor="#E8B04B" />
            </linearGradient>
          </defs>
          <ellipse cx="210" cy="1240" rx="520" ry="400" fill="url(#lc-earth)" stroke="#E8B04B" strokeOpacity=".7" strokeWidth="1.2" />
          <ellipse cx="210" cy="1240" rx="534" ry="414" fill="none" stroke="#E8B04B" strokeOpacity=".12" strokeWidth="12" />
          <g opacity=".85" aria-hidden>
            <rect x="196" y="842" width="28" height="4" rx="2" fill="#A3A6C4" />
            <path d="M200 846v12M220 846v12" stroke="#A3A6C4" strokeWidth="2" />
          </g>
          <ellipse cx={ORBIT.cx} cy={ORBIT.cy} rx={ORBIT.rx} ry={ORBIT.ry} fill="none" stroke="#6FD3B8" strokeOpacity=".5" strokeDasharray="3 6" />
          <path d={TRACK_D} fill="none" stroke="#2A2F5E" strokeWidth="2" strokeDasharray="4 7" />
          <path
            ref={flownRef}
            d={TRACK_D}
            pathLength={1}
            fill="none"
            stroke="url(#lc-trail)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset={1 - POS[0]}
          />
          <g ref={particlesRef} aria-hidden>
            {Array.from({ length: PARTICLES }, (_, i) => (
              <circle key={i} r={i % 4 === 0 ? 2.2 : 1.4} fill={i % 3 === 0 ? '#E8B04B' : '#8FC8FF'} opacity="0" />
            ))}
          </g>
          {NODES.map((n, i) => {
            const right = n.x < 210
            const tx = right ? 18 : -18
            const anchor = right ? 'start' : 'end'
            return (
              <g
                key={LIFECYCLE[i].name}
                className={`lc-node${i === cur ? ' is-current' : ''}${isDone(i) ? ' is-done' : ''}`}
                transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`}
                tabIndex={0}
                role="button"
                aria-label={`${tcode(i)} ${LIFECYCLE[i].name}`}
                aria-current={i === cur ? 'step' : undefined}
                onClick={() => go(i)}
                onKeyDown={onNodeKey(i)}
              >
                <circle className="lc-hit" r="22" />
                <circle className="lc-halo" r="9" />
                <circle className="lc-dot" r="8" />
                <path className="lc-tick" d="M-3.5 0 -1 2.6 3.8 -2.6" />
                <text x={tx} y="-4" textAnchor={anchor}>
                  {tcode(i)}
                </text>
                <text className="lc-name" x={tx} y="15" textAnchor={anchor}>
                  {LIFECYCLE[i].name}
                </text>
              </g>
            )
          })}
          <g ref={rocketRef} aria-hidden>
            <path className="lc-flame" d="M-5 16 Q0 34 5 16 Z" fill="#E2553A" />
            <path className="lc-flame" d="M-2.5 16 Q0 26 2.5 16 Z" fill="#FFE3A3" />
            <path d="M0 -20 C7 -13 9 -3 9 8 V16 H-9 V8 C-9 -3 -7 -13 0 -20Z" fill="#EDEAE0" stroke="#070814" strokeWidth="1.6" />
            <circle cy="-3" r="3.6" fill="#8FC8FF" stroke="#070814" strokeWidth="1.4" />
            <path d="M-9 6 -15 15V19L-9 15M9 6 15 15V19L9 15" fill="#E2553A" stroke="#070814" strokeWidth="1.4" strokeLinejoin="round" />
          </g>
        </svg>
        <p className="lc-alt">
          Altitude <b ref={altRef}>0 km</b>
        </p>

        <div className="lc-rail" ref={railRef} role="tablist" aria-label="Stages">
          {LIFECYCLE.map((s, i) => (
            <button
              key={s.name}
              type="button"
              role="tab"
              aria-selected={i === cur}
              className={isDone(i) && i !== cur ? 'is-done' : undefined}
              onClick={() => go(i)}
            >
              <span>{tcode(i)}</span>
              <b>{s.name}</b>
            </button>
          ))}
        </div>
        <div className="lc-railbar" aria-hidden>
          <i style={{ width: `${(cur / (N - 1)) * 100}%` }} />
        </div>
      </div>

      <article className="lc-brief" aria-live="polite">
        <div className="lc-head">
          <span className="lc-mono lc-tcode">{tcode(cur)}</span>
          <div className="lc-gates" aria-hidden>
            {LIFECYCLE.map((s, j) => (
              <i key={s.name} className={j === cur ? (gatePass ? 'on' : 'now') : j <= passed ? 'on' : ''} />
            ))}
          </div>
          <span className="lc-mono lc-count">
            Stage {cur + 1} of {N}
          </span>
        </div>

        <div key={cur} className="lc-enter">
          <h3 className="lc-title">{stage.name}</h3>
          <p className="lc-what">{stage.what}</p>

          <div className="lc-loop" ref={loopRef} aria-label="How AI and I work together at this stage">
            <span className="lc-lane" aria-hidden />
            <span className="lc-pulse" ref={pulseRef} aria-hidden />
            {stage.loop.map(([actor, text], j) => (
              <div key={j} className={`lc-step lc-${actor}`} data-actor={actor}>
                <span className="lc-chip">
                  <ActorIcon actor={actor} />
                </span>
                <small>{actor === 'ai' ? 'AI co-pilot' : 'Me'}</small>
                <p>{text}</p>
              </div>
            ))}
          </div>

          <div className="lc-cols">
            <section className="lc-col lc-ai">
              <h4>AI co-pilot</h4>
              <ul>
                {stage.ai.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
            <section className="lc-col lc-me">
              <h4>Where my experience decides</h4>
              <ul>
                {stage.me.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className={`lc-gate${gatePass ? ' is-pass' : ''}${gatePass && cur === N - 1 ? ' is-final' : ''}`}>
          <span className="lc-box">
            <span className="lc-spin" />
            <svg viewBox="0 0 16 16" fill="none" stroke="#070814" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 8.5 6.5 12 13 4.5" />
            </svg>
          </span>
          <span className="lc-gtxt">
            <span className="lc-mono">
              {cur === N - 1 && gatePass ? 'Mission status' : gatePass ? 'Gate check · passed' : 'Gate check · running'}
            </span>
            <b>{stage.gate}</b>
          </span>
        </div>

        <div className="lc-controls">
          <button type="button" className="lc-btn" onClick={() => go(cur - 1)} disabled={cur === 0}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M9 2 4 7l5 5" />
            </svg>
            Back
          </button>
          <button type="button" className={`lc-btn lc-primary${gatePass ? ' is-ready' : ''}`} onClick={proceed}>
            {cur === N - 1 ? 'Replay launch' : `Proceed to ${tcode(cur + 1)}`}
          </button>
          <div className="lc-auto">
            <span className="lc-mono">Autopilot</span>
            <span className="lc-bar" aria-hidden>
              <i ref={autobarRef} />
            </span>
            <button
              type="button"
              className="lc-btn lc-small"
              aria-pressed={auto}
              onClick={() => {
                live.current.autoStart = performance.now()
                setAuto((a) => !a)
              }}
            >
              {auto ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
