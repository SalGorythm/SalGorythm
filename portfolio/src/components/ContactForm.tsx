import { useState, type FormEvent } from 'react'
import { isWeb3FormsConfigured, submitToWeb3Forms } from '../lib/web3forms'

const configured = isWeb3FormsConfigured()

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

/**
 * Contact form card via Web3Forms (`fetch` + `FormData`). Configure `VITE_WEB3FORMS_ACCESS_KEY`
 * in the deploy environment. Styled by `.sp-form` in `components/space/space.css`.
 */
export function ContactForm() {
  const [submit, setSubmit] = useState<SubmitState>({ status: 'idle' })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!configured) {
      setSubmit({
        status: 'error',
        message: import.meta.env.DEV
          ? 'Add VITE_WEB3FORMS_ACCESS_KEY to your .env file and restart the dev server.'
          : 'This form is not active on this deployment yet. Please email me instead.',
      })
      return
    }

    setSubmit({ status: 'submitting' })
    const form = event.currentTarget
    const formData = new FormData(form)
    if (!formData.get('subject')) formData.set('subject', 'Portfolio contact')

    try {
      const data = await submitToWeb3Forms(formData)
      if (data.success) {
        setSubmit({
          status: 'success',
          message: 'Transmission received. One-way light time to New Delhi: under a tenth of a second. My reply by email takes a little longer.',
        })
        form.reset()
      } else {
        setSubmit({ status: 'error', message: data.message ?? 'Sending failed. Please try again.' })
      }
    } catch {
      setSubmit({ status: 'error', message: 'Network error. Check your connection and try again.' })
    }
  }

  const busy = submit.status === 'submitting'

  return (
    <form onSubmit={onSubmit} className="sp-form" aria-label="Contact form">
      <input type="hidden" name="subject" value="Portfolio contact" />
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      {!configured && import.meta.env.DEV && (
        <p className="sp-note sp-note--warn" role="status">
          Developer: add <code>VITE_WEB3FORMS_ACCESS_KEY</code> to <code>.env</code> and restart{' '}
          <code>npm run dev</code>.
        </p>
      )}
      {submit.status === 'success' && (
        <p className="sp-note sp-note--ok" role="status">
          {submit.message}
        </p>
      )}
      {submit.status === 'error' && (
        <p className="sp-note sp-note--err" role="alert">
          {submit.message}
        </p>
      )}

      <div>
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" required disabled={busy} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" required disabled={busy} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="contact-message">What needs to ship?</label>
        <textarea id="contact-message" name="message" required rows={5} disabled={busy} />
      </div>

      <button type="submit" className="sp-btn" disabled={busy || !configured}>
        {busy ? 'Sending…' : 'Send message'}
      </button>
      <p className="sp-fine">I reply personally. No mailing lists.</p>
    </form>
  )
}
