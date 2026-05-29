/** Section `id` attributes — order matters for scroll-spy highlighting. */
export const SECTION_IDS = [
  'hero',
  'resume',
  'experience',
  'skills',
  'projects',
  'apps',
  'recruiter',
  'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]
