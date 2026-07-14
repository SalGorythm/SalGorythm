import { Cpu, FlaskConical, Wrench } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeader } from './SectionHeader'

type DemoTile = {
  domain: string
  title: string
  sop: string
  href: string
  hash?: string
  icon: typeof Cpu
  preview: string
}

const DEMOS: DemoTile[] = [
  {
    domain: 'DOMAIN: AGENTIC AI',
    title: 'Neural Tuning Sim',
    sop: 'Train a micro-MLP live — proves client-side ML loop and responsive canvas rendering.',
    href: '/sandbox',
    icon: Cpu,
    preview: 'Interactive MLP on spiral data with live decision regions.',
  },
  {
    domain: 'DOMAIN: BROWSER UTILITIES',
    title: 'PDF unlock · B&W converter',
    sop: 'Zero-upload file pipelines — PDF and image processing entirely in-browser.',
    href: '/tools',
    icon: Wrench,
    preview: 'Client-side pdf-lib + pdf.js raster path; no server upload.',
  },
  {
    domain: 'DOMAIN: CANVAS SYSTEMS',
    title: 'Boids · Fourier labs',
    sop: 'High-frequency canvas simulations — stress-tests layout stability and frame pacing.',
    href: '/sandbox',
    hash: '#labs',
    icon: FlaskConical,
    preview: '150+ agent flocking, genetic rockets, harmonic visual modes.',
  },
]

function DemoCard({ demo }: { demo: DemoTile }) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const Icon = demo.icon

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true)
      },
      { rootMargin: '80px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const to = demo.hash ? `${demo.href}${demo.hash}` : demo.href

  return (
    <article
      ref={ref}
      className="flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/35 p-5 backdrop-blur-md transition hover:border-purple-500/30"
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-purple-400/95">
        {demo.domain}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <Icon className="h-5 w-5 text-cyan-400" aria-hidden />
        <h3 className="text-base font-semibold text-slate-100">{demo.title}</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{demo.sop}</p>

      <div
        className={`mt-4 min-h-[88px] rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 font-mono text-[11px] leading-relaxed text-slate-500 transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-40'
        }`}
      >
        {visible ? (
          <span className="text-cyan-400/80">preview.load()</span>
        ) : (
          <span>await intersectionObserver…</span>
        )}
        <p className="mt-2 text-slate-400">{demo.preview}</p>
      </div>

      <Link
        to={to}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-cyan-100 transition hover:border-cyan-400/50"
      >
        Open live demo
      </Link>
    </article>
  )
}

export function LiveDemoStrip() {
  return (
    <section
      id="live-demos"
      aria-labelledby="live-demos-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/30 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          domain="LIVE DEMOS · PROOF OF DEPLOYMENT"
          title="Runnable code inside the portfolio shell"
          description="Each tile lazy-loads on scroll to isolate layout lag — then routes to a real interactive surface."
          id="live-demos-heading"
          className="mb-10"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {DEMOS.map((demo) => (
            <DemoCard key={demo.domain} demo={demo} />
          ))}
        </div>
      </div>
    </section>
  )
}
