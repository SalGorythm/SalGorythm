import type { ReactNode } from 'react'

type ScrollSectionProps = {
  sectionId: string
  children: ReactNode
  className?: string
}

/** Wrapper for scroll-driven animation hooks — preserves child section ids. */
export function ScrollSection({ sectionId, children, className = '' }: ScrollSectionProps) {
  return (
    <div data-scroll-section={sectionId} className={className}>
      {children}
    </div>
  )
}
