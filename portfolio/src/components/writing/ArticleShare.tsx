import { Check, ClipboardCopy, Link2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  buildArticleSharePost,
  buildArticleShareTweetText,
} from '../../lib/articleShare'

type ArticleShareProps = {
  shareUrl: string
  title: string
  shareBlurb: string
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

export function ArticleShare({ shareUrl, title, shareBlurb }: ArticleShareProps) {
  const [copied, setCopied] = useState<'link' | 'post' | null>(null)
  const resetTimeoutRef = useRef<number | null>(null)

  const resolvedUrl = typeof window !== 'undefined' ? window.location.href : shareUrl
  const sharePost = buildArticleSharePost(title, shareBlurb, resolvedUrl)
  const tweetText = buildArticleShareTweetText(title, shareBlurb)

  useEffect(
    () => () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current)
      }
    },
    [],
  )

  const flashCopied = useCallback((kind: 'link' | 'post') => {
    setCopied(kind)
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current)
    }
    resetTimeoutRef.current = window.setTimeout(() => setCopied(null), 2000)
  }, [])

  const onCopyLink = useCallback(async () => {
    await copyText(resolvedUrl)
    flashCopied('link')
  }, [flashCopied, resolvedUrl])

  const onCopyPost = useCallback(async () => {
    await copyText(sharePost)
    flashCopied('post')
  }, [flashCopied, sharePost])

  /** LinkedIn share-offsite has no text param — copy caption, then open URL share. */
  const onShareLinkedIn = useCallback(async () => {
    await copyText(sharePost)
    flashCopied('post')
    const href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resolvedUrl)}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }, [flashCopied, resolvedUrl, sharePost])

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(resolvedUrl)}&text=${encodeURIComponent(tweetText)}`

  const buttonClass =
    'inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-500/35 hover:text-cyan-100'

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Share</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void onShareLinkedIn()}
          className={buttonClass}
          title="Copies title + brief + link, then opens LinkedIn — paste into the post"
        >
          LinkedIn
        </button>
        <a href={twitterHref} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          X
        </a>
        <button
          type="button"
          onClick={() => void onCopyPost()}
          className={`${buttonClass} ${
            copied === 'post' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : ''
          }`}
          aria-label={copied === 'post' ? 'Post copied' : 'Copy share post'}
        >
          {copied === 'post' ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden />
              Post copied!
            </>
          ) : (
            <>
              <ClipboardCopy className="h-3.5 w-3.5" aria-hidden />
              Copy post
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => void onCopyLink()}
          className={`${buttonClass} ${
            copied === 'link' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : ''
          }`}
          aria-label={copied === 'link' ? 'Link copied' : 'Copy article link'}
        >
          {copied === 'link' ? (
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
