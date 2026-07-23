import { useEffect, useState } from 'react'
import { AIChatSim } from '../components/AIChatSim'
import { AboutSection } from '../components/AboutSection'
import { AppLicensingQuoteForm } from '../components/AppLicensingQuoteForm'
import { CaseStudyMatrix } from '../components/CaseStudyMatrix'
import { ContactForm } from '../components/ContactForm'
import { CredibilityStrip } from '../components/CredibilityStrip'
import { EngineeringDecisionLog } from '../components/EngineeringDecisionLog'
import { ExperienceTimeline } from '../components/ExperienceTimeline'
import { Hero } from '../components/Hero'
import { LiveDemoStrip } from '../components/LiveDemoStrip'
import { MyAppsSection } from '../components/MyAppsSection'
import { ObjectionHandling } from '../components/ObjectionHandling'
import { ProjectsGrid } from '../components/ProjectsGrid'
import { RecruiterCvGate } from '../components/RecruiterCvGate'
import { RecruiterFunnelStrip } from '../components/RecruiterFunnelStrip'
import { ScrollSection } from '../components/ScrollSection'
import { SkillsTerminal } from '../components/SkillsTerminal'
import { SmoothScrollProvider } from '../components/SmoothScrollProvider'
import { useKeyboardSectionJumps } from '../hooks/useKeyboardSectionJumps'
import { usePortfolioScrollInit } from '../hooks/usePortfolioScrollInit'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useSectionReveal } from '../hooks/useSectionReveal'
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
  useSectionReveal('#case-studies', '[data-case-study-card]', !reducedMotion)

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
          <ScrollSection sectionId="case-studies">
            <CaseStudyMatrix />
          </ScrollSection>
          <ScrollSection sectionId="live-demos">
            <LiveDemoStrip />
          </ScrollSection>
          <ScrollSection sectionId="engineering-log">
            <EngineeringDecisionLog />
          </ScrollSection>
          <ScrollSection sectionId="about">
            <AboutSection />
          </ScrollSection>
          <ScrollSection sectionId="experience">
            <ExperienceTimeline />
          </ScrollSection>
          <ScrollSection sectionId="projects">
            <ProjectsGrid />
          </ScrollSection>
          <ScrollSection sectionId="skills">
            <SkillsTerminal />
          </ScrollSection>
          <ScrollSection sectionId="my-apps">
            <MyAppsSection />
          </ScrollSection>
          <ScrollSection sectionId="objections">
            <ObjectionHandling />
          </ScrollSection>
          <section
            id="resume"
            aria-labelledby="resume-heading"
            className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/55 py-16 backdrop-blur-sm"
          >
            <div className="page-container">
              <header className="mb-8 max-w-2xl">
                <p className="text-sm font-medium text-cyan-400/90">Résumé</p>
                <h2
                  id="resume-heading"
                  className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
                >
                  Download
                </h2>
                <p className="text-sm text-slate-400">
                  PDF and DOCX downloads. Optional activity counts on the right.
                </p>
              </header>
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <RecruiterCvGate />
                <RecruiterFunnelStrip />
              </div>
            </div>
          </section>
          <ScrollSection sectionId="contact">
            <ContactForm />
          </ScrollSection>
          <AppLicensingQuoteForm />
          <AIChatSim />
        </main>
      </div>
    </SmoothScrollProvider>
  )
}
