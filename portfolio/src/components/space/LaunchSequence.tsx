import { LifecycleConsole } from './LifecycleConsole'

export function LaunchSequence() {
  return (
    <section id="sequence" className="sp-section" aria-labelledby="sequence-h">
      <div className="sp-wrap">
        <p className="sp-mono sp-eyebrow">Launch sequence</p>
        <h2 id="sequence-h" className="sp-h2">
          How a product reaches orbit.
        </h2>
        <p className="sp-intro">
          Ten stages, one flight director, and AI as co-pilot at every step. Agents do the heavy lifting; experience
          decides what ships. Use Proceed, the ← → keys, or click any stage on the flight path.
        </p>
        <LifecycleConsole />
      </div>
    </section>
  )
}
