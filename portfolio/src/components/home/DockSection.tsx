import { useState } from 'react'
import { mailto } from '../../data/homeContent'
import { RECRUITER_SUMMARY } from '../../data/recruiterSummary'
import { ContactForm } from '../ContactForm'
import { SocialLinks } from '../SocialLinks'

export function DockSection() {
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
    <section id="contact" className="cg-dock" aria-labelledby="contact-h">
      <div className="cg-wrap">
        <div className="cg-kicker" style={{ ['--k' as string]: 'var(--navy)' }}>
          <i aria-hidden />
          <span className="cg-mono">Get in touch</span>
        </div>
        <h2 id="contact-h">Got something that needs to ship?</h2>
        <div className="cg-dock-grid">
          <div className="cg-dock-left">
            <p style={{ fontSize: 19, maxWidth: '40ch' }}>
              Roles, builds, consulting or a mock interview. Email me directly or use the form, and I&#8217;ll
              get back to you.
            </p>
            <a className="cg-mail" href={mailto(email, 'Hello Salman')}>
              {email}
            </a>
            <div>
              <button type="button" className="cg-btn cg-btn--navy" onClick={copy} aria-live="polite">
                {copyLabel}
              </button>
            </div>
            <SocialLinks variant="inline" className="justify-start! sm:justify-start" />
          </div>
          <div className="cg-dock-form">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
