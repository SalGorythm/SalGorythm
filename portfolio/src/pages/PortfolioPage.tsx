import { AIChatSim } from '../components/AIChatSim'
import { AppLicensingQuoteForm } from '../components/AppLicensingQuoteForm'
import { CaseStudyMatrix } from '../components/CaseStudyMatrix'
import { ContactForm } from '../components/ContactForm'
import { EngineeringDecisionLog } from '../components/EngineeringDecisionLog'
import { ExperienceTimeline } from '../components/ExperienceTimeline'
import { Hero } from '../components/Hero'
import { LiveDemoStrip } from '../components/LiveDemoStrip'
import { MyAppsSection } from '../components/MyAppsSection'
import { ProjectsGrid } from '../components/ProjectsGrid'
import { RecruiterCvGate } from '../components/RecruiterCvGate'
import { RecruiterFunnelStrip } from '../components/RecruiterFunnelStrip'
import { SkillsTerminal } from '../components/SkillsTerminal'

export function PortfolioPage() {
  return (
    <main>
      <Hero />
      <CaseStudyMatrix />
      <LiveDemoStrip />
      <EngineeringDecisionLog />
      <ExperienceTimeline />
      <ProjectsGrid />
      <SkillsTerminal />
      <MyAppsSection />
      <section
        id="resume"
        aria-labelledby="resume-heading"
        className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/30 py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
      <ContactForm />
      <AppLicensingQuoteForm />
      <AIChatSim />
    </main>
  )
}
