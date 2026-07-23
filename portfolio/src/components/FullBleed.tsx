import type { ReactNode } from 'react'

type FullBleedProps = {
  children: ReactNode
  className?: string
  /** Inner content max width */
  innerClassName?: string
}

/**
 * Full-viewport width background band with centered content.
 * Eliminates empty gutters beside max-w-* sections on ultrawide displays.
 */
export function FullBleed({ children, className = '', innerClassName = '' }: FullBleedProps) {
  return (
    <div className={`full-bleed ${className}`}>
      <div className={`page-container ${innerClassName}`}>{children}</div>
    </div>
  )
}
