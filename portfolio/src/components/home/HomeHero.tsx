import { ARTICLES } from '../../data/articles'
import { DECK_CONTAINERS, mailto } from '../../data/homeContent'
import { PORTFOLIO_APPS } from '../../data/myApps'
import { RECRUITER_SUMMARY } from '../../data/recruiterSummary'

const DECK_LABEL = `A cargo ship named MV Salgorythm carrying ${DECK_CONTAINERS.length} containers, one for each part of the job: ${DECK_CONTAINERS.map((c) => c.label).join(', ')}.`

function Ship() {
  return (
    <div className="cg-vessel" role="img" aria-label={DECK_LABEL}>
      <div className="cg-deck" aria-hidden>
        {DECK_CONTAINERS.map((c) => (
          <div
            key={c.label}
            className={`cg-box cg-c-${c.color}`}
            style={{ gridRow: c.row, gridColumn: `${c.col} / span 2` }}
          >
            <small>{c.code}</small>
            <b>{c.label}</b>
          </div>
        ))}
      </div>
      <div className="cg-hull" aria-hidden>
        <span>MV SALGORYTHM</span>
        <em>NEW DELHI</em>
      </div>
      <div className="cg-sea" aria-hidden />
    </div>
  )
}

export function HomeHero() {
  const { email } = RECRUITER_SUMMARY
  return (
    <header id="hero" className="cg-hero">
      <div className="cg-wrap">
        <div className="cg-hero-grid">
          <div className="cg-hero-copy">
            <p className="cg-mono">Senior Data Scientist · Forward Deployed Engineer</p>
            <h1>
              I don&#8217;t just build. <span className="cg-ship-word">I ship.</span>
            </h1>
            <p className="cg-lede">
              Hand me a messy problem and I hand back a live product.{' '}
              <b>
                Design, planning, backend, frontend, databases, DevOps, AI agents, SEO, mobile apps and the
                store listing
              </b>
              , with one person owning all of it.
            </p>
            <div className="cg-actions">
              <a className="cg-btn" href="#contact">
                Get in touch
              </a>
              <a className="cg-btn cg-btn--ghost" href="#manifest">
                See what I&#8217;ve shipped
              </a>
            </div>
            <p className="cg-addr">
              <a href={mailto(email, 'Hello Salman')}>{email}</a>
            </p>
          </div>
          <Ship />
        </div>

        <div className="cg-stats">
          <div className="cg-stat">
            <b>9+ yrs</b>
            <span>shipping software to production</span>
          </div>
          <div className="cg-stat">
            <b>{PORTFOLIO_APPS.length} apps</b>
            <span>built and published as weekend hobbies</span>
          </div>
          <div className="cg-stat">
            <b>{ARTICLES.length}</b>
            <span>articles on agents, evals and shipping</span>
          </div>
          <div className="cg-stat">
            <b>2026</b>
            <span>Global IBM Tech awardee</span>
          </div>
        </div>
      </div>
    </header>
  )
}
