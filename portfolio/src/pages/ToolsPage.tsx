import { FileKey, ImageIcon, Link as LinkIcon, Wrench } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StatBadge } from '../components/StatBadge'
import { STAT_KEYS, type StatKey } from '../constants/statsKeys'
import { BlackWhiteTool } from '../tools/BlackWhiteTool'
import { PdfUnlockTool } from '../tools/PdfUnlockTool'

type ToolId = 'pdf' | 'bw'

const TOOLS: {
  id: ToolId
  title: string
  blurb: string
  icon: typeof Wrench
  statKey: StatKey
}[] = [
  {
    id: 'pdf',
    title: 'PDF password remover',
    blurb: 'Enter the current open password you use today — get an unencrypted copy (no auto-bypass).',
    icon: FileKey,
    statKey: STAT_KEYS.TOOL_PDF,
  },
  {
    id: 'bw',
    title: 'Black & white converter',
    blurb: 'Grayscale or threshold B&W for images (PNG) and PDFs (multi-page export).',
    icon: ImageIcon,
    statKey: STAT_KEYS.TOOL_BW,
  },
]

export function ToolsPage() {
  const [tool, setTool] = useState<ToolId>('pdf')

  return (
    <div className="min-h-svh border-b border-cyan-500/10 pb-24 pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 border-b border-cyan-500/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500/80">
              Weekend Hobbies · zero upload
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl">
              Utility <span className="text-cyan-300 text-glow-cyan">Tools</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Browser-only utilities I built as a weekend hobby. Files are processed in memory on your
              device and are never sent to a server.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-600/80 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200"
          >
            ← Portfolio
          </Link>
        </header>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-950/60 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
            <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
          </div>

          <div className="relative grid gap-3 border-b border-slate-800/90 p-3 sm:grid-cols-2">
            {TOOLS.map(({ id, title, blurb, icon: Icon, statKey }) => {
              const active = tool === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTool(id)}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    active
                      ? 'border-emerald-500/45 bg-emerald-500/10'
                      : 'border-slate-800/80 bg-slate-900/40 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Icon className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                    <StatBadge statKey={statKey} label="uses" />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Tool
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-100">{title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-300">{blurb}</p>
                </button>
              )
            })}
          </div>

          <div className="relative p-4 sm:p-6">
            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-600">
              <LinkIcon className="h-3.5 w-3.5" aria-hidden />
              <Wrench className="h-3.5 w-3.5 text-emerald-500/80" aria-hidden />
              Client-side pipeline
            </p>
            {tool === 'pdf' && <PdfUnlockTool />}
            {tool === 'bw' && <BlackWhiteTool />}
          </div>
        </div>
      </div>
    </div>
  )
}
