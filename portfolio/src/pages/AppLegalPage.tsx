import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { Link, Navigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import {
  SALGORYTHM_SUPPORT_EMAIL,
  SALGORYTHM_SUPPORT_MAILTO,
  SALGORYTHM_SUPPORT_URL,
  appPath,
  getAppById,
} from '../data/myApps'
import { usePageMeta } from '../hooks/usePageMeta'
import { getAppLegalDoc, type AppLegalKind } from '../lib/appLegal'

const TITLES: Record<AppLegalKind, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
}

const MARKDOWN_COMPONENTS: Components = {
  table: ({ children }) => (
    <div className="article-table-wrap">
      <table>{children}</table>
    </div>
  ),
}

/** `/apps/:appId/privacy` and `/apps/:appId/terms`. */
export function AppLegalPage({ kind }: { kind: AppLegalKind }) {
  const { appId } = useParams()
  const app = getAppById(appId)
  const title = TITLES[kind]
  usePageMeta(app ? `${app.name} ${title}` : title, app ? `${app.name} ${title.toLowerCase()}.` : undefined)

  if (!app) return <Navigate to="/apps" replace />
  const doc = getAppLegalDoc(kind, app.id)
  // Terms are optional per app; privacy always renders (with a fallback).
  if (!doc && kind === 'terms') return <Navigate to={appPath(app.id)} replace />
  const lastUpdated = kind === 'privacy' ? app.privacyLastUpdated : app.termsLastUpdated

  return (
    <div className="min-h-svh border-b border-cyan-500/10 pb-24 pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          to={appPath(app.id)}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-400 transition hover:text-cyan-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {app.name}
        </Link>

        <header className="mt-6 border-b border-cyan-500/15 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/90">{app.name}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">{title}</h1>
          {lastUpdated ? (
            <p className="mt-3 font-mono text-xs text-slate-500">Last updated: {lastUpdated}</p>
          ) : null}
        </header>

        <article className="article-prose policy-prose mt-10">
          {doc ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
              {doc}
            </ReactMarkdown>
          ) : (
            <p>This privacy policy is being prepared. Contact support for details in the meantime.</p>
          )}

          <h2>Contact</h2>
          <p>
            Questions about {app.name}: email{' '}
            <a href={SALGORYTHM_SUPPORT_MAILTO}>{SALGORYTHM_SUPPORT_EMAIL}</a> or visit{' '}
            <Link to="/support">{SALGORYTHM_SUPPORT_URL}</Link>.
          </p>
        </article>
      </div>
    </div>
  )
}
