/**
 * Shipped products — store & web links for the portfolio “My apps” section.
 * Add `playStoreUrl` when a listing is live; omit or use `playStoreNote` otherwise.
 */

/** Canonical support inbox for all SalGorythm apps & projects (store listings, footers, help). */
export const SALGORYTHM_SUPPORT_EMAIL = 'support@salgorythm.com'

export const SALGORYTHM_SUPPORT_MAILTO = `mailto:${SALGORYTHM_SUPPORT_EMAIL}?subject=Support%20request`

/**
 * Public support URL — paste this into App Store Connect, Google Play Console, and in-app help.
 * Served by the SPA route `/support` (e.g. https://salgorythm.com/support).
 */
export const SALGORYTHM_SUPPORT_URL = 'https://salgorythm.com/support'

/**
 * Optional in-page anchor on the portfolio home (`/#product-support`) for deep links from your own site.
 */
export const SALGORYTHM_SUPPORT_PAGE_HASH = 'product-support'

export type PortfolioApp = {
  id: string
  name: string
  tagline: string
  description: string
  highlights: string[]
  websiteUrl: string
  appStoreUrl?: string
  playStoreUrl?: string
  /** e.g. “Coming soon” when there is no Play URL yet */
  playStoreNote?: string
}

export const PORTFOLIO_APPS: PortfolioApp[] = [
  {
    id: 'casette',
    name: 'Casette',
    tagline: 'Offline audio for iPhone — lectures, podcasts, and your own files.',
    description:
      'Import from the Files app, Wi‑Fi transfer on your LAN, or cloud folders (iCloud, Google Drive, share links). Casette Pro is $3.99 once with a 3-day trial — no subscription, no ads, and no Casette account. Built for long listening: speed control, sleep timer, resume, and silence skip.',
    highlights: [
      'Files, Wi‑Fi & cloud import',
      'Speed, sleep timer, silence skip',
      'Private · no analytics SDKs',
      'iOS App Store · web hub',
    ],
    websiteUrl: 'https://casette-kohl.vercel.app/',
    appStoreUrl: 'https://apps.apple.com/in/app/casette/id6778667635',
  },
  {
    id: 'easysalah',
    name: 'EasySalah',
    tagline: 'Local-first Islamic utility — prayer times, Qibla, Hijri & Zakat.',
    description:
      'Prayer times, Qibla compass, Hijri & Gregorian dates, Zakat estimates, and reminders with optional Pro Tools. Built for privacy: calculations stay on-device; no account required for core use.',
    highlights: [
      'On-device prayer logic',
      'Qibla & Hijri cards',
      'Zakat helper (educational)',
      'iOS App Store · web hub',
    ],
    websiteUrl: 'https://easy-salah.vercel.app/',
    appStoreUrl: 'https://apps.apple.com/in/app/easysalah/id6759148931',
    playStoreNote: 'Google Play listing — coming soon',
  },
]
