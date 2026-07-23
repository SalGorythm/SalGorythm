import { useEffect } from 'react'
import { KEYBOARD_SECTION_JUMPS } from '../constants/sections'

export function useKeyboardSectionJumps(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const jump = KEYBOARD_SECTION_JUMPS.find((j) => j.key === e.key)
      if (!jump) return
      e.preventDefault()
      if (jump.path) {
        window.location.assign(jump.path)
        return
      }
      if (jump.id) {
        document.getElementById(jump.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enabled])
}
