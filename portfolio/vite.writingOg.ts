import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { ARTICLES } from './src/data/articles'

const rootDir = dirname(fileURLToPath(import.meta.url))
const SITE_ORIGIN = 'https://salgorythm.com'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function injectArticleMeta(html: string, article: (typeof ARTICLES)[number]): string {
  const url = `${SITE_ORIGIN}/writing/${article.slug}`
  const title = `${article.title} | SalGorythm`
  const description = article.shareBlurb

  let next = html
  next = next.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(article.title)}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="article" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(article.title)}" />`,
  )

  if (!next.includes('property="og:url"')) {
    next = next.replace(
      /<meta\s+property="og:type"\s+content="article"\s*\/>/,
      `<meta property="og:type" content="article" />\n    <meta property="og:url" content="${escapeHtml(url)}" />\n    <meta name="twitter:description" content="${escapeHtml(description)}" />`,
    )
  }

  return next
}

/** Emit /writing/<slug>/index.html with article OG tags so LinkedIn/X crawlers see the blurb. */
export function writingOgPlugin(): Plugin {
  return {
    name: 'writing-og',
    closeBundle() {
      const distDir = resolve(rootDir, 'dist')
      const indexPath = resolve(distDir, 'index.html')
      let baseHtml: string
      try {
        baseHtml = readFileSync(indexPath, 'utf8')
      } catch {
        return
      }

      for (const article of ARTICLES) {
        const outDir = resolve(distDir, 'writing', article.slug)
        mkdirSync(outDir, { recursive: true })
        writeFileSync(resolve(outDir, 'index.html'), injectArticleMeta(baseHtml, article), 'utf8')
      }
    },
  }
}
