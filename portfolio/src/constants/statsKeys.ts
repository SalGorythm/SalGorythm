/** Allowed stat keys — prefix-based validation on the server. */
export const STAT_PREFIX = {
  TOOL: 'tool-',
  GAME: 'game-',
  LAB: 'lab-',
  ARTICLE: 'article-',
} as const

export const STAT_KEYS = {
  VISITOR: 'visitor',
  RESUME_DOWNLOAD: 'resume-download',
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

export type ArticleStatKind = 'views' | 'claps'

const ARTICLE_STAT_PATTERN = /^article-[a-z0-9-]+-(views|claps)$/

export function articleStatKey(slug: string, kind: ArticleStatKind): string {
  return `${STAT_PREFIX.ARTICLE}${slug}-${kind}`
}

export function isArticleStatKey(key: string): boolean {
  return ARTICLE_STAT_PATTERN.test(key)
}

export function isValidStatKey(key: string): boolean {
  if (key === STAT_KEYS.VISITOR || key === STAT_KEYS.RESUME_DOWNLOAD) return true
  if (key.startsWith(STAT_PREFIX.TOOL) && key.length > STAT_PREFIX.TOOL.length) return true
  if (key.startsWith(STAT_PREFIX.GAME) && key.length > STAT_PREFIX.GAME.length) return true
  if (key.startsWith(STAT_PREFIX.LAB) && key.length > STAT_PREFIX.LAB.length) return true
  if (isArticleStatKey(key)) return true
  return false
}

export function formatStatCount(n: number | undefined | null): string {
  if (n == null || Number.isNaN(n)) return '—'
  return n.toLocaleString('en-US')
}
