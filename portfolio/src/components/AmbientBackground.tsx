/** Fixed ambient bokeh layer — sits behind all page content on every route. */
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden>
      <div className="ambient-bg__blobs">
        <div className="ambient-bg__blob ambient-bg__blob--cyan" />
        <div className="ambient-bg__blob ambient-bg__blob--purple" />
        <div className="ambient-bg__blob ambient-bg__blob--amber" />
      </div>
      <div className="ambient-bg__overlay" />
    </div>
  )
}
