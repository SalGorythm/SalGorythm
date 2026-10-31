/**
 * Optional ambient sound, synthesised with Web Audio (no audio files).
 * Off by default; only ever started from a user click.
 */
type Hum = { ctx: AudioContext; master: GainNode; nodes: AudioScheduledSourceNode[] }

let hum: Hum | null = null

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const ch = buf.getChannelData(0)
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1
  return buf
}

export function startHum() {
  if (hum) return
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return
  const ctx = new Ctx()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)
  master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2)

  const nodes: AudioScheduledSourceNode[] = []
  for (const f of [55, 55.35, 82.4]) {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    const g = ctx.createGain()
    g.gain.value = f > 80 ? 0.25 : 0.5
    o.connect(g).connect(master)
    o.start()
    nodes.push(o)
  }
  const n = ctx.createBufferSource()
  n.buffer = noiseBuffer(ctx, 4)
  n.loop = true
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 380
  const ng = ctx.createGain()
  ng.gain.value = 0.12
  n.connect(lp).connect(ng).connect(master)
  n.start()
  nodes.push(n)
  hum = { ctx, master, nodes }
}

export function stopHum() {
  if (!hum) return
  const h = hum
  hum = null
  h.master.gain.linearRampToValueAtTime(0, h.ctx.currentTime + 0.6)
  window.setTimeout(() => {
    h.nodes.forEach((n) => n.stop())
    void h.ctx.close()
  }, 700)
}

/** A short rising whoosh for warp jumps. Silent unless the hum is running. */
export function whoosh() {
  if (!hum) return
  const { ctx, master } = hum
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 1.2)
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 1.2
  bp.frequency.setValueAtTime(200, ctx.currentTime)
  bp.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.5)
  bp.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.1)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, ctx.currentTime)
  g.gain.linearRampToValueAtTime(5, ctx.currentTime + 0.35)
  g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.1)
  src.connect(bp).connect(g).connect(master)
  src.start()
}
