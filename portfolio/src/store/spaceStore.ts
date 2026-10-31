import { create } from 'zustand'

/** A gravitational lens the starfield bends stars around (screen coordinates, CSS px). */
export type Lens = { x: number; y: number; r: number }

type SpaceStore = {
  /** Timestamp (performance.now) of the last warp request; the starfield animates from it. */
  warpAt: number
  warp: () => void
  /** The black hole's lens, set by the contact section while it is on screen. */
  blackHole: Lens | null
  setBlackHole: (lens: Lens | null) => void
  consoleOpen: boolean
  setConsoleOpen: (open: boolean) => void
  soundOn: boolean
  setSoundOn: (on: boolean) => void
  /** Constellation currently under the pointer, for the sky caption. */
  constellation: string | null
  setConstellation: (name: string | null) => void
}

export const useSpaceStore = create<SpaceStore>((set) => ({
  warpAt: -Infinity,
  warp: () => set({ warpAt: performance.now() }),
  blackHole: null,
  setBlackHole: (blackHole) => set({ blackHole }),
  consoleOpen: false,
  setConsoleOpen: (consoleOpen) => set({ consoleOpen }),
  soundOn: false,
  setSoundOn: (soundOn) => set({ soundOn }),
  constellation: null,
  setConstellation: (constellation) => set({ constellation }),
}))

/** Warp envelope: ramps up for 300 ms, holds, then decays. 0 when idle. */
export function warpAmount(now: number, warpAt: number) {
  const t = now - warpAt
  if (t < 0 || t > 1100) return 0
  if (t < 300) return t / 300
  if (t < 500) return 1
  return 1 - (t - 500) / 600
}
