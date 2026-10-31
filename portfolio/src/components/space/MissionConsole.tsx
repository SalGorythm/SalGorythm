import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { RECRUITER_SUMMARY } from '../../data/recruiterSummary'
import { fetchIss } from '../../lib/iss'
import { altAz, localSiderealDeg, OBSERVER, type SkyData } from '../../lib/sky'
import { startHum, stopHum } from '../../lib/spaceSound'
import { useSpaceStore } from '../../store/spaceStore'

type Line = { kind: 'in' | 'out' | 'err'; text: string }

const ROUTES: Record<string, string> = {
  home: '/',
  writing: '/writing',
  hobbies: '/apps',
  apps: '/apps',
  sandbox: '/sandbox',
  tools: '/tools',
  support: '/support',
}
const SECTIONS: Record<string, string> = {
  missions: 'missions',
  sequence: 'sequence',
  payload: 'payload',
  transmissions: 'transmissions',
  services: 'ground',
  crew: 'crew',
}

const HELP = [
  'launch <home|writing|hobbies|sandbox|tools|support>   go to a page',
  'scan <missions|payload|transmissions|services|crew>   jump to a section',
  'hail                     open a channel (contact)',
  'email                    copy my email address',
  'sky                      constellations above New Delhi right now',
  'iss                      where the International Space Station is',
  'warp                     engage',
  'sound <on|off>           ambient hum',
  'whoami                   crew file',
  'clear · exit',
]

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el instanceof HTMLElement && el.isContentEditable)

/** Drop-down command line. Opens with `/` or `~` (or the Console button), closes with Esc. */
export function MissionConsole() {
  const open = useSpaceStore((s) => s.consoleOpen)
  const setOpen = useSpaceStore((s) => s.setConsoleOpen)
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: 'MISSION CONSOLE · type help for commands' },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const print = useCallback((...out: Line[]) => setLines((l) => [...l, ...out].slice(-80)), [])

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (!open && (e.key === '/' || e.key === '~' || e.key === '`') && !isTyping(e.target)) {
        e.preventDefault()
        returnFocus.current = document.activeElement as HTMLElement | null
        setOpen(true)
      } else if (open && e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  useEffect(() => {
    if (open) {
      if (!returnFocus.current) returnFocus.current = document.activeElement as HTMLElement | null
      window.setTimeout(() => inputRef.current?.focus(), 30)
    } else {
      returnFocus.current?.focus?.()
      returnFocus.current = null
    }
  }, [open])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [lines])

  const run = async (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    print({ kind: 'in', text: raw.trim() })
    const [verb, ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ')
    const go = (path: string) => {
      setOpen(false)
      navigate(path)
    }

    switch (verb) {
      case 'help':
      case '?':
        print(...HELP.map((text) => ({ kind: 'out' as const, text })))
        print({ kind: 'out', text: 'Some commands are classified. Keep typing.' })
        return
      case 'launch':
      case 'cd':
      case 'open':
        if (ROUTES[arg]) return go(ROUTES[arg])
        return print({ kind: 'err', text: `No such destination: ${arg || '(none)'}. Try launch writing.` })
      case 'scan':
        if (SECTIONS[arg]) return go(`/#${SECTIONS[arg]}`)
        return print({ kind: 'err', text: 'Scan what? missions, payload, transmissions, services or crew.' })
      case 'hail':
      case 'contact':
        return go('/#contact')
      case 'email':
        try {
          await navigator.clipboard.writeText(RECRUITER_SUMMARY.email)
          return print({ kind: 'out', text: `${RECRUITER_SUMMARY.email} · copied to clipboard` })
        } catch {
          return print({ kind: 'out', text: RECRUITER_SUMMARY.email })
        }
      case 'warp':
      case 'engage':
        useSpaceStore.getState().warp()
        return print({ kind: 'out', text: 'Warp engaged.' })
      case 'sound':
        if (arg === 'on') {
          startHum()
          useSpaceStore.getState().setSoundOn(true)
          return print({ kind: 'out', text: 'Ambient hum on. sound off to stop it.' })
        }
        stopHum()
        useSpaceStore.getState().setSoundOn(false)
        return print({ kind: 'out', text: 'Sound off.' })
      case 'whoami':
        return print(
          { kind: 'out', text: `${RECRUITER_SUMMARY.name} · ${RECRUITER_SUMMARY.title}` },
          { kind: 'out', text: 'Takes problems from the ground to orbit. Builds iOS apps as Weekend Hobbies.' },
          { kind: 'out', text: 'Global IBM Tech 2026 awardee. Based in New Delhi, Earth.' },
        )
      case 'sky': {
        print({ kind: 'out', text: 'Pointing the telescope…' })
        try {
          const data = (await (await fetch('/sky.json')).json()) as SkyData
          const lst = localSiderealDeg(new Date(), OBSERVER.lon)
          const up = data.constellations
            .map((c) => {
              const pts = c.lines.flat()
              const alt = pts.reduce((s, [ra, dec]) => s + altAz(ra, dec, lst, OBSERVER.lat).alt, 0) / pts.length
              return { name: c.name, alt }
            })
            .filter((c) => c.alt > 0.45)
            .sort((a, b) => b.alt - a.alt)
            .slice(0, 8)
            .map((c) => c.name)
          return print(
            { kind: 'out', text: `High over New Delhi right now: ${up.join(', ') || 'mostly southern sky'}.` },
            { kind: 'out', text: 'On a desktop, hover the background stars to trace them.' },
          )
        } catch {
          return print({ kind: 'err', text: 'Telescope offline. Try again in a moment.' })
        }
      }
      case 'iss': {
        print({ kind: 'out', text: 'Contacting the ISS…' })
        try {
          const f = await fetchIss()
          return print({
            kind: 'out',
            text: `ISS is over ${f.over} at ${Math.round(f.altKm)} km, doing ${Math.round(f.speedKmh).toLocaleString('en')} km/h (${f.lat.toFixed(1)}°, ${f.lon.toFixed(1)}°).`,
          })
        } catch {
          return print({ kind: 'err', text: 'Signal lost. The ISS tracker is not answering.' })
        }
      }
      case 'golden':
      case 'goldenrecord':
        return go('/golden-record')
      case 'sudo':
        return print({ kind: 'err', text: 'Nice try. Ground control has the only root access.' })
      case 'clear':
        return setLines([])
      case 'exit':
      case 'quit':
      case 'close':
        return setOpen(false)
      default:
        if (cmd === 'golden record') return go('/golden-record')
        return print({ kind: 'err', text: `Unknown command: ${verb}. Type help.` })
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const v = value
    setValue('')
    setHIndex(-1)
    if (v.trim()) setHistory((h) => [v, ...h].slice(0, 30))
    void run(v)
  }

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = Math.min(history.length - 1, hIndex + 1)
      setHIndex(i)
      setValue(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIndex - 1
      setHIndex(Math.max(-1, i))
      setValue(i >= 0 ? history[i] : '')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-space-void/60 px-4 pt-20 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mission console"
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-space-line bg-space-deep shadow-[0_30px_80px_rgb(0_0_0/0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-space-line px-4 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-space-gold">Mission console</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-space-dim transition hover:text-space-gold"
            aria-label="Close console"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div ref={logRef} className="max-h-[50vh] overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed" aria-live="polite">
          {lines.map((l, i) => (
            <p
              key={i}
              className={
                l.kind === 'in' ? 'text-space-star' : l.kind === 'err' ? 'text-space-mars' : 'whitespace-pre-wrap text-space-dim'
              }
            >
              {l.kind === 'in' ? <span className="text-space-gold">› </span> : null}
              {l.text}
            </p>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-space-line px-4 py-3">
          <label htmlFor="console-input" className="font-mono text-space-gold">
            ›<span className="sr-only">Command</span>
          </label>
          <input
            ref={inputRef}
            id="console-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onInputKey}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="help"
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-space-star outline-none placeholder:text-space-dim/60"
          />
        </form>
      </div>
    </div>
  )
}
