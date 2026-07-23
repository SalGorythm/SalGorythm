import { useEffect, useState } from 'react'
import { useScrollStore } from '../store/scrollStore'

const NAV_OFFSET = 120

/**
 * Tracks which section id is currently "active" for nav highlighting while scrolling.
 * When `enabled` is false, listeners are not attached (e.g. on non-portfolio routes).
 */
export function useActiveSection(sectionIds: readonly string[], enabled = true) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  const setStoreActiveSection = useScrollStore((s) => s.setActiveSection)

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) {
      return
    }

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
      setStoreActiveSection(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionIds, enabled, setStoreActiveSection])

  if (!enabled || sectionIds.length === 0) {
    return ''
  }
  return activeId
}
