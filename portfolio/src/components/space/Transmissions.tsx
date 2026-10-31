import { Link } from 'react-router-dom'
import { ARTICLES, getFeaturedArticles } from '../../data/articles'
import { Wormhole } from './Wormhole'

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function Transmissions() {
  const entries = getFeaturedArticles(3)
  return (
    <section id="transmissions" className="sp-section" aria-labelledby="transmissions-h">
      <div className="sp-wrap">
        <div className="sp-tx-head">
          <div>
            <p className="sp-mono sp-eyebrow">Transmissions</p>
            <h2 id="transmissions-h" className="sp-h2">
              Notes sent back
              <br />
              to Earth.
            </h2>
            <p className="sp-intro">
              I write up what I learn shipping agents, evals and data pipelines, so the next crew doesn&#8217;t
              have to learn it the hard way.
            </p>
          </div>
          <Wormhole />
        </div>

        <div className="sp-tx">
          {entries.map((a) => (
            <Link key={a.slug} to={`/writing/${a.slug}`}>
              <span className="sp-mono">
                {fmt(a.date)} · {a.readTime} min
              </span>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <span className="sp-go">Receive transmission →</span>
            </Link>
          ))}
        </div>

        <p className="sp-mono" style={{ marginTop: 44, color: 'var(--gold)' }}>
          Weekend Hobbies · also aboard
        </p>
        <div className="sp-hobbies">
          <Link to="/sandbox">
            <span>
              <b>Sandbox</b>
              <small>Browser games and canvas experiments</small>
            </span>
            <span className="sp-arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link to="/tools">
            <span>
              <b>Tools</b>
              <small>PDF utilities that never upload your files</small>
            </span>
            <span className="sp-arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link to="/writing">
            <span>
              <b>All {ARTICLES.length} articles</b>
              <small>Agents, evals, prompting, deployment</small>
            </span>
            <span className="sp-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
