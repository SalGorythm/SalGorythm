/** Section `id` attributes — order matters for scroll-spy highlighting. */
export const SECTION_IDS = [
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
  'apps',
  'recruiter',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Sections that drive 3D camera + cluster focus. */
export const SCENE_SECTION_IDS = [
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
] as const

export type SceneSectionId = (typeof SCENE_SECTION_IDS)[number]

/** Keyboard shortcuts 1–9 for major sections (4 opens /writing). */
export const KEYBOARD_SECTION_JUMPS: {
  key: string
  id?: SectionId
  path?: string
  label: string
}[] = [
  { key: '1', id: 'hero', label: 'Home' },
  { key: '2', id: 'case-studies', label: 'Case studies' },
  { key: '3', id: 'live-demos', label: 'Live demos' },
  { key: '4', path: '/writing', label: 'Writing' },
  { key: '5', id: 'experience', label: 'Experience' },
  { key: '6', id: 'projects', label: 'Projects' },
  { key: '7', id: 'my-apps', label: 'Hobbies' },
  { key: '8', id: 'resume', label: 'Résumé' },
  { key: '9', id: 'contact', label: 'Contact' },
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
