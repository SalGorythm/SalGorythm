import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { SceneSectionId } from '../constants/sections'
import { useScrollStore } from '../store/scrollStore'
import { CoreNode } from './CoreNode'
import { EdgeFlow } from './EdgeFlow'
import {
  CLUSTER_FOR_SECTION,
  GRAPH_EDGES,
  GRAPH_NODES,
  NODE_COLORS,
  type GraphNode,
} from './graphData'
import { useParallaxTilt } from './useScrollCamera'

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function navigateToArticle(slug: string) {
  window.location.href = `/writing/${slug}`
}

function SatelliteNode({
  node,
  emissiveBoost,
}: {
  node: GraphNode
  emissiveBoost: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const setHoveredNodeId = useScrollStore((s) => s.setHoveredNodeId)
  const color = NODE_COLORS[node.color]
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const pulse = 1 + Math.sin(t * 2 + node.position[0]) * 0.04 * emissiveBoost
    meshRef.current.scale.setScalar(node.scale * pulse)
  })

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        setHoveredNodeId(node.id)
        document.body.style.cursor = node.sectionId || node.articleSlug || node.routePath ? 'pointer' : 'auto'
      }}
      onPointerOut={() => {
        setHovered(false)
        setHoveredNodeId(null)
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (node.routePath) {
          window.location.assign(node.routePath)
        } else if (node.articleSlug) {
          navigateToArticle(node.articleSlug)
        } else if (node.sectionId) {
          scrollToSection(node.sectionId)
        }
      }}
    >
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.12 + emissiveBoost * 0.4 + (hovered ? 0.2 : 0)}
        roughness={0.35}
        metalness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

export function TopologyGraph() {
  const outerRef = useParallaxTilt(typeof window !== 'undefined' && window.innerWidth >= 1024)
  const groupRef = useRef<THREE.Group>(null)
  const scrollProgress = useScrollStore((s) => s.scrollProgress)
  const activeSection = useScrollStore((s) => s.activeSection) as SceneSectionId
  const reducedMotion = useScrollStore((s) => s.reducedMotion)

  const activeCluster = CLUSTER_FOR_SECTION[activeSection] ?? 'core'
  const edgePulse = 0.4 + scrollProgress * 1.2
  const nodeMap = useMemo(() => new Map(GRAPH_NODES.map((n) => [n.id, n])), [])

  useFrame((_state, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.04
    }
    if (outerRef.current && scrollProgress < 0.08) {
      const scale = 1 + scrollProgress * 4.5
      outerRef.current.scale.setScalar(Math.min(1.35, scale))
    } else if (outerRef.current) {
      outerRef.current.scale.setScalar(1.35)
    }
  })

  const satellites = GRAPH_NODES.filter((n) => n.id !== 'core')

  return (
    <group ref={outerRef}>
      <group ref={groupRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
          <planeGeometry args={[16, 16]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.025} wireframe />
        </mesh>

        <CoreNode />

        {GRAPH_EDGES.map(([from, to]) => {
          const a = nodeMap.get(from)
          const b = nodeMap.get(to)
          if (!a || !b) return null
          const boost =
            a.cluster === activeCluster || b.cluster === activeCluster ? 0.7 + edgePulse * 0.2 : 0.2
          const lineColor = boost > 0.5 ? '#c084fc' : '#22d3ee'
          return (
            <Line
              key={`${from}-${to}`}
              points={[a.position, b.position]}
              color={lineColor}
              lineWidth={1}
              transparent
              opacity={boost}
            />
          )
        })}

        <EdgeFlow />

        {satellites.map((node) => {
          const clusterMatch = node.cluster === activeCluster
          const emissiveBoost = clusterMatch ? 0.9 : node.cluster === 'writing' && activeCluster === 'writing' ? 0.95 : 0.12
          return <SatelliteNode key={node.id} node={node} emissiveBoost={emissiveBoost} />
        })}
      </group>
    </group>
  )
}

export { ScenePerformanceMonitor } from './ScenePerformanceMonitor'
