import { useEffect, useRef, useState } from 'react'

const STOPS: { id: string; label: string; color: string }[] = [
  { id: 'hero', label: 'Launch pad', color: '#E8B04B' },
  { id: 'sequence', label: 'Launch sequence', color: '#8FC8FF' },
  { id: 'missions', label: 'Mission log', color: '#E2553A' },
  { id: 'payload', label: 'Payload bay', color: '#6FD3B8' },
  { id: 'transmissions', label: 'Transmissions', color: '#C9A8FF' },
  { id: 'ground', label: 'Ground control', color: '#EDEAE0' },
  { id: 'crew', label: 'Crew record', color: '#8FC8FF' },
  { id: 'contact', label: 'Event horizon', color: '#E8B04B' },
]

/**
 * A probe that travels down a dotted trajectory in the left margin as the visitor scrolls,
 * passing a small planet for each section. Planets are buttons that jump to their section.
 * Only shown on wide screens, where the margin has room.
 */
export function Trajectory() {
  const [marks, setMarks] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const measure = () => {
      raf.current = 0
      const doc = document.documentElement.scrollHeight - window.innerHeight
      if (doc <= 0) return
      setProgress(Math.min(1, Math.max(0, window.scrollY / doc)))
      setMarks(
        STOPS.map((s) => {
          const el = document.getElementById(s.id)
          if (!el) return -1
          const top = el.getBoundingClientRect().top + window.scrollY - 80
          return Math.min(1, Math.max(0, top / doc))
        }),
      )
    }
    const schedule = () => {
      if (!raf.current) raf.current = requestAnimationFrame(measure)
    }
    measure()
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf.current)
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sp-trajectory" aria-label="Section trajectory">
      <div className="sp-trajectory__track" aria-hidden />
      <div className="sp-trajectory__flown" style={{ height: `${progress * 100}%` }} aria-hidden />
      {STOPS.map((s, i) =>
        marks[i] >= 0 ? (
          <button
            key={s.id}
            type="button"
            className="sp-trajectory__stop"
            style={{ top: `${(marks[i] ?? 0) * 100}%`, ['--c' as string]: s.color }}
            onClick={() => jump(s.id)}
            aria-label={`Jump to ${s.label}`}
          >
            <span className="sp-trajectory__label">{s.label}</span>
          </button>
        ) : null,
      )}
      <svg className="sp-trajectory__probe" style={{ top: `${progress * 100}%` }} viewBox="0 0 20 28" aria-hidden>
        <path d="M10 26 3 9a7 7 0 1 1 14 0Z" fill="#EDEAE0" stroke="#070814" strokeWidth="1.5" />
        <circle cx="10" cy="8" r="2.6" fill="#8FC8FF" />
        <path d="M7 1.5 10 -4 13 1.5" fill="#E2553A" />
      </svg>
    </nav>
  )
}
