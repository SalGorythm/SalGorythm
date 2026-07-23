import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')

/** Default path — override with STATS_FILE_PATH for custom deployments. */
function resolveStatsFilePath() {
  if (process.env.STATS_FILE_PATH?.trim()) {
    return process.env.STATS_FILE_PATH.trim()
  }
  const candidates = [
    path.join(REPO_ROOT, 'data', 'stats.json'),
    path.join(process.cwd(), 'data', 'stats.json'),
  ]
  return candidates[0]
}

export const STATS_FILE_PATH = resolveStatsFilePath()

export const TRACKABLE_STAT_KEYS = [
  'visitor',
  'resume-download',
  'tool-pdf',
  'tool-bw',
  'game-neural',
  'game-jailbreak',
  'game-gitmerge',
  'game-ttt',
  'game-simon',
  'game-reflex',
  'game-cipher',
  'game-snake',
  'lab-boids',
  'lab-rockets',
  'lab-fourier',
]

const ARTICLE_STAT_PATTERN = /^article-[a-z0-9-]+-(views|claps)$/

/** Mirror of portfolio/src/constants/statsKeys.ts validation. */
export function isArticleStatKey(key) {
  return ARTICLE_STAT_PATTERN.test(key)
}

export function isValidStatKey(key) {
  if (key === 'visitor' || key === 'resume-download') return true
  if (key.startsWith('tool-') && key.length > 5) return true
  if (key.startsWith('game-') && key.length > 5) return true
  if (key.startsWith('lab-') && key.length > 4) return true
  if (isArticleStatKey(key)) return true
  return false
}

function emptyStats() {
  return Object.fromEntries(TRACKABLE_STAT_KEYS.map((key) => [key, 0]))
}

function normalizeCount(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

async function ensureStatsFile() {
  const candidates = [
    STATS_FILE_PATH,
    path.join(REPO_ROOT, 'data', 'stats.json'),
    path.join(process.cwd(), 'data', 'stats.json'),
  ]
  for (const filePath of candidates) {
    try {
      await fs.access(filePath)
      return filePath
    } catch {
      // try next
    }
  }

  const target = path.join(REPO_ROOT, 'data', 'stats.json')
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, `${JSON.stringify(emptyStats(), null, 2)}\n`, 'utf8')
  return target
}

export async function readStatsFile() {
  const filePath = await ensureStatsFile()
  const raw = await fs.readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw)
  const stats = emptyStats()

  for (const key of TRACKABLE_STAT_KEYS) {
    stats[key] = normalizeCount(parsed[key])
  }

  for (const [key, value] of Object.entries(parsed)) {
    if (isArticleStatKey(key)) {
      stats[key] = normalizeCount(value)
    }
  }

  return stats
}

export async function statsFileWritable() {
  try {
    const filePath = await ensureStatsFile()
    await fs.access(path.dirname(filePath), fs.constants.W_OK)
    const probe = `${filePath}.probe`
    await fs.writeFile(probe, '1', 'utf8')
    await fs.unlink(probe)
    return true
  } catch {
    return false
  }
}

export async function incrementStatInFile(key) {
  if (!isValidStatKey(key)) {
    throw new Error('Invalid stat key')
  }

  const writable = await statsFileWritable()
  if (!writable) {
    return null
  }

  const filePath = await ensureStatsFile()
  const stats = await readStatsFile()
  stats[key] = (stats[key] ?? 0) + 1

  const tmpPath = `${filePath}.tmp`
  await fs.writeFile(tmpPath, `${JSON.stringify(stats, null, 2)}\n`, 'utf8')
  await fs.rename(tmpPath, filePath)

  return stats[key]
}
