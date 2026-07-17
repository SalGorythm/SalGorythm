import { ExternalLink, Mail } from 'lucide-react'
import {
  SALGORYTHM_SUPPORT_EMAIL,
  SALGORYTHM_SUPPORT_MAILTO,
  SALGORYTHM_SUPPORT_PAGE_HASH,
  SALGORYTHM_SUPPORT_URL,
} from '../data/myApps'

type ProductSupportPanelProps = {
  /** In-page anchor for `/#product-support` on the home portfolio. */
  anchorId?: string
  className?: string
}

/**
 * Universal SalGorythm support — shared by My apps and `/support`.
 */
export function ProductSupportPanel({ anchorId, className = '' }: ProductSupportPanelProps) {
  return (
    <div
      id={anchorId}
      aria-labelledby="product-support-heading"
      className={`rounded-2xl border border-cyan-500/20 bg-slate-900/50 p-6 shadow-[0_0_32px_rgba(34,211,238,0.06)] backdrop-blur-md sm:p-8 ${className}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-500/80">
            Universal support
          </p>
          <h2
            id="product-support-heading"
            className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl"
          >
            SalGorythm product <span className="text-purple-300">support</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            One inbox for questions, bug reports, and feedback across Casette, EasySalah, and
            other SalGorythm apps — use it in App Store Connect, Google Play Console, project
            READMEs, and marketing footers so users always reach the same channel.
          </p>
          <div className="space-y-2 rounded-xl border border-slate-800/90 bg-slate-950/60 p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Support URL (store listings)
            </p>
            <a
              href={SALGORYTHM_SUPPORT_URL}
              className="inline-flex items-center gap-2 break-all font-mono text-sm text-cyan-300/95 underline-offset-2 hover:text-cyan-200 hover:underline"
            >
              {SALGORYTHM_SUPPORT_URL}
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
            </a>
            <p className="font-mono text-[10px] leading-relaxed text-slate-600">
              Alternate in-page anchor on the portfolio home:{' '}
              <code className="text-slate-500">{`/#${SALGORYTHM_SUPPORT_PAGE_HASH}`}</code>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
          <a
            href={SALGORYTHM_SUPPORT_MAILTO}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-cyan-500/45 bg-cyan-500/10 px-5 py-3 font-mono text-sm font-medium text-cyan-50 transition hover:border-cyan-400/60 hover:shadow-[0_0_24px_rgba(34,211,238,0.12)]"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            Email support
          </a>
          <p className="text-center font-mono text-xs text-slate-400 sm:text-left lg:text-center">
            {SALGORYTHM_SUPPORT_EMAIL}
          </p>
        </div>
      </div>
    </div>
  )
}
