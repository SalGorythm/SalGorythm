/**
 * Shipped products — store & web links for the portfolio “My apps” section.
 * Add `playStoreUrl` when a listing is live; omit or use `playStoreNote` otherwise.
 */

/** Canonical support inbox for all SalGorythm apps & projects (store listings, footers, help). */
export const SALGORYTHM_SUPPORT_EMAIL = 'support@salgorythm.com'

export const SALGORYTHM_SUPPORT_MAILTO = `mailto:${SALGORYTHM_SUPPORT_EMAIL}?subject=Support%20request`

/**
 * Element `id` on the portfolio home page — use as a public support URL fragment, e.g.
 * `https://your-domain.com/#product-support` in App Store Connect / Play Console.
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
