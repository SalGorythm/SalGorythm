import { useState } from 'react'
import { RECOGNITION } from '../../data/homeContent'
import { EXPERIENCE_ROLES } from '../../data/experience'

/** "Feb 2025 — Present · City" -> "2025–" ; "Nov 2021 — Feb 2025" -> "2021–25" */
function shortPeriod(period: string) {
  const range = period.split('·')[0]
  const years = range.match(/\d{4}/g) ?? []
  if (years.length === 0) return range.trim()
  if (/present/i.test(range)) return `${years[0]}–`
  if (years.length === 1 || years[0] === years[1]) return years[0]
  return `${years[0]}–${years[1].slice(2)}`
}

function Alien() {
  return (
    <svg viewBox="0 0 62 74" aria-hidden>
      <path d="M31 2v10" stroke="#6FD3B8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="31" cy="3" r="3" fill="#E8B04B" />
      <path d="M8 40c0-17 10-28 23-28s23 11 23 28c0 14-9 26-23 26S8 54 8 40Z" fill="#6FD3B8" />
      <ellipse cx="21" cy="38" rx="7" ry="9" transform="rotate(-18 21 38)" fill="#070814" />
      <ellipse cx="41" cy="38" rx="7" ry="9" transform="rotate(18 41 38)" fill="#070814" />
      <circle cx="23" cy="35" r="2" fill="#EDEAE0" />
      <circle cx="43" cy="35" r="2" fill="#EDEAE0" />
      <path d="M26 54c3 2 7 2 10 0" stroke="#070814" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M8 74c2-6 8-9 23-9s21 3 23 9" fill="#6FD3B8" />
    </svg>
  )
}

const ALIEN_LINES = [
  'Crew member No. 2. Doesn’t write code, but reviews every pull request.',
  'Take me to your production environment.',
  'I flew 2.5 million light-years for this portfolio. Worth it.',
  'Psst. Press / for the mission console.',
  'Tip: type the word warp anywhere on the page.',
  'Rumour says there’s a golden record hidden on this site.',
]

export function CrewRecord() {
  const [line, setLine] = useState(0)
  const next = () => setLine((l) => (l + 1) % ALIEN_LINES.length)
  return (
    <section id="crew" className="sp-section" aria-labelledby="crew-h">
      <div className="sp-wrap">
        <p className="sp-mono sp-eyebrow">Crew record</p>
        <h2 id="crew-h" className="sp-h2">
          Ten years in flight.
        </h2>
        <div className="sp-record">
          <div className="sp-bio">
            <p>
              I started as a full-stack engineer at product startups, led a small team at Round One, moved into
              data and automation at TELUS International, then spent three years at EY building cybersecurity and
              data platforms for large enterprise fleets.
            </p>
            <p>
              Today I&#8217;m a Senior Data Scientist at IBM, working as a forward deployed engineer on agentic AI.
              In 2026 I was selected as a global IBM Tech awardee.
            </p>
            <p>
              On weekends I build iOS apps, write, and make browser experiments. I trained in mathematics, with an
              M.Sc. Tech in Industrial Mathematics with Computer Application from Jamia Millia Islamia.
            </p>

            <div className="sp-crewmate">
              <button type="button" aria-label="Say hello to the crewmate" onClick={next} onMouseEnter={next}>
                <span className="sp-moon" aria-hidden />
                <Alien />
              </button>
              <p className="sp-bubble" aria-live="polite">
                {ALIEN_LINES[line]}
              </p>
            </div>
          </div>
          <div className="sp-lists">
            <div>
              <span className="sp-mono">Previous missions</span>
              <ol>
                {EXPERIENCE_ROLES.map((r, i) => (
                  <li key={r.id} style={i === 0 ? { ['--lc' as string]: 'var(--gold)' } : undefined}>
                    <span>{shortPeriod(r.period)}</span>
                    <span>
                      <b>{r.org}</b> · {r.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <span className="sp-mono">Honours</span>
              <ol>
                {RECOGNITION.map((r, i) => (
                  <li key={r.label} style={i === 0 ? { ['--lc' as string]: 'var(--gold)' } : undefined}>
                    <span>{r.year}</span>
                    <span>{r.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
