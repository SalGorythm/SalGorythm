import type { WritingTag } from '../../constants/sections'

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

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}
