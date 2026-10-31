import { mailto, SERVICES } from '../../data/homeContent'
import { RECRUITER_SUMMARY } from '../../data/recruiterSummary'

export function ServicesSection() {
  return (
    <section id="services" className="cg-section cg-berths" aria-labelledby="services-h">
      <div className="cg-wrap">
        <div className="cg-kicker" style={{ ['--k' as string]: 'var(--cobalt)' }}>
          <i aria-hidden />
          <span className="cg-mono">Work with me</span>
        </div>
        <h2 id="services-h" className="cg-h2">
          Three ways
          <br />
          to work together.
        </h2>
        <div className="cg-svc-grid">
          {SERVICES.map((s) => (
            <article key={s.title} className="cg-svc">
              <header className={`cg-c-${s.color}`}>
                <span>{s.berth}</span>
                <b>{s.verb}</b>
              </header>
              <div className="cg-svc-body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul>
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a href={mailto(RECRUITER_SUMMARY.email, s.subject)}>{s.cta}</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
