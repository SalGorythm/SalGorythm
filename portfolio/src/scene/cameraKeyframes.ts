import type { SceneSectionId } from '../constants/sections'

export type CameraKeyframe = {
  position: [number, number, number]
  lookAt: [number, number, number]
}

export const CAMERA_KEYFRAMES: Record<SceneSectionId, CameraKeyframe> = {
  hero: { position: [0, 1.8, 8.5], lookAt: [0, 0, 0] },
  credibility: { position: [0.6, 1.5, 7.8], lookAt: [0.2, 0, 0] },
  'case-studies': { position: [-2.2, 2.2, 6.8], lookAt: [-1.2, 0.2, 0] },
  'live-demos': { position: [2.4, 1.6, 6.5], lookAt: [1.6, 0, -0.5] },
  'engineering-log': { position: [0.2, 2.8, 6.2], lookAt: [0, 0.5, 0] },
  about: { position: [0, 1.2, 7.5], lookAt: [0, 0, 0] },
  experience: { position: [-1.8, 1, 7.2], lookAt: [-0.9, -0.3, 0] },
  projects: { position: [1.8, 2, 6.5], lookAt: [0.9, 0, 0] },
  skills: { position: [0, 3.2, 7], lookAt: [0, 0, 0] },
  'my-apps': { position: [2.2, 0.6, 7], lookAt: [1.3, 0.2, 0] },
  objections: { position: [0, 0.8, 8.5], lookAt: [0, 0, 0] },
  resume: { position: [0, 0.4, 9.5], lookAt: [0, 0, 0] },
  contact: { position: [0, 1.6, 6.5], lookAt: [0, 0.3, 0] },
}

export const SECTION_SCROLL_STOPS: SceneSectionId[] = [
  'hero',
  'credibility',
  'case-studies',
  'live-demos',
  'engineering-log',
  'about',
  'experience',
  'projects',
  'skills',
  'my-apps',
  'objections',
  'resume',
  'contact',
]

/** Map scroll progress 0–1 to blended camera keyframe index. */
export function progressToSectionIndex(progress: number, count: number) {
  if (count <= 1) return 0
  return Math.min(count - 1, Math.max(0, progress * (count - 1)))
}

/** Build Catmull-Rom spline through section camera positions. */
export function getSplinePoint(t: number): { position: [number, number, number]; lookAt: [number, number, number] } {
  const stops = SECTION_SCROLL_STOPS
  const floatIndex = progressToSectionIndex(t, stops.length)
  const i0 = Math.floor(floatIndex)
  const i1 = Math.min(stops.length - 1, i0 + 1)
  const localT = floatIndex - i0
  const k0 = CAMERA_KEYFRAMES[stops[i0]!]
  const k1 = CAMERA_KEYFRAMES[stops[i1]!]
  return {
    position: [
      k0.position[0] + (k1.position[0] - k0.position[0]) * localT,
      k0.position[1] + (k1.position[1] - k0.position[1]) * localT,
      k0.position[2] + (k1.position[2] - k0.position[2]) * localT,
    ],
    lookAt: [
      k0.lookAt[0] + (k1.lookAt[0] - k0.lookAt[0]) * localT,
      k0.lookAt[1] + (k1.lookAt[1] - k0.lookAt[1]) * localT,
      k0.lookAt[2] + (k1.lookAt[2] - k0.lookAt[2]) * localT,
    ],
  }
}
