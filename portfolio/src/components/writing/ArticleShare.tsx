import { Check, Link2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type ArticleShareProps = {
  shareUrl: string
  title: string
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

export function ArticleShare({ shareUrl, title }: ArticleShareProps) {
  const [copied, setCopied] = useState(false)
  const resetTimeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current)
      }
    },
    [],
  )

  const onCopyLink = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : shareUrl
    await copyText(url)
    setCopied(true)
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current)
    }
    resetTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
  }, [shareUrl])

  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`

  const buttonClass =
    'inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-500/35 hover:text-cyan-100'

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Share</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          LinkedIn
        </a>
        <a href={twitterHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          X
        </a>
        <button
          type="button"
          onClick={() => void onCopyLink()}
          className={`${buttonClass} ${
            copied ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : ''
          }`}
          aria-label={copied ? 'Link copied' : 'Copy article link'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden />
              Copied!
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5" aria-hidden />
              Copy link
            </>
          )}
        </button>
      </div>
    </div>
  )
}
