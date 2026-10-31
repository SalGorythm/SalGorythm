import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSpaceStore } from '../../store/spaceStore'

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el instanceof HTMLElement && el.isContentEditable)

function Saucer() {
  return (
    <svg viewBox="0 0 90 44" width="90" height="44" aria-hidden>
      <ellipse cx="45" cy="18" rx="15" ry="13" fill="rgba(143,200,255,0.35)" stroke="#8FC8FF" strokeWidth="1.5" />
      <circle cx="45" cy="17" r="5" fill="#6FD3B8" />
      <circle cx="43.5" cy="15.5" r="1.3" fill="#070814" />
      <circle cx="46.5" cy="15.5" r="1.3" fill="#070814" />
      <ellipse cx="45" cy="27" rx="40" ry="9" fill="#A3A6C4" stroke="#EDEAE0" strokeWidth="1.5" />
      <circle cx="22" cy="28" r="2" fill="#E8B04B" />
      <circle cx="45" cy="31" r="2" fill="#E8B04B" />
      <circle cx="68" cy="28" r="2" fill="#E8B04B" />
      <path d="M30 36l-6 7M60 36l6 7" stroke="rgba(143,200,255,0.5)" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * Hidden fun:
 * - type "warp" anywhere (outside form fields) to jump to hyperspace
 * - type "golden record" to find the Golden Record page
 * - a tiny saucer crosses the screen very rarely (max 2 per visit, never with reduced motion)
 */
export function EasterEggs() {
  const navigate = useNavigate()
  const buffer = useRef('')
  const [ufo, setUfo] = useState<{ key: number; top: number; reverse: boolean } | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target) || useSpaceStore.getState().consoleOpen) return
      if (e.key.length !== 1) return
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-20)
      if (buffer.current.endsWith('warp')) {
        buffer.current = ''
        useSpaceStore.getState().warp()
      } else if (buffer.current.replace(/\s/g, '').endsWith('goldenrecord')) {
        buffer.current = ''
        navigate('/golden-record')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let flights = 0
    let timer = 0
    const schedule = (ms: number) => {
      timer = window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          flights += 1
          setUfo({ key: Date.now(), top: 12 + Math.random() * 30, reverse: Math.random() < 0.5 })
        }
        if (flights < 2) schedule(180_000 + Math.random() * 120_000)
      }, ms)
    }
    schedule(75_000 + Math.random() * 60_000)
    return () => window.clearTimeout(timer)
  }, [])

  if (!ufo) return null
  return (
    <div
      key={ufo.key}
      aria-hidden
      className={`sp-ufo pointer-events-none fixed left-0 z-[6] ${ufo.reverse ? 'sp-ufo--rev' : ''}`}
      style={{ top: `${ufo.top}vh` }}
      onAnimationEnd={() => setUfo(null)}
    >
      <Saucer />
    </div>
  )
}
