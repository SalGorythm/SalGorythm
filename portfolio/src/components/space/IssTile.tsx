import { useEffect, useState } from 'react'
import { fetchIss, type IssFix } from '../../lib/iss'

/** Live ISS position for the hero telemetry bar. Refreshes every 20 s while the tab is visible. */
export function IssTile() {
  const [fix, setFix] = useState<IssFix | null>(null)
  const [lost, setLost] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    let timer = 0
    const load = async () => {
      if (document.visibilityState === 'visible') {
        try {
          setFix(await fetchIss(ctrl.signal))
          setLost(false)
        } catch {
          if (!ctrl.signal.aborted) setLost(true)
        }
      }
      timer = window.setTimeout(load, 20_000)
    }
    void load()
    return () => {
      ctrl.abort()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <div className="sp-tm">
      <span className="sp-mono">
        <span className={`sp-live ${fix && !lost ? 'is-on' : ''}`} aria-hidden /> ISS right now
      </span>
      <b>{fix ? `Over ${fix.over}` : lost ? 'Signal lost' : 'Acquiring…'}</b>
      <small>
        {fix
          ? `${Math.round(fix.altKm)} km up · ${Math.round(fix.speedKmh).toLocaleString('en')} km/h`
          : 'live from wheretheiss.at'}
      </small>
    </div>
  )
}
