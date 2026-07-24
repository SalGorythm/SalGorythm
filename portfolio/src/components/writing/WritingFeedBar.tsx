import { CheckCircle2, Loader2, Rss } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { isWeb3FormsConfigured, submitToWeb3Forms } from '../../lib/web3forms'

const RSS_HREF = '/writing.rss'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function WritingFeedBar() {
  const configured = isWeb3FormsConfigured()
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!configured) {
      setSubmitState('error')
      setErrorMessage('Email signup is not configured on this deployment.')
      return
    }

    setSubmitState('submitting')
    setErrorMessage('')
    const formData = new FormData(event.currentTarget)
    formData.set('subject', 'Writing — notify me of new posts')

    try {
      const data = await submitToWeb3Forms(formData)
      if (data.success) {
        setSubmitState('success')
        event.currentTarget.reset()
      } else {
        setSubmitState('error')
        setErrorMessage(data.message ?? 'Could not subscribe. Try again.')
      }
    } catch {
      setSubmitState('error')
      setErrorMessage('Network error. Try again later.')
    }
  }

  return (
    <div className="mb-10 flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/90 bg-slate-900/35 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <a
            href={RSS_HREF}
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300/90 transition hover:text-cyan-200"
          >
            <Rss className="h-4 w-4" aria-hidden />
            RSS feed
          </a>
          <p className="mt-1 text-xs text-slate-400">Subscribe in your reader — no account required.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row sm:items-center"
        >
          <label htmlFor="writing-notify-email" className="sr-only">
            Email for new post notifications
          </label>
          <input
            id="writing-notify-email"
            name="email"
            type="email"
            required
            disabled={submitState === 'submitting' || submitState === 'success'}
            placeholder="Get notified of new posts"
            className="min-h-10 flex-1 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500/45 disabled:opacity-60"
          />
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
          <button
            type="submit"
            disabled={!configured || submitState === 'submitting' || submitState === 'success'}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:border-amber-400/50 disabled:opacity-60"
          >
            {submitState === 'submitting' ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {submitState === 'success' ? 'Subscribed' : 'Notify me'}
          </button>
        </form>
      </div>

      {submitState === 'success' ? (
        <p className="flex items-center gap-1.5 text-xs text-emerald-300/90">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          Thanks — I&apos;ll email you when a new article goes live.
        </p>
      ) : null}
      {submitState === 'error' && errorMessage ? (
        <p className="text-xs text-red-300/90" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
