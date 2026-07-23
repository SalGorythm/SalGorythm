import { createContext } from 'react'

export type StatsContextValue = {
  configured: boolean
  stats: Partial<Record<string, number>>
  refresh: () => Promise<void>
  increment: (key: string) => Promise<number | null>
  getCount: (key: string) => number | undefined
}

export const StatsContext = createContext<StatsContextValue | null>(null)
