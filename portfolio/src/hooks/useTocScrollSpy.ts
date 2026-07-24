import { useEffect, useState } from 'react'
import type { TocHeading } from '../components/writing/writingLabels'

const HEADER_OFFSET_PX = 96

export function useTocScrollSpy(headings: TocHeading[]): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (headings.length === 0) return

    const updateActive = () => {
      let current = headings[0]?.id ?? ''

      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= HEADER_OFFSET_PX + 12) {
          current = heading.id
        }
      }

      setActiveId(current)
    }

    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive, { passive: true })
    const frame = window.requestAnimationFrame(updateActive)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [headings])

  return headings.length === 0 ? '' : activeId
}
