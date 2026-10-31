import { useRef } from 'react'
import { useCanvasLoop, type DrawFn } from './useCanvasLoop'

const RINGS = 26

/** Ring radii fall off with depth; the far end of the tunnel drifts on a slow curve. */
const draw: DrawFn = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2
  const cy = h / 2
  const R = Math.min(w, h) * 0.48
  const phase = (t * 0.00012) % 1

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
  glow.addColorStop(0, 'rgba(200,225,255,0.35)')
  glow.addColorStop(0.25, 'rgba(143,200,255,0.10)')
  glow.addColorStop(1, 'rgba(143,200,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  for (let i = RINGS; i >= 0; i--) {
    const depth = (i + phase) / RINGS // 0 = mouth, 1 = far end
    const scale = Math.pow(1 - depth, 2.2)
    const r = R * scale
    if (r < 1.5) continue
    const bend = depth * depth
    const ox = Math.sin(t * 0.0004 + depth * 3) * R * 0.22 * bend
    const oy = Math.cos(t * 0.0003 + depth * 2.4) * R * 0.14 * bend
    const alpha = Math.min(1, depth * 2.4) * (1 - depth) * 0.95
    const hue = depth < 0.5 ? '143,200,255' : '182,156,255'
    ctx.strokeStyle = `rgba(${hue},${alpha.toFixed(3)})`
    ctx.lineWidth = Math.max(0.6, 2.4 * (1 - depth))
    ctx.beginPath()
    ctx.ellipse(cx + ox, cy + oy, r, r * 0.92, t * 0.0002 + depth * 2, 0, Math.PI * 2)
    ctx.stroke()
  }

  // streaks of light pulled down the throat
  for (let k = 0; k < 36; k++) {
    const a = (k / 36) * Math.PI * 2 + t * 0.00025
    const d = (((k * 0.137 + t * 0.00018) % 1) + 1) % 1
    const r1 = R * (1 - d)
    const r2 = r1 * 0.86
    ctx.strokeStyle = `rgba(237,234,224,${(0.5 * d).toFixed(3)})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.beginPath()
  ctx.arc(cx + Math.sin(t * 0.0004 + 3) * R * 0.2, cy + Math.cos(t * 0.0003 + 2.4) * R * 0.13, 2.4, 0, Math.PI * 2)
  ctx.fill()
}

export function Wormhole() {
  const ref = useRef<HTMLCanvasElement>(null)
  useCanvasLoop(ref, draw)
  return (
    <figure className="sp-wormhole" role="img" aria-label="A wormhole: rings of light curving into a distant point.">
      <canvas ref={ref} aria-hidden />
      <figcaption className="sp-mono">Inbound transmissions</figcaption>
    </figure>
  )
}
