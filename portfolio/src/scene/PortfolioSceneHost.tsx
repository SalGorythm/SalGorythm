import { lazy, Suspense } from 'react'
import { useScrollStore } from '../store/scrollStore'
import { SceneFallback } from './SceneFallback'

const PortfolioSceneInner = lazy(() =>
  import('./PortfolioScene').then((m) => ({ default: m.PortfolioSceneInner })),
)

type PortfolioSceneHostProps = {
  /** Force static fallback (mobile hero inline). */
  forceFallback?: boolean
}

/** Full-viewport fixed WebGL stage behind scrolling DOM. */
export function PortfolioSceneHost({ forceFallback = false }: PortfolioSceneHostProps) {
  const webglEnabled = useScrollStore((s) => s.webglEnabled)
  const reducedMotion = useScrollStore((s) => s.reducedMotion)
  const hoveredNodeId = useScrollStore((s) => s.hoveredNodeId)

  const useWebGL = webglEnabled && !reducedMotion && !forceFallback

  if (!useWebGL) {
    return (
      <div className="immersive-bg-fallback fixed inset-0 z-0" aria-hidden>
        <SceneFallback className="h-full w-full rounded-none border-0 opacity-40" />
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-0" aria-hidden>
        <Suspense fallback={<div className="immersive-bg-fallback h-full w-full" />}>
          <PortfolioSceneInner />
        </Suspense>
      </div>
      {hoveredNodeId ? (
        <div
          className="pointer-events-none fixed bottom-6 right-6 z-[5] rounded-lg border border-slate-700/80 bg-slate-950/90 px-3 py-1.5 font-mono text-[11px] text-cyan-300"
          aria-hidden
        >
          {hoveredNodeId.replace(/^writing-/, '').replace(/-/g, ' ')}
        </div>
      ) : null}
    </>
  )
}
