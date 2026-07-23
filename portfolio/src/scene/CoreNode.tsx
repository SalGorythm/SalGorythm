import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useScrollStore } from '../store/scrollStore'

/** Wireframe icosahedron core with inner emissive sphere. */
export function CoreNode() {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const scrollProgress = useScrollStore((s) => s.scrollProgress)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.08
    }
    if (innerRef.current) {
      const scale = 0.42 + scrollProgress * 0.08 + Math.sin(t * 2) * 0.02
      innerRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#22d3ee"
          emissiveIntensity={0.45}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
    </group>
  )
}
