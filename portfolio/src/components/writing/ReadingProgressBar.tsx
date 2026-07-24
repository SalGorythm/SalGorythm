import { useEffect, useState, type RefObject } from 'react'

const HEADER_OFFSET_PX = 64

type ReadingProgressBarProps = {
  targetRef: RefObject<HTMLElement | null>
}

export function ReadingProgressBar({ targetRef }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const update = () => {
      const el = targetRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const articleStart = window.scrollY + rect.top
      const articleEnd = articleStart + el.offsetHeight
      const scrollStart = articleStart - HEADER_OFFSET_PX
      const scrollEnd = articleEnd - window.innerHeight

      if (scrollEnd <= scrollStart) {
        setProgress(window.scrollY >= scrollStart ? 1 : 0)
        return
      }

      const next = (window.scrollY - scrollStart) / (scrollEnd - scrollStart)
      setProgress(Math.min(1, Math.max(0, next)))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [targetRef])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-16 z-[90] h-0.5 bg-slate-800/60"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
