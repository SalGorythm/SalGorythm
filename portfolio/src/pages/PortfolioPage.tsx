import { AIChatSim } from '../components/AIChatSim'
import { AppLicensingQuoteForm } from '../components/AppLicensingQuoteForm'
import { ContactForm } from '../components/ContactForm'
import { ExperienceTimeline } from '../components/ExperienceTimeline'
import { Hero } from '../components/Hero'
import { MyAppsSection } from '../components/MyAppsSection'
import { ProjectsGrid } from '../components/ProjectsGrid'
import { RecruiterCvGate } from '../components/RecruiterCvGate'
import { SkillsTerminal } from '../components/SkillsTerminal'

export function PortfolioPage() {
  return (
    <main>
      <Hero />
      <section
        id="resume"
        aria-labelledby="resume-heading"
        className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/30 py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-500/80">
              For hiring teams
            </p>
            <h2
              id="resume-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl"
            >
              Résumé &amp; verification
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Download the PDF after a short good-faith check — no tracking, no third-party widget.
            </p>
          </header>
          <RecruiterCvGate />
        </div>
      </section>
      <ExperienceTimeline />
      <SkillsTerminal />
      <ProjectsGrid />
      <MyAppsSection />
      <AppLicensingQuoteForm />
      <AIChatSim />
      <ContactForm />
    </main>
  )
}
