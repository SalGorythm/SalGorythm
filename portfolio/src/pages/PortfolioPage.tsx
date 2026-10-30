import { useEffect, useState } from 'react'
import { AIChatSim } from '../components/AIChatSim'
import { AboutSection } from '../components/AboutSection'
import { ContactForm } from '../components/ContactForm'
import { CredibilityStrip } from '../components/CredibilityStrip'
import { ExperienceTimeline } from '../components/ExperienceTimeline'
import { Hero } from '../components/Hero'
import { LiveDemoStrip } from '../components/LiveDemoStrip'
import { MyAppsSection } from '../components/MyAppsSection'
import { ScrollSection } from '../components/ScrollSection'
import { SkillsTerminal } from '../components/SkillsTerminal'
import { SmoothScrollProvider } from '../components/SmoothScrollProvider'
import { useKeyboardSectionJumps } from '../hooks/useKeyboardSectionJumps'
import { usePortfolioScrollInit } from '../hooks/usePortfolioScrollInit'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useWebGLCapability } from '../hooks/useWebGLCapability'
import { PortfolioSceneHost } from '../scene/PortfolioSceneHost'

function useIsMobileViewport() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : true,
  )
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 1024)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return mobile
}

export function PortfolioPage() {
  const reducedMotion = useReducedMotion()
  const { webglEnabled } = useWebGLCapability(reducedMotion)
  usePortfolioScrollInit({ reducedMotion, webglEnabled })
  useKeyboardSectionJumps(true)

  const isMobile = useIsMobileViewport()

  return (
    <SmoothScrollProvider enabled>
      <PortfolioSceneHost forceFallback={isMobile || reducedMotion || !webglEnabled} />

      <div className="relative z-10">
        <main>
          <Hero />
          <ScrollSection sectionId="credibility">
            <CredibilityStrip />
          </ScrollSection>
          <ScrollSection sectionId="about">
            <AboutSection />
          </ScrollSection>
          <ScrollSection sectionId="experience">
            <ExperienceTimeline />
          </ScrollSection>
          <ScrollSection sectionId="skills">
            <SkillsTerminal />
          </ScrollSection>
          <ScrollSection sectionId="live-demos">
            <LiveDemoStrip />
          </ScrollSection>
          <ScrollSection sectionId="my-apps">
            <MyAppsSection />
          </ScrollSection>
          <ScrollSection sectionId="contact">
            <ContactForm />
          </ScrollSection>
          <AIChatSim />
        </main>
      </div>
    </SmoothScrollProvider>
  )
}
