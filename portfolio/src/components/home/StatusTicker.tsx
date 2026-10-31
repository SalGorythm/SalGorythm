const ITEMS = [
  'Now: building agentic AI at IBM',
  'Taking select end-to-end builds',
  'AI consulting',
  'Mock interviews',
]

/** Scrolling status strip under the hero. Pauses on hover; static with reduced motion. */
export function StatusTicker() {
  return (
    <div className="cg-ticker">
      <div className="cg-ticker-track">
        <ul aria-label="Current status">
          {ITEMS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <ul aria-hidden>
          {ITEMS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
