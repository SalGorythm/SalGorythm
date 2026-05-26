import { Download, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { CV_DOWNLOAD_PATH } from '../constants/cv'

type RecruiterCvGateProps = {
  /** Tighter layout for hero column */
  variant?: 'default' | 'compact'
}

/**
 * Lightweight good-faith gate before exposing the CV link (client-side only — not a security control).
 */
export function RecruiterCvGate({ variant = 'default' }: RecruiterCvGateProps) {
  const [isRecruiter, setIsRecruiter] = useState(false)
  const [ackFairUse, setAckFairUse] = useState(false)
  const unlocked = isRecruiter && ackFairUse
  const compact = variant === 'compact'

  return (
    <div
      className={`rounded-2xl border border-slate-700/80 bg-slate-950/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
    >
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-cyan-300">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-500/80">
            Recruiter verification
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-100 sm:text-base">
            Résumé download (PDF)
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Similar to a good-faith captcha: confirm your intent to unlock the direct file link. No
            data is sent to any server.
          </p>
        </div>
      </div>

      <div className={`mt-4 space-y-3 ${compact ? '' : 'sm:mt-5'}`}>
        <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-800/90 bg-slate-900/40 px-3 py-2.5 transition hover:border-cyan-500/25">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-950 text-cyan-500 focus:ring-cyan-500/40"
            checked={isRecruiter}
            onChange={(e) => setIsRecruiter(e.target.checked)}
          />
          <span className="text-sm text-slate-300">
            I am a <strong className="font-medium text-slate-200">recruiter or hiring manager</strong>{' '}
            contacting Salman Akhatar about a legitimate role or pipeline.
          </span>
        </label>

        <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-800/90 bg-slate-900/40 px-3 py-2.5 transition hover:border-purple-500/25">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-950 text-purple-500 focus:ring-purple-500/40"
            checked={ackFairUse}
            onChange={(e) => setAckFairUse(e.target.checked)}
          />
          <span className="text-sm text-slate-300">
            I will use this document only for recruitment evaluation and will not scrape, resell, or
            misuse contact details (fair-use acknowledgment).
          </span>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-800/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={CV_DOWNLOAD_PATH}
          download="Salman-Akhatar-CV.pdf"
          aria-disabled={!unlocked}
          tabIndex={unlocked ? 0 : -1}
          onClick={(e) => {
            if (!unlocked) e.preventDefault()
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-sm font-medium transition ${
            unlocked
              ? 'border-cyan-500/45 bg-cyan-500/15 text-cyan-50 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
              : 'pointer-events-none border-slate-800/80 bg-slate-900/30 text-slate-600'
          }`}
        >
          <Download className="h-4 w-4" aria-hidden />
          Download CV (PDF)
        </a>
        <p className="font-mono text-[10px] text-slate-600">
          {unlocked ? 'Link armed · file opens in a new context' : 'Complete both checks to arm link'}
        </p>
      </div>
    </div>
  )
}
