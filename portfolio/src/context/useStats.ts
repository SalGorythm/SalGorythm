import { useContext } from 'react'
import { StatsContext } from './statsContext'

export function useStats() {
  const ctx = useContext(StatsContext)
  if (!ctx) throw new Error('useStats must be used within StatsProvider')
  return ctx
}
