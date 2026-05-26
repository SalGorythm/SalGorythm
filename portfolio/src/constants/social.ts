export type SocialNetwork = 'linkedin' | 'github' | 'stackoverflow' | 'x' | 'instagram'

export type SocialLinkItem = {
  id: SocialNetwork
  href: string
  label: string
}

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/salgorythm/',
    label: 'LinkedIn',
  },
  {
    id: 'github',
    href: 'https://github.com/SalGorythm',
    label: 'GitHub',
  },
  {
    id: 'stackoverflow',
    href: 'https://stackoverflow.com/users/7806720/salgorithm',
    label: 'Stack Overflow',
  },
  {
    id: 'x',
    href: 'https://x.com/Salgorythm',
    label: 'X (Twitter)',
  },
  {
    id: 'instagram',
    href: 'https://instagram.com/Salgorythm',
    label: 'Instagram',
  },
]
