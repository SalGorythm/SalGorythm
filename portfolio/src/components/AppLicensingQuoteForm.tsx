import { AlertCircle, CheckCircle2, Loader2, Mail, Package, Send, User } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { isWeb3FormsConfigured, submitToWeb3Forms } from '../lib/web3forms'

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const configured = isWeb3FormsConfigured()

/**
 * Licensing / acquisition inquiries for shipped apps (Web3Forms, same key as contact).
 */
export function AppLicensingQuoteForm() {
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!configured) {
      setSubmit({
        status: 'error',
        message:
          import.meta.env.DEV
            ? 'Add VITE_WEB3FORMS_ACCESS_KEY to .env and restart the dev server.'
            : 'This form is not active on this deployment yet.',
      })
      return
    }

    setSubmit({ status: 'submitting' })
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const data = await submitToWeb3Forms(formData)
      if (data.success) {
        setSubmit({
          status: 'success',
          message: 'Quote request received. I will follow up by email with next steps.',
        })
        form.reset()
      } else {
        setSubmit({
          status: 'error',
          message: data.message ?? 'Submission failed. Please try again or use the contact form.',
        })
      }
    } catch {
      setSubmit({
        status: 'error',
        message: 'Network error. Check your connection and try again.',
      })
    }
  }

  return (
    <section
      id="apps"
      aria-labelledby="apps-heading"
      className="scroll-mt-28 border-b border-purple-500/10 bg-slate-950/25 py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-purple-400/80">
            Products · licensing
          </p>
          <h2
            id="apps-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
          >
            Acquire or <span className="text-cyan-300">license</span> an app
          </h2>
          <p className="mt-3 text-slate-400">
            I ship privacy-minded utilities and tools. If you are interested in white-labeling,
            acquiring rights, partnering on distribution, or commissioning a sibling product, send a
            structured quote request — same secure channel as the contact form.
          </p>
        </header>

        <div className="mx-auto max-w-xl">
          {!configured && (
            <div
              className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-100/90"
              role="status"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
              <p>
                {import.meta.env.DEV ? (
                  <>
                    <strong className="font-medium text-amber-50">Developer:</strong> add{' '}
                    <span className="font-mono">VITE_WEB3FORMS_ACCESS_KEY</span> to{' '}
                    <span className="font-mono">.env</span> and restart the dev server. Do not commit{' '}
                    <span className="font-mono">.env</span>.
                  </>
                ) : (
                  <>
                    <strong className="font-medium text-amber-50">Unavailable:</strong> quote relay
                    is not configured for this build.
                  </>
                )}
              </p>
            </div>
          )}

          {submit.status === 'success' && (
            <div
              className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-100"
              role="status"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
              <p>{submit.message}</p>
            </div>
          )}

          {submit.status === 'error' && (
            <div
              className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-100"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden />
              <p>{submit.message}</p>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-2xl border border-purple-500/25 bg-slate-900/40 p-6 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md sm:p-8"
          >
            <input type="hidden" name="subject" value="Portfolio · App licensing / acquisition quote" />
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label
                htmlFor="apps-name"
                className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500"
              >
                <User className="h-3.5 w-3.5 text-purple-400/80" aria-hidden />
                Name
              </label>
              <input
                id="apps-name"
                name="name"
                required
                disabled={submit.status === 'submitting'}
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none ring-purple-500/20 placeholder:text-slate-600 focus:border-purple-500/45 focus:ring-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="apps-email"
                className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500"
              >
                <Mail className="h-3.5 w-3.5 text-cyan-400/80" aria-hidden />
                Email
              </label>
              <input
                id="apps-email"
                name="email"
                type="email"
                required
                disabled={submit.status === 'submitting'}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-500/20 placeholder:text-slate-600 focus:border-cyan-500/45 focus:ring-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="apps-org"
                className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500"
              >
                Organization <span className="normal-case text-slate-600">(optional)</span>
              </label>
              <input
                id="apps-org"
                name="organization"
                disabled={submit.status === 'submitting'}
                placeholder="Company or studio"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-purple-500/40 focus:ring-2 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="apps-product"
                className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500"
              >
                <Package className="h-3.5 w-3.5 text-cyan-400/80" aria-hidden />
                Primary interest
              </label>
              <select
                id="apps-product"
                name="product_interest"
                required
                disabled={submit.status === 'submitting'}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-500/45 focus:ring-2 disabled:opacity-50"
                defaultValue=""
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="EasySalah (marketing site / app)">EasySalah (site or app)</option>
                <option value="Future SalGorythm products">Future products from this portfolio</option>
                <option value="Custom build / commission">Custom build or commission</option>
                <option value="Other / not sure yet">Other / exploring</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="apps-budget"
                  className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500"
                >
                  Budget ballpark
                </label>
                <select
                  id="apps-budget"
                  name="budget_range"
                  disabled={submit.status === 'submitting'}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-purple-500/40 focus:ring-2 disabled:opacity-50"
                  defaultValue="Prefer not to say"
                >
                  <option>Prefer not to say</option>
                  <option>Under $10k</option>
                  <option>$10k – $50k</option>
                  <option>$50k+</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="apps-timeline"
                  className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500"
                >
                  Timeline
                </label>
                <select
                  id="apps-timeline"
                  name="timeline"
                  disabled={submit.status === 'submitting'}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-purple-500/40 focus:ring-2 disabled:opacity-50"
                  defaultValue="Exploring"
                >
                  <option>ASAP</option>
                  <option>This quarter</option>
                  <option>This year</option>
                  <option>Exploring</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="apps-message"
                className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-500"
              >
                Goals &amp; scope
              </label>
              <textarea
                id="apps-message"
                name="message"
                required
                rows={5}
                disabled={submit.status === 'submitting'}
                placeholder="e.g. white-label for a region, acquisition of IP, partnership with distribution, feature set you need…"
                className="w-full resize-y rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-purple-500/45 focus:ring-2 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={submit.status === 'submitting' || !configured}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/45 bg-gradient-to-r from-purple-500/20 to-cyan-500/15 py-3 font-mono text-sm font-medium text-slate-50 transition hover:scale-[1.01] hover:border-purple-400/60 hover:shadow-[0_0_24px_rgba(168,85,247,0.15)] disabled:pointer-events-none disabled:opacity-50"
            >
              {submit.status === 'submitting' ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Send className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              )}
              {submit.status === 'submitting' ? 'Sending…' : 'Request quote'}
            </button>

            <p className="text-center font-mono text-[10px] text-slate-600">
              Non-binding inquiry. I will reply from my professional inbox; no automated marketing.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
