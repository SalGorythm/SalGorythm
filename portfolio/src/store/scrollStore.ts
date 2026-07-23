import { create } from 'zustand'
import type { SectionId } from '../constants/sections'

type ScrollStore = {
  scrollProgress: number
  activeSection: SectionId | string
  webglEnabled: boolean
  reducedMotion: boolean
  performanceDegraded: boolean
  hoveredNodeId: string | null
  setScrollProgress: (progress: number) => void
  setActiveSection: (id: SectionId | string) => void
  setWebglEnabled: (enabled: boolean) => void
  setReducedMotion: (reduced: boolean) => void
  setPerformanceDegraded: (degraded: boolean) => void
  setHoveredNodeId: (id: string | null) => void
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollProgress: 0,
  activeSection: 'hero',
  webglEnabled: true,
  reducedMotion: false,
  performanceDegraded: false,
  hoveredNodeId: null,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setWebglEnabled: (webglEnabled) => set({ webglEnabled }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setPerformanceDegraded: (performanceDegraded) => set({ performanceDegraded }),
  setHoveredNodeId: (hoveredNodeId) => set({ hoveredNodeId }),
}))
