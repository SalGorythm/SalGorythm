import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { STAT_KEYS, type StatKey } from '../constants/statsKeys'
import { incrementStat, trackOncePerSession } from '../lib/statsApi'
import { getStatsSnapshot, patchStat, refreshStats, subscribeStats } from '../lib/statsStore'
import { StatsContext, type StatsContextValue } from './statsContext'

export function StatsProvider({ children }: { children: ReactNode }) {
  const { configured, stats } = useSyncExternalStore(subscribeStats, getStatsSnapshot, getStatsSnapshot)

  const refresh = useCallback(async () => {
    await refreshStats()
  }, [])

  const increment = useCallback(async (key: StatKey) => {
    const value = await incrementStat(key)
    if (value != null) patchStat(key, value)
  }, [])

  const getCount = useCallback(
    (key: StatKey) => stats[key],
    [stats],
  )

  useEffect(() => {
    trackOncePerSession('sg-stat-visitor', () => {
      void increment(STAT_KEYS.VISITOR)
    })
  }, [increment])

  const value = useMemo<StatsContextValue>(
    () => ({ configured, stats, refresh, increment, getCount }),
    [configured, stats, refresh, increment, getCount],
  )

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}
