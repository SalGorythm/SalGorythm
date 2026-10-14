/** Eager raw imports — same pattern as `lib/articles.ts`. */
const rawModules = import.meta.glob('../content/apps/*/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string | { default: string }>

export type AppLegalKind = 'privacy' | 'terms'

const RAW_BY_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(rawModules).map(([path, mod]) => {
    const [, kind = '', id = ''] = path.match(/\/apps\/([^/]+)\/([^/]+)\.md$/) ?? []
    return [`${kind}/${id}`, typeof mod === 'string' ? mod : (mod.default ?? '')]
  }),
)

/** `content/apps/<kind>/<id>.md`, or null when the app has no such document. */
export function getAppLegalDoc(kind: AppLegalKind, id: string): string | null {
  return RAW_BY_KEY[`${kind}/${id}`]?.trim() || null
}
