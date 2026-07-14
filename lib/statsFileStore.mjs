import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')

/** Default path — override with STATS_FILE_PATH for custom deployments. */
export const STATS_FILE_PATH =
  process.env.STATS_FILE_PATH?.trim() || path.join(REPO_ROOT, 'data', 'stats.json')

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

/** Mirror of portfolio/src/constants/statsKeys.ts validation. */
export function isValidStatKey(key) {
  if (key === 'visitor' || key === 'resume-download') return true
  if (key.startsWith('tool-') && key.length > 5) return true
  if (key.startsWith('game-') && key.length > 5) return true
  if (key.startsWith('lab-') && key.length > 4) return true
  return false
}

function emptyStats() {
  return Object.fromEntries(TRACKABLE_STAT_KEYS.map((key) => [key, 0]))
}

async function ensureStatsFile() {
  try {
    await fs.access(STATS_FILE_PATH)
    return
  } catch {
    await fs.mkdir(path.dirname(STATS_FILE_PATH), { recursive: true })
    await fs.writeFile(STATS_FILE_PATH, `${JSON.stringify(emptyStats(), null, 2)}\n`, 'utf8')
  }
}

export async function readStatsFile() {
  await ensureStatsFile()
  const raw = await fs.readFile(STATS_FILE_PATH, 'utf8')
  const parsed = JSON.parse(raw)
  const stats = emptyStats()
  for (const key of TRACKABLE_STAT_KEYS) {
    const value = parsed[key]
    stats[key] = typeof value === 'number' && Number.isFinite(value) ? value : 0
  }
  return stats
}

export async function statsFileWritable() {
  try {
    await ensureStatsFile()
    await fs.access(path.dirname(STATS_FILE_PATH), fs.constants.W_OK)
    const probe = `${STATS_FILE_PATH}.probe`
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

  const stats = await readStatsFile()
  stats[key] = (stats[key] ?? 0) + 1

  const tmpPath = `${STATS_FILE_PATH}.tmp`
  await fs.writeFile(tmpPath, `${JSON.stringify(stats, null, 2)}\n`, 'utf8')
  await fs.rename(tmpPath, STATS_FILE_PATH)

  return stats[key]
}
