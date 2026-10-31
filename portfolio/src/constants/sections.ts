/** Section `id` attributes — order matters for scroll-spy highlighting. */
export const SECTION_IDS = [
  'hero',
  'sequence',
  'missions',
  'payload',
  'transmissions',
  'ground',
  'crew',
  'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Sections that drive 3D camera + cluster focus. */
export const SCENE_SECTION_IDS = [
  'hero',
  'credibility',
  'about',
  'experience',
  'skills',
  'live-demos',
  'my-apps',
  'contact',
] as const

export type SceneSectionId = (typeof SCENE_SECTION_IDS)[number]

/** Keyboard shortcuts 1–8 for major sections (5 opens /writing). */
export const KEYBOARD_SECTION_JUMPS: {
  key: string
  id?: SectionId
  path?: string
  label: string
}[] = [
  { key: '1', id: 'hero', label: 'Home' },
  { key: '2', id: 'sequence', label: 'Launch sequence' },
  { key: '3', id: 'missions', label: 'Missions' },
  { key: '4', id: 'transmissions', label: 'Transmissions' },
  { key: '5', path: '/writing', label: 'Writing' },
  { key: '6', id: 'ground', label: 'Services' },
  { key: '7', id: 'crew', label: 'Crew record' },
  { key: '8', id: 'contact', label: 'Contact' },
]

export const WRITING_TAGS = [
  'prompting',
  'agents',
  'loops',
  'interview-prep',
  'python',
  'deployment',
  'claude',
  'cursor',
] as const

export type WritingTag = (typeof WRITING_TAGS)[number]
