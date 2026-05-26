import { Lock, Mail, MessageSquare, Send, User } from 'lucide-react'

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

/**
 * Web3Forms: set `VITE_WEB3FORMS_ACCESS_KEY` in `.env` (see README).
 * Alternative: point `action` at Formspree `https://formspree.io/f/{id}` and remove the hidden access_key field.
 */
export function ContactForm() {
  const configured = Boolean(ACCESS_KEY && ACCESS_KEY.length > 8)

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-28 py-20 pb-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-500/80">
            Secure portal
          </p>
          <h2
            id="contact-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl"
          >
            Establish <span className="text-purple-300">contact</span>
          </h2>
          <p className="mt-3 text-slate-400">
            Serverless-friendly form: defaults to Web3Forms when{' '}
            <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-xs text-cyan-300/90">
              VITE_WEB3FORMS_ACCESS_KEY
            </code>{' '}
            is set. Swap the action for Formspree if you prefer.
          </p>
        </header>

        <div className="mx-auto max-w-xl">
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-100/90">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
            <p>
              {!configured ? (
                <>
                  <strong className="font-medium text-amber-50">Demo mode:</strong> add your
                  Web3Forms access key to <span className="font-mono">.env</span> so submissions
                  deliver. The form still validates locally.
                </>
              ) : (
                <>
                  <strong className="font-medium text-emerald-200">Ready:</strong> submissions
                  route through Web3Forms using your environment key.
                </>
              )}
            </p>
          </div>

          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="space-y-4 rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-6 shadow-[0_0_30px_rgba(34,211,238,0.06)] backdrop-blur-md sm:p-8"
          >
            <input type="hidden" name="subject" value="Portfolio contact" />
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

            {configured ? (
              <input type="hidden" name="access_key" value={ACCESS_KEY} readOnly />
            ) : (
              <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" readOnly />
            )}

            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500"
              >
                <User className="h-3.5 w-3.5 text-cyan-400/80" aria-hidden />
                Identity
              </label>
              <input
                id="contact-name"
                name="name"
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-500/20 placeholder:text-slate-600 focus:border-cyan-500/45 focus:ring-2"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500"
              >
                <Mail className="h-3.5 w-3.5 text-purple-400/80" aria-hidden />
                Return path (email)
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@organization.com"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-500/20 placeholder:text-slate-600 focus:border-purple-500/40 focus:ring-2"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500"
              >
                <MessageSquare className="h-3.5 w-3.5 text-cyan-400/80" aria-hidden />
                Payload
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                placeholder="Context, role, timeline, and how you like to work together."
                className="w-full resize-y rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-500/20 placeholder:text-slate-600 focus:border-cyan-500/45 focus:ring-2"
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/45 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 py-3 font-mono text-sm font-medium text-cyan-50 transition hover:scale-[1.01] hover:border-cyan-400/60 hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]"
            >
              <Send className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              Transmit
            </button>

            <p className="text-center font-mono text-[10px] text-slate-600">
              By sending, you agree I may reply from my professional inbox. No marketing lists.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
