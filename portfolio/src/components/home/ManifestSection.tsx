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

const pad = (n: number) => String(n).padStart(3, '0')

function AppPort({ app }: { app: PortfolioApp }) {
  if (app.appStoreUrl) {
    return (
      <span className="cg-port-cell" role="cell">
        <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer">
          On the App Store
        </a>
        {app.playStoreUrl ? (
          <>
            {' · '}
            <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer">
              Google Play
            </a>
          </>
        ) : null}
      </span>
    )
  }
  return (
    <span className="cg-port-cell" role="cell">
      <span className="cg-status" style={{ ['--s' as string]: 'var(--yellow)' }}>
        {app.appStoreNote ?? 'Coming soon'}
      </span>
    </span>
  )
}

export function ManifestSection() {
  const appStart = SHIPPED_SYSTEMS.length
  return (
    <section id="manifest" className="cg-section cg-hold" aria-labelledby="manifest-h">
      <div className="cg-wrap">
        <div className="cg-kicker" style={{ ['--k' as string]: 'var(--yellow)' }}>
          <i aria-hidden />
          <span className="cg-mono">Ship log</span>
        </div>
        <h2 id="manifest-h" className="cg-h2">
          The manifest.
        </h2>
        <p className="cg-intro">
          Systems I&#8217;ve taken to production at work, then the apps I build as weekend hobbies, in my own
          time. Work entries stay at a public level: no client names or internal numbers.
        </p>

        <div className="cg-manifest">
          <span className="cg-stamp" aria-hidden>
            SHIPPED
          </span>
          <div className="cg-mhead">
            <div>
              <span>Shipper</span>
              <b>Salman Akhatar</b>
            </div>
            <div>
              <span>Vessel</span>
              <b>MV Salgorythm</b>
            </div>
            <div>
              <span>Voyage</span>
              <b>2016 – present</b>
            </div>
            <div>
              <span>Port of discharge</span>
              <b>Production</b>
            </div>
          </div>

          <div role="table" aria-label="Systems shipped at work">
            <div className="cg-row cg-th" role="row">
              <span role="columnheader">No.</span>
              <span role="columnheader">Cargo</span>
              <span role="columnheader">Consignee</span>
              <span role="columnheader">Stack</span>
            </div>
            {SHIPPED_SYSTEMS.map((s, i) => (
              <div className="cg-row" role="row" key={s.title}>
                <span className="cg-no" role="cell">
                  {pad(i + 1)}
                </span>
                <div className="cg-what" role="cell">
                  <h3>{s.title}</h3>
                  <p>{s.detail}</p>
                  <span className="cg-when">{s.period}</span>
                </div>
                <span className="cg-to" role="cell">
                  {s.consignee}
                </span>
                <span className="cg-port-cell" role="cell">
                  {s.stack.join(' · ')}
                </span>
              </div>
            ))}
          </div>

          <div className="cg-msub" id="my-apps">
            <b>Weekend Hobbies · iOS apps</b>
            <span>Personal projects, made in my own time</span>
          </div>
          <div role="table" aria-label="Weekend hobby apps">
            <div className="cg-row cg-th" role="row">
              <span role="columnheader">No.</span>
              <span role="columnheader">App</span>
              <span role="columnheader">Platforms</span>
              <span role="columnheader">Port</span>
            </div>
            {PORTFOLIO_APPS.map((app, i) => (
              <div className="cg-row" role="row" key={app.id}>
                <span className="cg-no" role="cell">
                  {pad(appStart + i + 1)}
                </span>
                <div className="cg-what" role="cell">
                  <h3>
                    <Link to={appPath(app.id)}>{app.name}</Link>
                  </h3>
                  <p>{app.tagline}</p>
                  <span className="cg-when">{app.category}</span>
                </div>
                <span className="cg-to" role="cell">
                  {app.platforms.join(' · ')}
                </span>
                <AppPort app={app} />
              </div>
            ))}
          </div>
          <div className="cg-msub" id={SALGORYTHM_SUPPORT_PAGE_HASH}>
            <b>App support</b>
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
