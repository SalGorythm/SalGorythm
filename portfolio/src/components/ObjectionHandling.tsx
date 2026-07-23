import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { SectionHeader } from './SectionHeader'

const OBJECTIONS = [
  {
    id: 'enterprise',
    question: 'Can you work in regulated / enterprise environments?',
    answer:
      'Yes — IBM WatsonX governance, RBAC, and audit trails on agent workflows; EY cybersecurity products under security review. I have shipped in environments where misconfiguration and data handling are audited.',
  },
  {
    id: 'production',
    question: 'Research only, or production delivery?',
    answer:
      'Production. Atom Bot on 25,000+ machines, FastAPI backends under concurrent load, eval gates before agent releases, and CI/CD on Azure. Research informs the work; shipping is the measure.',
  },
  {
    id: 'remote',
    question: 'Remote and timezone?',
    answer:
      'Based in New Delhi, remote-friendly. I collaborate with global IBM teams and have delivered for US/EU-aligned programs from India.',
  },
  {
    id: 'licensing',
    question: 'Hiring vs app licensing or contract work?',
    answer:
      'Open to senior DS / AI-ML roles and selective product or licensing engagements. Use the contact form for hiring; the licensing quote section below for app or custom build inquiries.',
    cta: { label: 'Licensing quote', href: '#apps' },
  },
] as const

export function ObjectionHandling() {
  const baseId = useId()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section
      id="objections"
      aria-labelledby="objections-heading"
      className="scroll-mt-28 border-b border-cyan-500/10 bg-slate-950/30 py-20"
    >
      <div className="page-container">
        <SectionHeader
          domain="Common questions"
          title="What hiring teams usually ask"
          description="Short answers before you download the résumé or reach out."
          id="objections-heading"
          className="mb-8 max-w-2xl"
        />
        <ul className="mx-auto max-w-3xl space-y-3">
          {OBJECTIONS.map((item) => {
            const isOpen = openId === item.id
            const panelId = `${baseId}-${item.id}`
            return (
              <li key={item.id} className="rounded-xl border border-slate-800/90 bg-slate-900/35">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-100 transition hover:text-cyan-100"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  {item.question}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <div id={panelId} className="border-t border-slate-800/80 px-5 py-4">
                    <p className="text-sm leading-relaxed text-slate-400">{item.answer}</p>
                    {'cta' in item && item.cta ? (
                      <a
                        href={item.cta.href}
                        className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-purple-300 transition hover:text-purple-200"
                      >
                        {item.cta.label} →
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
        <p className="mt-8 text-center">
          <a
            href="#resume"
            className="inline-flex min-h-11 items-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/50"
          >
            Download résumé
          </a>
        </p>
      </div>
    </section>
  )
}
