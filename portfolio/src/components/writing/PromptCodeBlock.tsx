import { Check, Copy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

const LANGUAGE_LABELS: Record<string, string> = {
  text: 'Prompt',
  plaintext: 'Prompt',
  prompt: 'Prompt',
  md: 'Markdown',
  markdown: 'Markdown',
  py: 'Python',
  python: 'Python',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
}

function formatLanguageLabel(language: string): string {
  const key = language.trim().toLowerCase()
  if (!key) return 'Prompt'
  return LANGUAGE_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

type PromptCodeBlockProps = {
  language: string
  code: string
  children: ReactNode
}

export function PromptCodeBlock({ language, code, children }: PromptCodeBlockProps) {
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

  const onCopy = useCallback(async () => {
    if (!code.trim()) return

    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopied(true)
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current)
    }
    resetTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
  }, [code])

  const label = formatLanguageLabel(language)

  return (
    <div className="article-code-block">
      <div className="article-code-block__toolbar">
        <span className="article-code-block__label">{label}</span>
        <button
          type="button"
          onClick={() => void onCopy()}
          className={`article-code-block__copy ${copied ? 'is-copied' : ''}`}
          aria-label={copied ? 'Copied to clipboard' : `Copy ${label.toLowerCase()}`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="article-code-block__pre">{children}</pre>
    </div>
  )
}
