import { useEffect, useState } from 'react'

const NAV_OFFSET = 120

/**
 * Tracks which section id is currently "active" for nav highlighting while scrolling.
 */
export function useActiveSection(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const ordered = [...sectionIds]

    const update = () => {
      const y = window.scrollY + NAV_OFFSET
      let current = ordered[0] ?? ''

      for (const id of ordered) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.offsetTop <= y) {
          current = id
        }
      }
      setActiveId(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionIds])

  return activeId
}
