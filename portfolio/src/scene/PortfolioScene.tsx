import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useMemo } from 'react'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useScrollStore } from '../store/scrollStore'
import { ScenePerformanceMonitor } from './ScenePerformanceMonitor'
import { TopologyGraph } from './TopologyGraph'
import { ScrollCamera } from './useScrollCamera'
import { useSceneDpr } from './useSceneDpr'

function SceneBloom() {
  const performanceDegraded = useScrollStore((s) => s.performanceDegraded)
  const reducedMotion = useScrollStore((s) => s.reducedMotion)
  const enableBloom = useMemo(() => {
    if (performanceDegraded || reducedMotion) return false
    if (typeof window === 'undefined') return false
    return window.innerWidth >= 1024
  }, [performanceDegraded, reducedMotion])

  if (!enableBloom) return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.95} luminanceSmoothing={0.3} intensity={0.22} mipmapBlur />
    </EffectComposer>
  )
}

function SceneContents({ onPerformanceDecline }: { onPerformanceDecline: () => void }) {
  return (
    <>
      <ScenePerformanceMonitor onDecline={onPerformanceDecline} />
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 10, 28]} />
      <ambientLight intensity={0.18} />
      <pointLight position={[5, 8, 5]} intensity={0.75} color="#22d3ee" />
      <pointLight position={[-5, 3, -3]} intensity={0.45} color="#c084fc" />
      <pointLight position={[4, 1, 2]} intensity={0.3} color="#fbbf24" />
      <ScrollCamera />
      <TopologyGraph />
      <SceneBloom />
    </>
  )
}

function PortfolioScene({ dpr, onPerformanceDecline }: { dpr: number; onPerformanceDecline: () => void }) {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 100, position: [0, 1.8, 8.5] }}
      dpr={dpr}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <SceneContents onPerformanceDecline={onPerformanceDecline} />
      </Suspense>
    </Canvas>
  )
}

export function PortfolioSceneInner() {
  const setPerformanceDegraded = useScrollStore((s) => s.setPerformanceDegraded)
  const disableWebGL = useCallback(() => {
    setPerformanceDegraded(true)
    useScrollStore.getState().setWebglEnabled(false)
    sessionStorage.setItem('salgorythm-webgl-disabled', '1')
  }, [setPerformanceDegraded])

  const performanceDegraded = useScrollStore((s) => s.performanceDegraded)
  const dpr = useSceneDpr()
  const effectiveDpr = performanceDegraded ? 1 : dpr

  return <PortfolioScene dpr={effectiveDpr} onPerformanceDecline={disableWebGL} />
}
