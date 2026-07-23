import { PerformanceMonitor } from '@react-three/drei'

export function ScenePerformanceMonitor({ onDecline }: { onDecline: () => void }) {
  return (
    <PerformanceMonitor
      bounds={() => [30, 58]}
      flipflops={2}
      onDecline={() => {
        onDecline()
      }}
    />
  )
}
