import { useState } from 'react'
import { mailto } from '../../data/homeContent'
import { RECRUITER_SUMMARY } from '../../data/recruiterSummary'
import { ContactForm } from '../ContactForm'
import { SocialLinks } from '../SocialLinks'
import { BlackHole } from './BlackHole'

export function Channel() {
  const { email } = RECRUITER_SUMMARY
  const [copyLabel, setCopyLabel] = useState('Copy email')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopyLabel('Copied')
    } catch {
      setCopyLabel('Select the address to copy')
    }
    window.setTimeout(() => setCopyLabel('Copy email'), 1800)
  }

  return (
    <section id="contact" className="sp-channel" aria-labelledby="contact-h">
      <div className="sp-wrap">
        <BlackHole />
        <p className="sp-mono sp-bh-caption">Gargantua-class inbox: messages go in, replies come back out.</p>
        <p className="sp-mono sp-eyebrow">Open a channel</p>
        <h2 id="contact-h">
          Got something that needs to <em>reach orbit?</em>
        </h2>

        <div className="sp-contact-grid">
          <div className="sp-contact-left">
            <p>Roles, builds, consulting or a mock interview. Email me directly or use the form, and I&#8217;ll get back to you.</p>
            <a className="sp-mail" href={mailto(email, 'Hello Salman')}>
              {email}
            </a>
            <div>
              <button type="button" className="sp-btn sp-btn--line" onClick={copy} aria-live="polite">
                {copyLabel}
              </button>
            </div>
            <SocialLinks variant="inline" className="justify-start!" />
          </div>
          <div className="sp-contact-form">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
