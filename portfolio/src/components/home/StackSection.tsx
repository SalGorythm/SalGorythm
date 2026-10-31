import { STACK_CONTAINERS } from '../../data/homeContent'

export function StackSection() {
  return (
    <section id="stack" className="cg-section" aria-labelledby="stack-h">
      <div className="cg-wrap">
        <div className="cg-kicker" style={{ ['--k' as string]: 'var(--teal)' }}>
          <i aria-hidden />
          <span className="cg-mono">Stack</span>
        </div>
        <h2 id="stack-h" className="cg-h2">
          What&#8217;s in
          <br />
          the containers.
        </h2>
        <div className="cg-yard">
          {STACK_CONTAINERS.map((c) => (
            <article key={c.title} className={`cg-cont cg-c-${c.color}`}>
              <div className="cg-code">
                <span>{c.code}</span>
                <span>{c.size}</span>
              </div>
              <h3>{c.title}</h3>
              <ul>
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
