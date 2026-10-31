import { mailto, SERVICES } from '../../data/homeContent'
import { RECRUITER_SUMMARY } from '../../data/recruiterSummary'

export function GroundControl() {
  return (
    <section id="ground" className="sp-section" aria-labelledby="ground-h">
      <div className="sp-wrap">
        <p className="sp-mono sp-eyebrow">Ground control</p>
        <h2 id="ground-h" className="sp-h2">
          Three ways to fly together.
        </h2>
        <div className="sp-ground">
          {SERVICES.map((s) => (
            <article key={s.title} className="sp-svc">
              <span className="sp-mono">{s.verb}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a href={mailto(RECRUITER_SUMMARY.email, s.subject)}>{s.cta}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
