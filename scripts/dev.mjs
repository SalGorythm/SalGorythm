import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { findExistingStatsPort, startStatsServer } from './stats-dev-server.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const preferredPort = Number(process.env.STATS_PORT || 3001)

/** @type {import('node:http').Server | null} */
let statsServer = null
/** @type {import('node:child_process').ChildProcess | null} */
let viteChild = null

function shutdown(code = 0) {
  if (viteChild && !viteChild.killed) viteChild.kill('SIGTERM')
  if (statsServer) statsServer.close()
  process.exit(code)
}

const existingPort = await findExistingStatsPort(preferredPort)
let statsPort = existingPort

if (existingPort) {
  console.log(`[dev] reusing stats API on http://localhost:${existingPort}/api/stats`)
} else {
  const started = await startStatsServer(preferredPort)
  statsServer = started.server
  statsPort = started.port
  console.log(`[stats] file store API on http://localhost:${statsPort}/api/stats`)
}

viteChild = spawn('npm', ['run', 'dev', '--prefix', 'portfolio'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, STATS_PORT: String(statsPort) },
})

viteChild.on('exit', (code) => {
  if (code && code !== 0) shutdown(code)
})

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
