/**
 * Shipped products — powers the home “My apps” section, `/apps`, `/apps/:id`, and
 * `/apps/:id/privacy`.
 *
 * Adding an app:
 * 1. Append an entry to `PORTFOLIO_APPS` (its `id` becomes the URL slug).
 * 2. Add the privacy policy as `src/content/apps/privacy/<id>.md`.
 * 3. Optional: terms as `src/content/apps/terms/<id>.md` (enables `/apps/<id>/terms`).
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
  /** URL slug — `/apps/<id>` and `/apps/<id>/privacy`. */
  id: string
  name: string
  tagline: string
  description: string
  highlights: string[]
  category: string
  platforms: string[]
  /** Longer feature list for the dedicated app page. */
  features: { title: string; body: string }[]
  /** Shown on the privacy page, e.g. “October 2026”. */
  privacyLastUpdated: string
  /** Shown on the terms page when `content/apps/terms/<id>.md` exists. */
  termsLastUpdated?: string
  /** Free vs paid split for the app page. */
  plans?: { free: string[]; pro: string[]; proLabel: string; note?: string }
  faq?: { q: string; a: string }[]
  /** Disclaimer shown at the end of the app page. */
  notice?: string
  /** Omit when the portfolio page is the app's only site. */
  websiteUrl?: string
  appStoreUrl?: string
  /** e.g. “Coming soon” when there is no App Store URL yet */
  appStoreNote?: string
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
    category: 'Audio · Productivity',
    platforms: ['iOS'],
    features: [
      {
        title: 'Bring your own audio',
        body: 'Import from the Files app, Wi‑Fi transfer from any device on your LAN, cloud folders (iCloud Drive, Google Drive, Dropbox, WebDAV), or a pasted share link.',
      },
      {
        title: 'Built for long listening',
        body: 'Per-track speed control, sleep timer, silence skip, bookmarks, and automatic resume for lectures, audiobooks, and podcasts.',
      },
      {
        title: 'Library backups',
        body: 'Folders, playlists, tags, bookmarks, and playback positions back up daily to your own iCloud Drive — or stay on device.',
      },
      {
        title: 'Pay once',
        body: 'Casette Pro is $3.99 once with a 3-day trial. No subscription, no ads, no Casette account.',
      },
    ],
    privacyLastUpdated: 'October 2026',
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
    category: 'Lifestyle · Reference',
    platforms: ['iOS', 'Android (soon)'],
    features: [
      {
        title: 'Accurate prayer times',
        body: 'Calculated on-device from your location with configurable methods, plus reminders for each prayer.',
      },
      {
        title: 'Qibla compass',
        body: 'Direction to the Kaaba from wherever you are — location is processed locally and never stored.',
      },
      {
        title: 'Hijri & Gregorian dates',
        body: 'Both calendars side by side, with local Islamic date information.',
      },
      {
        title: 'Zakat helper & Pro Tools',
        body: 'Educational Zakat estimates, with optional Pro Tools unlocked by a one-time in-app purchase.',
      },
    ],
    privacyLastUpdated: 'February 2026',
    websiteUrl: 'https://easy-salah.vercel.app/',
    appStoreUrl: 'https://apps.apple.com/in/app/easysalah/id6759148931',
    playStoreNote: 'Google Play listing — coming soon',
  },
  {
    id: 'wakeup',
    name: 'WakeUp',
    tagline: 'An alarm you turn off by getting up.',
    description:
      'WakeUp rings, then asks for something small: a few sums, a scan of the code on your kettle, a few steps, a line from your faith pack. Then it walks you through the first ten minutes of your day — water, curtains, a stretch, a look at today. Never stuck, never shamed. No account, nothing leaves your phone, and Pro is a one-time purchase.',
    highlights: [
      'Missions to turn it off',
      'Morning sequence & streak',
      'Faith packs, sourced',
      'No account · data not collected',
    ],
    category: 'Lifestyle · Productivity',
    platforms: ['iPhone', 'iOS 16.4+'],
    features: [
      {
        title: 'Get up to turn it off',
        body: 'Solve a few sums, scan a code you stuck in the kitchen, walk thirty steps, match a photo, or read a line from your faith pack.',
      },
      {
        title: 'Tomorrow, on one screen',
        body: 'Your Morning Plan: the alarm, a live countdown, your mission and your morning steps. Bedtime is worked out for you, with an optional wind-down reminder.',
      },
      {
        title: 'Armed and audible',
        body: 'A pre-flight check shows green, amber or red — and the exact reason tonight’s alarm might not ring, with a one-tap fix.',
      },
      {
        title: 'A gentle wake light',
        body: 'The screen brightens through warm colours at the alarm. In Nightstand mode, a sunrise ramp (Pro) warms the screen before it rings.',
      },
      {
        title: 'Your first ten minutes',
        body: 'Choose 2 to 5 morning steps from 15 — water, curtains, a stretch, a look at today. One tap each. A missed day is just a gap.',
      },
      {
        title: 'Never stuck',
        body: '“Dismiss anyway” appears after 3 tries or 90 seconds on any mission. Snooze shortens each time, and the Stay-Up Check rings at most twice.',
      },
      {
        title: 'Faith packs, done with care',
        body: 'Islamic, Hindu, Christian and Secular packs. Every text shows its source and is reviewed. Tap-through only — never voice-checked, never scored.',
      },
      {
        title: 'Honest about iOS',
        body: 'Uses iOS alarms (iOS 26.1+) to ring on silent and in Focus, with a backup chain of time-sensitive notifications. Rings even if you close the app.',
      },
    ],
    privacyLastUpdated: '9 October 2026',
    termsLastUpdated: '9 October 2026',
    plans: {
      proLabel: 'WakeUp Pro — pay once',
      free: [
        'One alarm and the math mission',
        'Morning sequence, Morning Plan and streak',
        'History with CSV export',
        'Bedtime, wind-down, signed commitment',
        'Nightstand, wake light, snooze, Stay-Up Check',
        'Your first faith pack',
        'Widgets, Live Activity, pre-flight check',
      ],
      pro: [
        'Unlimited alarms',
        'Scan a code, photo match, steps and retype missions',
        'Every faith pack',
        'Full sound library and your own sounds',
        'Sunrise ramp in Nightstand',
        'Background photo on the alarm screen',
      ],
      note: 'The core job is never behind a paywall: an alarm that rings and a mission that turns it off. No subscription — Pro never renews.',
    },
    faq: [
      {
        q: 'My alarm didn’t ring. What should I check?',
        a: 'Open WakeUp and look at the card at the top of the home screen. It checks what can silence an alarm — notifications or sounds off for WakeUp, a Scheduled Summary, a Focus blocking time-sensitive notifications, silent mode without iOS alarms, Low Power Mode — and tells you which applies. Then run Test alarm with your phone set up the way it will be in the morning.',
      },
      {
        q: 'Does it ring when my iPhone is on silent?',
        a: 'Yes, if you allow iOS alarms for WakeUp (iOS 26.1 or later). Without them, notification sounds follow the silent switch, which is an iOS rule for all apps.',
      },
      {
        q: 'Does it ring if I close or force-quit the app?',
        a: 'Yes. Alarms are scheduled with iOS, not kept running in the app.',
      },
      {
        q: 'Can I turn the alarm off without doing the mission?',
        a: 'Yes. “Dismiss anyway” appears after 3 tries or 90 seconds. Being trapped by a ringing phone helps nobody.',
      },
      {
        q: 'What is the Stay-Up Check?',
        a: 'If you turn it on, the alarm rings once more a few minutes after your mission, unless you tick a morning step or tap “I’m up”. It rings at most twice, and you can switch it off per alarm.',
      },
      {
        q: 'Why does the sunrise only work in Nightstand?',
        a: 'iOS doesn’t let a locked phone light its screen. Open Nightstand on a charger before bed, and the screen warms up before your alarm.',
      },
      {
        q: 'Can I use my iPhone ringtone or my own sound?',
        a: 'Yes. Choose “iPhone ringtone” in Sounds — the alarm notifications use it, while the in-app alarm screen plays WakeUp’s own tone. With Pro, pick any audio file from Files; WakeUp keeps the first 29 seconds. Copy-protected Apple Music songs can’t be used.',
      },
      {
        q: 'Can I put my own photo or words on the alarm screen?',
        a: 'Yes, in Settings → Alarm screen. Your own lines are free; a background photo needs Pro.',
      },
      {
        q: 'I bought Pro on another device.',
        a: 'Settings → WakeUp Pro → Restore purchase, signed in with the same Apple Account.',
      },
      {
        q: 'How do I get a refund?',
        a: 'Refunds are handled by Apple at reportaproblem.apple.com.',
      },
      {
        q: 'How do I export or delete my data?',
        a: 'History → Export as CSV gives you everything WakeUp has recorded. Deleting the app deletes all its data; there’s no copy anywhere else.',
      },
      {
        q: 'Is the faith content accurate?',
        a: 'Each text carries its source and is reviewed before it ships. If you spot an error, email support with the pack and the text, and it will be corrected.',
      },
      {
        q: 'Is there an Android version?',
        a: 'Not yet.',
      },
    ],
    notice:
      'WakeUp is not a medical device. The wake light and sunrise brighten your screen; they are not light therapy.',
    appStoreNote: 'App Store — coming soon',
  },
  {
    id: 'vaultly',
    name: 'Vaultly',
    tagline: 'A calmer place for the things that matter.',
    description:
      'Vaultly helps you organize and protect important documents on your device — IDs, health, travel, and finance — so you can find them quickly and share them only when you choose. Ad-free, local-first, and Pro is a one-time purchase, not a subscription.',
    highlights: ['Always ad-free', 'Always local', 'Passcode & Face ID', 'No clutter'],
    category: 'Productivity · Utilities',
    platforms: ['iPhone & iPad', 'Android'],
    features: [
      {
        title: 'Organized by design',
        body: 'Fixed categories for the paperwork people actually carry — ID, Finance, Health, and Travel — plus search and pinning so important items stay one tap away.',
      },
      {
        title: 'Private by default',
        body: 'Passcode lock, optional Face ID / Touch ID, and auto-lock after a short idle window you choose. Your passcode is stored as a hash, never in plain text.',
      },
      {
        title: 'Always local',
        body: 'Document details live in a database on your phone and files are copied into the app’s private storage. Offline-first — not a cloud sync product.',
      },
      {
        title: 'Made for real life',
        body: 'Add PDFs and images from the system picker and view them in the app. Emergency access can surface your pinned items right after unlock when you need speed.',
      },
      {
        title: 'Always ad-free',
        body: 'Vaultly does not show ads. No attention economy inside your vault — your focus stays on your documents.',
      },
      {
        title: 'No clutter',
        body: 'Minimal on purpose: clear hierarchy, calm typography, and space. Light and Dark for everyone, with extra colour themes in Pro.',
      },
    ],
    privacyLastUpdated: '14 October 2026',
    plans: {
      proLabel: 'Vaultly Pro — $4.99 once',
      free: [
        'Up to 5 documents',
        'Passcode, biometrics and auto-lock',
        'ID, Finance, Health and Travel categories',
        'Search, pinning and emergency access',
        'Light and Dark themes',
        'Files stay on your device · no ads',
      ],
      pro: [
        'Unlimited documents',
        'Additional colour themes',
        'Everything in Free',
        'Files stay on your device · no ads',
      ],
      note: 'Pro is a one-time purchase through the store — not a subscription. Store fees and taxes may apply per platform.',
    },
    faq: [
      {
        q: 'Is Vaultly free?',
        a: 'Yes. The free tier includes the core vault features with a limit of 5 documents. Pro removes the limit and adds extra themes for a one-time $4.99 purchase.',
      },
      {
        q: 'Does Vaultly show ads?',
        a: 'No. Ad-free is a core product decision — not an upsell.',
      },
      {
        q: 'Where is my data stored?',
        a: 'On your device: a local database for document details and the app’s private storage for files. The in-app Privacy screen has the same plain-language summary.',
      },
      {
        q: 'Do you upload my documents to the cloud?',
        a: 'No. Vaultly does not upload your vault as part of normal use. A file only leaves the app when you choose to open or share it with another app, such as Mail or AirDrop.',
      },
      {
        q: 'Is there a subscription?',
        a: 'No. Pro is a one-time purchase. Store fees and taxes may apply per platform.',
      },
      {
        q: 'Can I recover my vault if I lose my phone?',
        a: 'Vaultly has no built-in cloud backup, so a lost or reset device can mean lost documents. Keep originals or a backup you trust for anything you can’t replace.',
      },
      {
        q: 'What is emergency access?',
        a: 'An optional mode that, right after unlock, jumps straight to a simplified list of your pinned items. Return to the full app whenever you’re ready.',
      },
    ],
    notice:
      'Vaultly has no built-in cloud backup. Your vault lives only on your device — keep originals or a backup you trust for documents you can’t replace.',
    appStoreNote: 'App Store — coming soon',
    playStoreNote: 'Google Play — coming soon',
  },
]

export function getAppById(id: string | undefined): PortfolioApp | undefined {
  return PORTFOLIO_APPS.find((app) => app.id === id)
}

export const appPath = (id: string) => `/apps/${id}`
export const appPrivacyPath = (id: string) => `/apps/${id}/privacy`
export const appTermsPath = (id: string) => `/apps/${id}/terms`
