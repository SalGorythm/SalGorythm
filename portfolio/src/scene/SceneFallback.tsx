import { GRAPH_EDGES, GRAPH_NODES, NODE_COLORS } from './graphData'

/** Static SVG fallback when WebGL is unavailable or reduced motion is preferred. */
export function SceneFallback({ className = '' }: { className?: string }) {
  const scale = 28
  const cx = 160
  const cy = 140

  const toSvg = (pos: [number, number, number]) => ({
    x: cx + pos[0] * scale,
    y: cy - pos[1] * scale,
  })

  const nodeById = new Map(GRAPH_NODES.map((n) => [n.id, n]))

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/80 ${className}`}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(34,211,238,0.08), transparent 70%)',
        }}
      />
      <svg viewBox="0 0 320 280" className="relative h-full w-full" role="presentation">
        {GRAPH_EDGES.map(([from, to]) => {
          const a = nodeById.get(from)
          const b = nodeById.get(to)
          if (!a || !b) return null
          const p1 = toSvg(a.position)
          const p2 = toSvg(b.position)
          return (
            <line
              key={`${from}-${to}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="url(#edge-grad)"
              strokeWidth={1}
              opacity={0.45}
            />
          )
        })}
        <defs>
          <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        {GRAPH_NODES.map((node) => {
          const p = toSvg(node.position)
          const r = 6 + node.scale * 14
          return (
            <g key={node.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={NODE_COLORS[node.color]}
                fillOpacity={node.id === 'core' ? 0.35 : 0.22}
                stroke={NODE_COLORS[node.color]}
                strokeWidth={1}
                strokeOpacity={0.7}
              />
              {node.id === 'core' ? (
                <circle cx={p.x} cy={p.y} r={3} fill="#e2e8f0" />
              ) : null}
            </g>
          )
        })}
      </svg>
      <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] text-slate-500">
        Systems topology · static preview
      </p>
    </div>
  )
}
