import { isValidElement, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { slugifyHeading } from './writingLabels'

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractText(node.props.children)
  }
  return ''
}

type ArticleBodyProps = {
  content: string
}

export function ArticleBody({ content }: ArticleBodyProps) {
  const components = useMemo<Components>(
    () => ({
      h2: ({ children, ...props }) => {
        const text = extractText(children)
        return (
          <h2 id={slugifyHeading(text)} {...props}>
            {children}
          </h2>
        )
      },
      h3: ({ children, ...props }) => {
        const text = extractText(children)
        return (
          <h3 id={slugifyHeading(text)} {...props}>
            {children}
          </h3>
        )
      },
      a: ({ children, href, ...props }) => (
        <a
          href={href}
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      ),
      table: ({ children, ...props }) => (
        <div className="article-table-wrap">
          <table {...props}>{children}</table>
        </div>
      ),
    }),
    [],
  )

  return (
    <div className="article-prose prose prose-invert prose-slate max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
