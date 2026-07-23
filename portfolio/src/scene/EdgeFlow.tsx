import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useScrollStore } from '../store/scrollStore'
import { GRAPH_EDGES, GRAPH_NODES } from './graphData'

const MAX_PARTICLES = 800

export function EdgeFlow() {
  const pointsRef = useRef<THREE.Points>(null)
  const scrollProgress = useScrollStore((s) => s.scrollProgress)
  const performanceDegraded = useScrollStore((s) => s.performanceDegraded)
  const reducedMotion = useScrollStore((s) => s.reducedMotion)

  const nodeMap = useMemo(() => new Map(GRAPH_NODES.map((n) => [n.id, n])), [])

  const { geometry, offsets, particlesPerEdge } = useMemo(() => {
    const edges = GRAPH_EDGES.map(([from, to]) => {
      const a = nodeMap.get(from)
      const b = nodeMap.get(to)
      if (!a || !b) return null
      return { a: a.position, b: b.position }
    }).filter(Boolean) as { a: [number, number, number]; b: [number, number, number] }[]

    const perEdge = Math.min(12, Math.floor(MAX_PARTICLES / Math.max(edges.length, 1)))
    const count = edges.length * perEdge
    const positions = new Float32Array(count * 3)
    const offs = new Float32Array(count)

    let idx = 0
    for (const edge of edges) {
      for (let p = 0; p < perEdge; p++) {
        const t = p / perEdge
        positions[idx * 3] = edge.a[0] + (edge.b[0] - edge.a[0]) * t
        positions[idx * 3 + 1] = edge.a[1] + (edge.b[1] - edge.a[1]) * t
        positions[idx * 3 + 2] = edge.a[2] + (edge.b[2] - edge.a[2]) * t
        offs[idx] = (idx * 0.618033988749895) % 1
        idx++
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geometry: geo, offsets: offs, particlesPerEdge: perEdge }
  }, [nodeMap])

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion || performanceDegraded) return
    const attr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
    const speed = 0.25 + scrollProgress * 0.8
    const t = state.clock.elapsedTime

    let idx = 0
    for (const [from, to] of GRAPH_EDGES) {
      const a = nodeMap.get(from)
      const b = nodeMap.get(to)
      if (!a || !b) continue
      for (let p = 0; p < particlesPerEdge; p++) {
        const phase = (offsets[idx]! + t * speed) % 1
        attr.setXYZ(
          idx,
          a.position[0] + (b.position[0] - a.position[0]) * phase,
          a.position[1] + (b.position[1] - a.position[1]) * phase,
          a.position[2] + (b.position[2] - a.position[2]) * phase,
        )
        idx++
      }
    }
    attr.needsUpdate = true
  })

  if (reducedMotion || performanceDegraded) return null

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#22d3ee"
        size={0.06}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
