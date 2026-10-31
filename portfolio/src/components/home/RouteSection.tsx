import { ROUTE_STAGES } from '../../data/homeContent'

export function RouteSection() {
  return (
    <section id="route" className="cg-section" aria-labelledby="route-h">
      <div className="cg-wrap">
        <div className="cg-kicker">
          <i aria-hidden />
          <span className="cg-mono">How I work</span>
        </div>
        <h2 id="route-h" className="cg-h2">
          Every stage,
          <br />
          one owner.
        </h2>
        <p className="cg-intro">
          Most products pass through five or six people before they go live. With me there are no handoffs, so
          nothing gets lost between the first sketch and the production deploy.
        </p>
        <ol className="cg-route">
          {ROUTE_STAGES.map((s, i) => (
            <li key={s.name} className={`cg-c-${s.color}`}>
              <span className="cg-n">{String(i + 1).padStart(2, '0')}</span>
              <b>{s.name}</b>
              <p>{s.detail}</p>
            </li>
          ))}
          <li className="cg-port">
            <span className="cg-n">{String(ROUTE_STAGES.length + 1).padStart(2, '0')}</span>
            <b>Live</b>
            <p>Monitored, measured, handed over</p>
          </li>
        </ol>
      </div>
    </section>
  )
}
