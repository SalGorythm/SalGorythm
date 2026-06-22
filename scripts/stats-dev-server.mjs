import http from 'node:http'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  incrementStatInFile,
  isValidStatKey,
  readStatsFile,
  statsFileWritable,
} from '../lib/statsFileStore.mjs'

const DEFAULT_PORT = Number(process.env.STATS_PORT || 3001)
const MAX_PORT_TRIES = 10

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (chunks.length === 0) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function createStatsHandler(port) {
  return async (req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${port}`)

    if (url.pathname !== '/api/stats') {
      sendJson(res, 404, { error: 'Not found' })
      return
    }

    try {
      if (req.method === 'GET') {
        const stats = await readStatsFile()
        const writable = await statsFileWritable()
        sendJson(res, 200, { configured: true, writable, stats })
        return
      }

      if (req.method === 'POST') {
        const body = await readBody(req)
        const key = body.key?.trim()
        if (!key || !isValidStatKey(key)) {
          sendJson(res, 400, { error: 'Invalid stat key' })
          return
        }

        const value = await incrementStatInFile(key)
        if (value == null) {
          sendJson(res, 503, {
            configured: true,
            writable: false,
            error: 'Stats file is read-only in this environment',
          })
          return
        }

        sendJson(res, 200, { configured: true, writable: true, key, value })
        return
      }

      sendJson(res, 405, { error: 'Method not allowed' })
    } catch {
      sendJson(res, 500, { configured: false, error: 'Stats storage unavailable' })
    }
  }
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    const onError = (err) => {
      server.close()
      reject(err)
    }
    server.once('error', onError)
    server.listen(port, () => {
      server.removeListener('error', onError)
      resolve(port)
    })
  })
}

/** Start stats API, trying successive ports if the preferred one is taken. */
export async function startStatsServer(preferredPort = DEFAULT_PORT) {
  for (let offset = 0; offset < MAX_PORT_TRIES; offset += 1) {
    const port = preferredPort + offset
    const server = http.createServer(createStatsHandler(port))
    try {
      await listen(server, port)
      return { server, port }
    } catch (err) {
      if (/** @type {NodeJS.ErrnoException} */ (err).code !== 'EADDRINUSE') {
        throw err
      }
    }
  }

  throw new Error(`No free port found for stats API (${preferredPort}–${preferredPort + MAX_PORT_TRIES - 1})`)
}

/** Reuse an already-running stats API from a previous dev session. */
export async function findExistingStatsPort(startPort = DEFAULT_PORT) {
  for (let offset = 0; offset < MAX_PORT_TRIES; offset += 1) {
    const port = startPort + offset
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/stats`, {
        signal: AbortSignal.timeout(400),
      })
      if (!res.ok) continue
      const data = await res.json()
      if (data && typeof data === 'object' && 'stats' in data) return port
    } catch {
      // not running on this port
    }
  }
  return null
}

const isDirectRun = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url

if (isDirectRun) {
  const { port } = await startStatsServer()
  console.log(`[stats] file store API on http://localhost:${port}/api/stats`)
}
