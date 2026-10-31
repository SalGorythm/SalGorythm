import { Link } from 'react-router-dom'
import { ARTICLES, getFeaturedArticles } from '../../data/articles'

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function LogbookSection() {
  const entries = getFeaturedArticles(3)
  return (
    <section id="logbook" className="cg-section cg-logbook" aria-labelledby="logbook-h">
      <div className="cg-wrap">
        <div className="cg-kicker" style={{ ['--k' as string]: 'var(--orange)' }}>
          <i aria-hidden />
          <span className="cg-mono">Logbook</span>
        </div>
        <h2 id="logbook-h" className="cg-h2">
          Notes from
          <br />
          the deck.
        </h2>
        <p className="cg-intro">
          I write up what I learn shipping agents, evals and data pipelines, so the next person doesn&#8217;t
          have to learn it the hard way.
        </p>

        <div className="cg-entries">
          {entries.map((a) => (
            <Link key={a.slug} to={`/writing/${a.slug}`} className="cg-entry">
              <span className="cg-mono">
                {fmt(a.date)} · {a.readTime} min read
              </span>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
              <span className="cg-more">Read the entry</span>
            </Link>
          ))}
        </div>

        <div className="cg-all">
          <Link to="/writing" className="cg-btn">
            All {ARTICLES.length} articles
          </Link>
        </div>

        <p className="cg-mono" style={{ marginTop: 48, color: 'var(--yellow)' }}>
          Weekend Hobbies
        </p>
        <div className="cg-aboard" style={{ marginTop: 14 }}>
          <Link to="/sandbox">
            <span>
              <b>Sandbox</b>
              <small>Browser games and canvas experiments</small>
            </span>
            <i aria-hidden>→</i>
          </Link>
          <Link to="/tools">
            <span>
              <b>Tools</b>
              <small>PDF unlock and black-and-white converter. Files never leave your browser.</small>
            </span>
            <i aria-hidden>→</i>
          </Link>
        </div>
      </div>
    </section>
  )
}
