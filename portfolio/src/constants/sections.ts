/** Section `id` attributes — order matters for scroll-spy highlighting. */
export const SECTION_IDS = [
  'hero',
  'case-studies',
  'live-demos',
  'engineering-log',
  'experience',
  'projects',
  'skills',
  'my-apps',
  'resume',
  'contact',
  'apps',
  'recruiter',
] as const

export type SectionId = (typeof SECTION_IDS)[number]
