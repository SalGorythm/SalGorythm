import type { CargoColor } from '../../data/homeContent'
import { RECOGNITION } from '../../data/homeContent'
import { EXPERIENCE_ROLES } from '../../data/experience'

const PORT_COLORS: CargoColor[] = ['cobalt', 'yellow', 'teal', 'orange', 'red', 'white']

/** "Feb 2025 — Present · City" -> "2025–" ; "Nov 2021 — Feb 2025" -> "2021–25" */
function shortPeriod(period: string) {
  const range = period.split('·')[0]
  const years = range.match(/\d{4}/g) ?? []
  if (years.length === 0) return range.trim()
  if (/present/i.test(range) || years.length === 1) return `${years[0]}–`
  return `${years[0]}–${years[1].slice(2)}`
}

const colorVar = (c: CargoColor) => (c === 'white' ? '#e9ecf4' : `var(--${c})`)

export function VoyageSection() {
  return (
    <section id="about" className="cg-section" aria-labelledby="about-h">
      <div className="cg-wrap">
        <div className="cg-kicker" style={{ ['--k' as string]: 'var(--red)' }}>
          <i aria-hidden />
          <span className="cg-mono">About</span>
        </div>
        <h2 id="about-h" className="cg-h2">
          Nine years
          <br />
          at sea.
        </h2>
        <div className="cg-voyage">
          <div className="cg-bio">
            <p>
              I started as a full-stack engineer at product startups, led a small team at Round One, moved into
              data and automation at TELUS International, then spent three years at EY building cybersecurity
              and data platforms for large enterprise fleets.
            </p>
            <p>
              Today I&#8217;m a Senior Data Scientist at IBM, working as a forward deployed engineer on agentic
              AI. In 2026 I was selected as a global IBM Tech awardee.
            </p>
            <p>
              On weekends I build and publish my own iOS apps, write about what I learn, and make browser
              experiments. I trained in mathematics, with an M.Sc. Tech in Industrial Mathematics with Computer
              Application from Jamia Millia Islamia.
            </p>
          </div>
          <div className="cg-log">
            <div>
              <span className="cg-mono">Ports of call</span>
              <ol>
                {EXPERIENCE_ROLES.map((r, i) => (
                  <li key={r.id}>
                    <span>{shortPeriod(r.period)}</span>
                    <i style={{ ['--c' as string]: colorVar(PORT_COLORS[i % PORT_COLORS.length]) }} aria-hidden />
                    <span>
                      <b>{r.org}</b> · {r.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <span className="cg-mono">Recognition</span>
              <ol>
                {RECOGNITION.map((r) => (
                  <li key={r.label}>
                    <span>{r.year}</span>
                    <i style={{ ['--c' as string]: colorVar(r.color) }} aria-hidden />
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
