import { ARTICLES, getArticleMeta, type ArticleMeta } from '../data/articles'

/** Eager raw imports — reliable in Vite dev + production (lazy glob loaders often fail). */
const rawModules = import.meta.glob('../content/articles/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string | { default: string }>

export type ParsedArticle = ArticleMeta & {
  content: string
}

function normalizeRaw(mod: string | { default: string } | undefined): string {
  if (!mod) return ''
  if (typeof mod === 'string') return mod
  return mod.default ?? ''
}

function slugFromPath(path: string) {
  const match = path.match(/\/([^/]+)\.md$/)
  return match?.[1] ?? ''
}

const RAW_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(rawModules).map(([path, mod]) => [slugFromPath(path), normalizeRaw(mod)]),
)

export function getArticleBySlug(slug: string): ParsedArticle | null {
  const meta = getArticleMeta(slug)
  if (!meta) return null
  const raw = RAW_BY_SLUG[slug]
  if (!raw) return { ...meta, content: '_Article file missing._' }
  return { ...meta, content: raw.trim() }
}

export function getAllArticlesParsed(): ParsedArticle[] {
  return ARTICLES.map((meta) => {
    const raw = RAW_BY_SLUG[meta.slug] ?? ''
    return { ...meta, content: raw.trim() }
  }).sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** @deprecated use getArticleBySlug — kept for async callers */
export async function loadArticleBySlug(slug: string) {
  return getArticleBySlug(slug)
}

export async function loadAllArticlesParsed() {
  return getAllArticlesParsed()
}

export function getAdjacentArticles(slug: string, sorted?: ParsedArticle[]) {
  const list = sorted ?? getAllArticlesParsed()
  const idx = list.findIndex((a) => a.slug === slug)
  return {
    prev: idx > 0 ? list[idx - 1]! : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1]! : null,
  }
}

export function extractHeadings(markdown: string) {
  const headings: { id: string; text: string; level: number }[] = []
  for (const line of markdown.split('\n')) {
    const m = line.match(/^(#{2,3})\s+(.+)$/)
    if (!m) continue
    const text = m[2]!.trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    headings.push({ id, text, level: m[1]!.length })
  }
  return headings
}
