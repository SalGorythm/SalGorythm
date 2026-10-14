import { useEffect } from 'react'

const DEFAULT_TITLE = 'Salman Akhatar | SalGorythm — Portfolio'

/** Client-side title + description for non-article routes. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | SalGorythm`
    if (description) {
      document.head.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title, description])
}
