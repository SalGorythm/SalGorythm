import { useEffect, useState } from 'react'

export type TocHeading = {
  id: string
  text: string
  level: number
}

type TableOfContentsProps = {
  headings: TocHeading[]
  className?: string
}

export function TableOfContents({ headings, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

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
                    : 'border-transparent text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}
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

type MobileTableOfContentsProps = {
  headings: TocHeading[]
}

export function MobileTableOfContents({ headings }: MobileTableOfContentsProps) {
  if (headings.length === 0) return null

  return (
    <details className="mb-8 rounded-xl border border-slate-800/90 bg-slate-900/35 lg:hidden">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-300">
        Table of contents
      </summary>
      <div className="border-t border-slate-800/90 px-4 py-3">
        <ul className="space-y-2 text-sm">
          {headings.map((h) => (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? 12 : 0 }}>
              <a href={`#${h.id}`} className="text-slate-400 hover:text-cyan-300">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}
