import { Link } from 'react-router-dom'
import { SHIPPED_SYSTEMS } from '../../data/homeContent'
import {
  PORTFOLIO_APPS,
  SALGORYTHM_SUPPORT_EMAIL,
  SALGORYTHM_SUPPORT_MAILTO,
  SALGORYTHM_SUPPORT_PAGE_HASH,
  appPath,
  type PortfolioApp,
} from '../../data/myApps'

const ORG_COLOR: Record<string, string> = {
  IBM: 'var(--gold)',
  'IBM Consulting': 'var(--gold)',
  EY: 'var(--ice)',
}

function ProbeStatus({ app }: { app: PortfolioApp }) {
  if (app.appStoreUrl) {
    return (
      <span className="sp-status">
        <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer">
          In orbit · App Store
        </a>
      </span>
    )
  }
  return (
    <span className="sp-status" style={{ ['--sc' as string]: 'var(--ice)' }}>
      On the pad · {(app.appStoreNote ?? 'coming soon').replace(/^App Store\s*[—-]\s*/i, '')}
    </span>
  )
}

export function MissionLog() {
  return (
    <section id="missions" className="sp-section" aria-labelledby="missions-h">
      <div className="sp-wrap">
        <p className="sp-mono sp-eyebrow">Mission log</p>
        <h2 id="missions-h" className="sp-h2">
          Missions flown.
        </h2>
        <p className="sp-intro">
          Systems I&#8217;ve taken to production at work, then the probes I launch as Weekend Hobbies, in my own
          time. Work entries stay at a public level: no client names or internal numbers.
        </p>

        <div className="sp-log">
          <div className="sp-log-head">
            <span className="sp-mono">Flight director: Salman Akhatar</span>
            <span className="sp-mono">Voyage 2016 – present</span>
            <span className="sp-mono">Destination: production</span>
          </div>

          <div role="table" aria-label="Missions flown at work">
            <div className="sp-mission sp-th" role="row">
              <span className="sp-mono" role="columnheader">Patch</span>
              <span className="sp-mono" role="columnheader">Mission</span>
              <span className="sp-mono" role="columnheader">Flown for</span>
              <span className="sp-mono" role="columnheader">Payload</span>
            </div>
            {SHIPPED_SYSTEMS.map((s, i) => (
              <div className="sp-mission" role="row" key={s.title}>
                <span className="sp-patch" role="cell" style={{ ['--pc' as string]: ORG_COLOR[s.consignee] ?? 'var(--mars)' }}>
                  SA-{String(i + 1).padStart(2, '0')}
                </span>
                <div className="sp-what" role="cell">
                  <h3>{s.title}</h3>
                  <p>{s.detail}</p>
                  <span className="sp-when">{s.period}</span>
                </div>
                <span className="sp-agency" role="cell">
                  {s.consignee}
                </span>
                <span className="sp-cargo" role="cell">
                  {s.stack.join(' · ')}
                </span>
              </div>
            ))}
          </div>

          <div className="sp-sublog" id="my-apps">
            <b>Weekend Hobbies · probes launched</b>
            <span>Personal iOS apps, made in my own time</span>
          </div>
          <div role="table" aria-label="Weekend hobby apps">
            <div className="sp-mission sp-th" role="row">
              <span className="sp-mono" role="columnheader">Patch</span>
              <span className="sp-mono" role="columnheader">Probe</span>
              <span className="sp-mono" role="columnheader">Platform</span>
              <span className="sp-mono" role="columnheader">Status</span>
            </div>
            {PORTFOLIO_APPS.map((app, i) => (
              <div className="sp-mission" role="row" key={app.id}>
                <span className="sp-patch" role="cell" style={{ ['--pc' as string]: app.appStoreUrl ? 'var(--gold)' : 'var(--ice)' }}>
                  P-{String(i + 1).padStart(2, '0')}
                </span>
                <div className="sp-what" role="cell">
                  <h3>
                    <Link to={appPath(app.id)}>{app.name}</Link>
                  </h3>
                  <p>{app.tagline}</p>
                  <span className="sp-when">{app.category}</span>
                </div>
                <span className="sp-agency" role="cell">
                  {app.platforms.join(' · ')}
                </span>
                <span className="sp-cargo" role="cell">
                  <ProbeStatus app={app} />
                </span>
              </div>
            ))}
          </div>
          <div className="sp-sublog" id={SALGORYTHM_SUPPORT_PAGE_HASH}>
            <b>Probe support</b>
            <span>
              <a href={SALGORYTHM_SUPPORT_MAILTO}>{SALGORYTHM_SUPPORT_EMAIL}</a>
              {' · '}
              <Link to="/support">Support page</Link>
              {' · '}
              <Link to="/apps">All Weekend Hobbies</Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
