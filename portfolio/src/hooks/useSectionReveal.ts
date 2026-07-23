import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

/** Stagger-reveal cards inside a section when scrolled into view. */
export function useSectionReveal(sectionSelector: string, cardSelector: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const section = document.querySelector(sectionSelector)
    if (!section) return

    const cards = section.querySelectorAll(cardSelector)
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [sectionSelector, cardSelector, enabled])
}
