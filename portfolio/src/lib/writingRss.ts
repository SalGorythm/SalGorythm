import { ARTICLES } from '../data/articles'

const SITE_ORIGIN = 'https://salgorythm.com'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildWritingRssXml(): string {
  const items = [...ARTICLES]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((article) => {
      const url = `${SITE_ORIGIN}/writing/${article.slug}`
      const pubDate = new Date(`${article.date}T12:00:00Z`).toUTCString()
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SalGorythm Writing</title>
    <link>${SITE_ORIGIN}/writing</link>
    <description>Production ML notes on agents, prompting, Python, and deployment.</description>
    <language>en-gb</language>
    <atom:link href="${SITE_ORIGIN}/writing.rss" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}
