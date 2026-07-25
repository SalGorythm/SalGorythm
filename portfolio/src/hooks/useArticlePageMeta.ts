import { useEffect } from 'react'
import type { ArticleMeta } from '../data/articles'

const SITE_ORIGIN = 'https://salgorythm.com'
const DEFAULT_TITLE = 'Salman Akhatar | SalGorythm — Portfolio'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Client-side title/OG updates for in-app navigation (crawlers use build-time HTML). */
export function useArticlePageMeta(article: ArticleMeta) {
  useEffect(() => {
    const url = `${SITE_ORIGIN}/writing/${article.slug}`

    document.title = `${article.title} | SalGorythm`
    upsertMeta('name', 'description', article.shareBlurb)
    upsertMeta('property', 'og:title', article.title)
    upsertMeta('property', 'og:description', article.shareBlurb)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', 'article')
    upsertMeta('name', 'twitter:card', 'summary')
    upsertMeta('name', 'twitter:title', article.title)
    upsertMeta('name', 'twitter:description', article.shareBlurb)

    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [article])
}
