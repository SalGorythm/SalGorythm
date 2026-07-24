import { useTocScrollSpy } from '../../hooks/useTocScrollSpy'
import type { TocHeading } from './writingLabels'

export type { TocHeading }

type TableOfContentsProps = {
  headings: TocHeading[]
  className?: string
}

export function TableOfContents({ headings, className = '' }: TableOfContentsProps) {
  const activeId = useTocScrollSpy(headings)

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className={className}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">On this page</p>
      <ul className="mt-3 space-y-1.5 border-l border-slate-800/90">
        {headings.map((h) => {
          const active = activeId === h.id
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block border-l-2 py-1 text-sm transition ${
                  h.level === 3 ? 'pl-5' : 'pl-3'
                } ${
                  active
                    ? 'border-amber-400/80 text-amber-100'
                    : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
                aria-current={active ? 'location' : undefined}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
