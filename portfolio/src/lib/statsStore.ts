import { fetchStats } from './statsApi'

type StatsSnapshot = {
  configured: boolean
  stats: Partial<Record<string, number>>
}

const emptySnapshot: StatsSnapshot = { configured: false, stats: {} }

let snapshot: StatsSnapshot = emptySnapshot
let loadStarted = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function getStatsSnapshot(): StatsSnapshot {
  return snapshot
}

export function subscribeStats(listener: () => void): () => void {
  listeners.add(listener)
  if (!loadStarted) {
    loadStarted = true
    void fetchStats().then((data) => {
      snapshot = { configured: data.configured, stats: data.stats }
      emit()
    })
  }
  return () => listeners.delete(listener)
}

export async function refreshStats(): Promise<void> {
  const data = await fetchStats()
  snapshot = { configured: data.configured, stats: data.stats }
  emit()
}

export function patchStat(key: string, value: number): void {
  snapshot = {
    configured: true,
    stats: { ...snapshot.stats, [key]: value },
  }
  emit()
}
