import { Cpu, FlaskConical, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeader } from './SectionHeader'

type DemoTile = {
  category: string
  title: string
  blurb: string
  href: string
  hash?: string
  icon: typeof Cpu
}

const DEMOS: DemoTile[] = [
  {
    category: 'ML demo',
    title: 'Neural Tuning Sim',
    blurb: 'Train a small MLP in the browser on spiral data — decision regions update live.',
    href: '/sandbox',
    icon: Cpu,
  },
  {
    category: 'Browser tools',
    title: 'PDF unlock · B&W converter',
    blurb: 'Files stay on your machine. PDF and image processing runs entirely client-side.',
    href: '/tools',
    icon: Wrench,
  },
  {
    category: 'Canvas labs',
    title: 'Boids · Fourier labs',
    blurb: 'Flocking, genetic rockets, and harmonic visuals — mostly to see if the layout keeps up.',
    href: '/sandbox',
    hash: '#labs',
    icon: FlaskConical,
  },
]

export function LiveDemoStrip() {
  return (
    <section
      id="live-demos"
      aria-labelledby="live-demos-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/30 py-20"
    >
      <div className="page-container">
        <SectionHeader
          domain="Live demos"
          title="Try it in the browser"
          description="Interactive pieces from this site — sandbox games, canvas labs, and local-first tools."
          id="live-demos-heading"
          className="mb-10"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {DEMOS.map((demo) => {
            const Icon = demo.icon
            const to = demo.hash ? `${demo.href}${demo.hash}` : demo.href
            return (
              <article
                key={demo.title}
                className="flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 backdrop-blur-md transition hover:border-purple-500/30 sm:p-6"
              >
                <p className="text-xs font-medium text-purple-400/90">{demo.category}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
                  <h3 className="text-base font-semibold text-slate-100">{demo.title}</h3>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{demo.blurb}</p>
                <Link
                  to={to}
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/50"
                >
                  Open demo
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
