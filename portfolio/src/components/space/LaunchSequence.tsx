import { ROUTE_STAGES } from '../../data/homeContent'

function Rocket() {
  return (
    <svg className="sp-rocket" viewBox="0 0 58 96" aria-hidden fill="none" stroke="#070814" strokeWidth="2.4" strokeLinejoin="round">
      <path d="M29 4c9 9 13 22 13 38v22H16V42C16 26 20 13 29 4Z" fill="#EDEAE0" />
      <circle cx="29" cy="34" r="6" fill="#8FC8FF" />
      <path d="M16 52 6 66v8l10-6M42 52l10 14v8l-10-6" fill="#E2553A" />
      <path d="M22 64v6h14v-6" />
      <path d="M24 72c0 8 5 14 5 18 0-4 5-10 5-18" fill="#E2553A" stroke="#E2553A" />
    </svg>
  )
}

export function LaunchSequence() {
  const total = ROUTE_STAGES.length
  return (
    <section id="sequence" className="sp-section" aria-labelledby="sequence-h">
      <div className="sp-wrap">
        <p className="sp-mono sp-eyebrow">Launch sequence</p>
        <h2 id="sequence-h" className="sp-h2">
          Every stage of the count,
          <br />
          one flight director.
        </h2>
        <p className="sp-intro">
          Most products change hands five or six times before they launch. With me there are no handoffs, so
          nothing is lost between the first sketch and the production deploy.
        </p>
        <ol className="sp-count">
          {ROUTE_STAGES.map((s, i) => (
            <li key={s.name}>
              <span className="sp-t">T&#8722;{String(total - i).padStart(2, '0')}</span>
              <b>{s.name}</b>
              <p>{s.detail}</p>
            </li>
          ))}
          <li className="sp-lift">
            <span className="sp-t">T&#8722;00</span>
            <b>Liftoff</b>
            <p>Live in production. Monitored, measured, handed over.</p>
            <Rocket />
          </li>
        </ol>
      </div>
    </section>
  )
}
