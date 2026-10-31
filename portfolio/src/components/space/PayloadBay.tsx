import { STACK_CONTAINERS } from '../../data/homeContent'

const PAYLOAD_COLORS = ['var(--mars)', 'var(--ice)', 'var(--gold)', 'var(--aurora)']

export function PayloadBay() {
  return (
    <section id="payload" className="sp-section" aria-labelledby="payload-h">
      <div className="sp-wrap">
        <p className="sp-mono sp-eyebrow">Payload bay</p>
        <h2 id="payload-h" className="sp-h2">
          What I bring aboard.
        </h2>
        <div className="sp-bay">
          {STACK_CONTAINERS.map((c, i) => (
            <article key={c.title} className="sp-payload" style={{ ['--pc' as string]: PAYLOAD_COLORS[i % PAYLOAD_COLORS.length] }}>
              <span className="sp-mono">Payload {String(i + 1).padStart(2, '0')}</span>
              <h3>{c.title === 'Ship & grow' ? 'Launch & grow' : c.title}</h3>
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
