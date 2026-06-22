/** Allowed stat keys — prefix-based validation on the server. */
export const STAT_PREFIX = {
  TOOL: 'tool-',
  GAME: 'game-',
  LAB: 'lab-',
} as const

export const STAT_KEYS = {
  VISITOR: 'visitor',
  TOOL_PDF: 'tool-pdf',
  TOOL_BW: 'tool-bw',
  GAME_NEURAL: 'game-neural',
  GAME_JAILBREAK: 'game-jailbreak',
  GAME_GITMERGE: 'game-gitmerge',
  GAME_TTT: 'game-ttt',
  GAME_SIMON: 'game-simon',
  GAME_REFLEX: 'game-reflex',
  GAME_CIPHER: 'game-cipher',
  GAME_SNAKE: 'game-snake',
  LAB_BOIDS: 'lab-boids',
  LAB_ROCKETS: 'lab-rockets',
  LAB_FOURIER: 'lab-fourier',
} as const

export type StatKey = (typeof STAT_KEYS)[keyof typeof STAT_KEYS]

export function isValidStatKey(key: string): boolean {
  if (key === STAT_KEYS.VISITOR) return true
  if (key.startsWith(STAT_PREFIX.TOOL) && key.length > STAT_PREFIX.TOOL.length) return true
  if (key.startsWith(STAT_PREFIX.GAME) && key.length > STAT_PREFIX.GAME.length) return true
  if (key.startsWith(STAT_PREFIX.LAB) && key.length > STAT_PREFIX.LAB.length) return true
  return false
}

export function formatStatCount(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return '—'
  return n.toLocaleString('en-US')
}
