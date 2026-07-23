import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useScrollStore } from '../store/scrollStore'
import { getSplinePoint } from './cameraKeyframes'

const _targetPos = new THREE.Vector3()
const _lookAt = new THREE.Vector3()

export function ScrollCamera() {
  const { camera } = useThree()
  const scrollProgress = useScrollStore((s) => s.scrollProgress)
  const reducedMotion = useScrollStore((s) => s.reducedMotion)
  const lookRef = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const { position, lookAt } = getSplinePoint(scrollProgress)
    _targetPos.set(...position)
    _lookAt.set(...lookAt)
    camera.position.lerp(_targetPos, reducedMotion ? 1 : 0.07)
    lookRef.current.lerp(_lookAt, reducedMotion ? 1 : 0.07)
    camera.lookAt(lookRef.current)
  })

  return null
}

export function useParallaxTilt(enabled: boolean) {
  const groupRef = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])

  useFrame(() => {
    if (!groupRef.current || !enabled) return
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.current.x * 0.06,
      0.06,
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.current.y * 0.05,
      0.06,
    )
  })

  return groupRef
}
