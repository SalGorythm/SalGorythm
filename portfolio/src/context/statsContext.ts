import { createContext } from 'react'
import type { StatKey } from '../constants/statsKeys'

export type StatsContextValue = {
  configured: boolean
  stats: Partial<Record<StatKey, number>>
  refresh: () => Promise<void>
  increment: (key: StatKey) => Promise<void>
  getCount: (key: StatKey) => number | undefined
}

export const StatsContext = createContext<StatsContextValue | null>(null)
