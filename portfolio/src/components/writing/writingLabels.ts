import type { WritingTag } from '../../constants/sections'
import { WRITING_TAGS } from '../../constants/sections'

export const TAG_LABELS: Record<WritingTag, string> = {
  prompting: 'Prompting',
  agents: 'Agents',
  loops: 'Loops',
  'interview-prep': 'Interview prep',
  python: 'Python',
  deployment: 'Deployment',
  claude: 'Claude',
  cursor: 'Cursor',
}

export function formatArticleDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function writingTagHref(tag: WritingTag): string {
  return `/writing?tag=${encodeURIComponent(tag)}`
}

export function parseWritingTagParam(value: string | null): WritingTag | null {
  if (!value) return null
  return (WRITING_TAGS as readonly string[]).includes(value) ? (value as WritingTag) : null
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

/** True when the publish date falls within the last N calendar days (inclusive). */
export function isArticleNew(dateIso: string, withinDays = 30): boolean {
  const published = new Date(`${dateIso}T12:00:00`)
  if (Number.isNaN(published.getTime())) return false

  const now = new Date()
  const ageMs = now.getTime() - published.getTime()
  const withinMs = withinDays * 86_400_000
  return ageMs >= 0 && ageMs <= withinMs
}

export type TocHeading = {
  id: string
  text: string
  level: number
}
