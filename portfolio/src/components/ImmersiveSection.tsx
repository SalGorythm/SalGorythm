import type { ReactNode } from 'react'

type ImmersiveSectionProps = {
  children: ReactNode
  /** wide = max-w-6xl, narrow = max-w-3xl, full = no inner cap */
  width?: 'wide' | 'narrow' | 'full'
  className?: string
  /** Less glass opacity for hero */
  variant?: 'glass' | 'solid' | 'none'
}

const WIDTH = {
  wide: 'max-w-7xl',
  narrow: 'max-w-3xl',
  full: 'max-w-none',
} as const

const VARIANT = {
  glass:
    'rounded-2xl border border-slate-800/60 bg-slate-950/55 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md',
  solid: 'rounded-2xl border border-slate-800/80 bg-slate-950/85',
  none: '',
} as const

/** Glass panel scrolling over full-viewport 3D canvas. */
export function ImmersiveSection({
  children,
  width = 'wide',
  className = '',
  variant = 'glass',
}: ImmersiveSectionProps) {
  return (
    <div className={`relative z-10 py-16 ${className}`}>
      <div className={`mx-auto ${WIDTH[width]} ${VARIANT[variant]} ${variant !== 'none' ? 'p-6 sm:p-8' : ''}`}>
        {children}
      </div>
    </div>
  )
}
