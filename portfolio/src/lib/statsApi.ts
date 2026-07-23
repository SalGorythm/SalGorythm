import type { StatKey } from '../constants/statsKeys'

export type StatsResponse = {
  configured: boolean
  stats: Partial<Record<string, number>>
}

export async function fetchStats(): Promise<StatsResponse> {
  try {
    const res = await fetch('/api/stats', { headers: { Accept: 'application/json' } })
    if (!res.ok) return { configured: false, stats: {} }
    return (await res.json()) as StatsResponse
  } catch {
    return { configured: false, stats: {} }
  }
}

export async function incrementStat(key: StatKey | string): Promise<number | null> {
  try {
    const res = await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ key }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { value?: number }
    return typeof data.value === 'number' ? data.value : null
  } catch {
    return null
  }
}

/** Once per browser session (sessionStorage). */
export function trackOncePerSession(storageKey: string, fn: () => void): void {
  try {
    if (sessionStorage.getItem(storageKey)) return
    sessionStorage.setItem(storageKey, '1')
    fn()
  } catch {
    fn()
  }
}

const CLAP_PREFIX = 'sg-article-clap-'

export function hasClappedArticle(slug: string): boolean {
  try {
    return localStorage.getItem(`${CLAP_PREFIX}${slug}`) === '1'
  } catch {
    return false
  }
}

export function markArticleClapped(slug: string): void {
  try {
    localStorage.setItem(`${CLAP_PREFIX}${slug}`, '1')
  } catch {
    // ignore quota / private mode
  }
}
