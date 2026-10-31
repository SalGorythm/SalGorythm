import { Link } from 'react-router-dom'
import { PORTFOLIO_APPS, appPath } from '../../data/myApps'

const COLORS = ['#E8B04B', '#8FC8FF', '#E2553A', '#6FD3B8', '#C9A8FF', '#EDEAE0']
const RINGS = [46, 70, 94]
const PERIOD = [44, 70, 104]

/**
 * Weekend Hobbies as a planetary system: each app is a planet (click to open it),
 * its features are moons, and the label dot shows whether it is live on the App Store.
 */
export function HobbySystem() {
  return (
    <>
      <div className="hb-system" role="group" aria-label="Weekend Hobbies planetary system">
        {RINGS.map((d) => (
          <div key={d} className="hb-ring" style={{ ['--d' as string]: d }} aria-hidden />
        ))}
        <div className="hb-sun" aria-hidden>
          <span>Weekend Hobbies</span>
        </div>
        {PORTFOLIO_APPS.map((app, i) => {
          const ring = i % RINGS.length
          const onRing = PORTFOLIO_APPS.filter((_, j) => j % RINGS.length === ring).length
          const idx = Math.floor(i / RINGS.length)
          const t = PERIOD[ring]
          const offset = -((idx / onRing) * t + ring * 7)
          const live = Boolean(app.appStoreUrl)
          const moons = Math.min(app.features.length, 3)
          return (
            <div
              key={app.id}
              className="hb-orbit"
              style={{ ['--d' as string]: RINGS[ring], ['--t' as string]: `${t}s`, ['--o' as string]: `${offset}s` }}
            >
              <div className="hb-planet">
                <div className="hb-spin">
                  <Link to={appPath(app.id)} aria-label={`${app.name}: ${live ? 'live on the App Store' : 'coming soon'}`}>
                    <span
                      className="hb-body"
                      style={{ ['--p' as string]: COLORS[i % COLORS.length], ['--s' as string]: `${18 + (app.features.length % 3) * 4}px`, margin: '0 auto' }}
                    >
                      {Array.from({ length: moons }, (_, m) => (
                        <span
                          key={m}
                          className="hb-moon"
                          aria-hidden
                          style={{ ['--mt' as string]: `${5 + m * 2.5}s`, ['--mo' as string]: `${-m * 1.7}s`, width: `calc(var(--s) + ${16 + m * 10}px)` }}
                        />
                      ))}
                    </span>
                  </Link>
                  <Link to={appPath(app.id)} tabIndex={-1} aria-hidden>
                    <span className="hb-tag" style={{ ['--st' as string]: live ? '#E8B04B' : '#8FC8FF' }}>
                      {app.name}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <p className="hb-legend">
        <span style={{ ['--st' as string]: '#E8B04B' }}>
          <i aria-hidden /> In orbit · on the App Store
        </span>
        <span style={{ ['--st' as string]: '#8FC8FF' }}>
          <i aria-hidden /> On the pad · coming soon
        </span>
        <span>Moons are features · click a planet</span>
      </p>
    </>
  )
}
