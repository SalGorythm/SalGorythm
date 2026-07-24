import { isValidElement, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { PromptCodeBlock } from './PromptCodeBlock'
import { slugifyHeading } from './writingLabels'

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractText(node.props.children)
  }
  return ''
}

function parseCodeBlock(children: React.ReactNode): {
  language: string
  code: string
  inner: React.ReactNode
} {
  if (isValidElement<{ className?: string; children?: React.ReactNode }>(children)) {
    const className = children.props.className ?? ''
    const match = /language-([\w-]+)/.exec(className)
    return {
      language: match?.[1] ?? 'text',
      code: extractText(children.props.children),
      inner: children,
    }
  }

  return {
    language: 'text',
    code: extractText(children),
    inner: children,
  }
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
      pre: ({ children }) => {
        const { language, code, inner } = parseCodeBlock(children)
        return (
          <PromptCodeBlock language={language} code={code}>
            {inner}
          </PromptCodeBlock>
        )
      },
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
