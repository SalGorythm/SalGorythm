import { AIChatSim } from './components/AIChatSim'
import { ContactForm } from './components/ContactForm'
import { ExperienceTimeline } from './components/ExperienceTimeline'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { ProjectsGrid } from './components/ProjectsGrid'
import { SkillsTerminal } from './components/SkillsTerminal'
import { SECTION_IDS } from './constants/sections'
import { useActiveSection } from './hooks/useActiveSection'

function App() {
  const activeSection = useActiveSection(SECTION_IDS)

  return (
    <div className="min-h-svh">
      <Navbar activeId={activeSection} />
      <main>
        <Hero />
        <ExperienceTimeline />
        <SkillsTerminal />
        <ProjectsGrid />
        <AIChatSim />
        <ContactForm />
      </main>
      <footer className="border-t border-slate-800/90 bg-slate-950/80 py-8 text-center backdrop-blur-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-600">
          © {new Date().getFullYear()} · Built with Vite + React + Tailwind · Signal preserved
        </p>
      </footer>
    </div>
  )
}

export default App
