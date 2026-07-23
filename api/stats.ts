import {
  incrementStatInFile,
  isValidStatKey,
  readStatsFile,
  statsFileWritable,
} from '../lib/statsFileStore.mjs'

export async function GET() {
  try {
    const stats = await readStatsFile()
    const writable = await statsFileWritable()
    return Response.json({ configured: true, writable, stats })
  } catch {
    return Response.json({ configured: false, writable: false, stats: {} })
  }
}

export async function POST(request: Request) {
  let body: { key?: string }
  try {
    body = (await request.json()) as { key?: string }
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const key = body.key?.trim()
  if (!key || !isValidStatKey(key)) {
    return Response.json({ error: 'Invalid stat key' }, { status: 400 })
  }

  try {
    const value = await incrementStatInFile(key)
    if (value == null) {
      return Response.json(
        { configured: true, writable: false, error: 'Stats file is read-only in this environment' },
        { status: 503 },
      )
    }
    return Response.json({ configured: true, writable: true, key, value })
  } catch {
    return Response.json({ configured: false, error: 'Stats storage unavailable' }, { status: 503 })
  }
}
