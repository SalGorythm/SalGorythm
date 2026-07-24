import { AlertCircle, CheckCircle2, Download, Loader2, LockOpen, Shield } from 'lucide-react'
import { useState } from 'react'
import { STAT_KEYS } from '../constants/statsKeys'
import { useStats } from '../context/useStats'
import { downloadBlob, stemFilename } from './downloadBlob'
import { FileDropZone } from './FileDropZone'
import { unlockPdf } from './unlockPdf'

type Status = 'idle' | 'working' | 'done' | 'error'

export function PdfUnlockTool() {
  const { increment } = useStats()
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [noOpenPassword, setNoOpenPassword] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [outputBytes, setOutputBytes] = useState<Uint8Array | null>(null)
  const [method, setMethod] = useState<'vector' | 'raster' | null>(null)

  const reset = () => {
    setFile(null)
    setPassword('')
    setNoOpenPassword(false)
    setStatus('idle')
    setMessage('')
    setOutputBytes(null)
    setMethod(null)
  }

  const onPick = (picked: File) => {
    reset()
    setFile(picked)
    setMessage('Enter the current open password for this PDF, then click Remove password.')
  }

  const canSubmit =
    file &&
    status !== 'working' &&
    (noOpenPassword || password.length > 0)

  const unlock = async () => {
    if (!file || !canSubmit) return
    setStatus('working')
    setMessage('Verifying credentials and rebuilding PDF locally…')
    setOutputBytes(null)
    setMethod(null)

    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      const result = await unlockPdf(
        bytes,
        noOpenPassword ? { mode: 'no_password' } : { mode: 'with_password', password },
      )

      if (result.ok) {
        setOutputBytes(result.bytes)
        setMethod(result.method)
        setStatus('done')
        setMessage(
          result.method === 'vector'
            ? 'Done — saved a copy without encryption. Download below.'
            : 'Password verified — unlocked copy ready (pages rebuilt; text may not be selectable).',
        )
        return
      }

      if (result.reason === 'needs_password') {
        setStatus('error')
        setMessage(
          'This PDF appears to require an open password. Uncheck “opens without a password” and enter the current password you use to open the file.',
        )
        return
      }

      setStatus('error')
      setMessage(
        'Incorrect password, or this PDF uses encryption we cannot process in the browser. Only use files you own and know the password for.',
      )
    } catch {
      setStatus('error')
      setMessage('Could not process that file. Ensure it is a valid PDF and try again.')
    }
  }

  const download = () => {
    if (!outputBytes || !file) return
    const blob = new Blob([outputBytes as BlobPart], { type: 'application/pdf' })
    downloadBlob(blob, `${stemFilename(file.name)}-unlocked.pdf`)
    void increment(STAT_KEYS.TOOL_PDF)
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-300">
        <Shield className="mb-0.5 mr-1 inline h-4 w-4 text-cyan-400" aria-hidden />
        Files never leave your browser. You must supply the <strong className="font-medium text-slate-200">current open password</strong>{' '}
        for protected PDFs you own — we do not crack, guess, or bypass encryption automatically.
      </p>

      <FileDropZone
        accept="application/pdf,.pdf"
        label="Drop a PDF here or click to browse"
        hint="Processed in-memory on your device · typical limit ~50 MB"
        onFile={onPick}
        disabled={status === 'working'}
      />

      {file ? (
        <p className="font-mono text-xs text-slate-500">
          Selected: <span className="text-slate-300">{file.name}</span> (
          {(file.size / 1024).toFixed(1)} KB)
        </p>
      ) : null}

      {file ? (
        <div className="space-y-4 rounded-xl border border-purple-500/25 bg-slate-900/50 p-4">
          <label
            htmlFor="pdf-password"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-400"
          >
            <LockOpen className="h-4 w-4 text-purple-400" aria-hidden />
            Current open password
          </label>
          <input
            id="pdf-password"
            type="password"
            value={password}
            disabled={noOpenPassword || status === 'working'}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password you use to open this PDF today"
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-purple-500/45 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
            autoComplete="off"
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-800/90 bg-slate-950/40 px-3 py-2.5">
            <input
              type="checkbox"
              checked={noOpenPassword}
              disabled={status === 'working'}
              onChange={(e) => {
                setNoOpenPassword(e.target.checked)
                if (e.target.checked) setPassword('')
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-950 text-cyan-500 focus:ring-cyan-500/40"
            />
            <span className="text-sm text-slate-300">
              This PDF <strong className="font-medium text-slate-200">opens without a password</strong>{' '}
              today (no open password — I only want a fresh unencrypted copy).
            </span>
          </label>

          <button
            type="button"
            onClick={unlock}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/45 bg-cyan-500/10 px-4 py-2.5 font-mono text-sm text-cyan-50 transition hover:border-cyan-400/60 disabled:opacity-50"
          >
            {status === 'working' ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <LockOpen className="h-4 w-4" aria-hidden />
            )}
            Remove password
          </button>
        </div>
      ) : null}

      {message ? (
        <div
          className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-sm ${
            status === 'error'
              ? 'border-red-500/30 bg-red-500/10 text-red-100'
              : status === 'done'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                : 'border-slate-700/80 bg-slate-900/40 text-slate-300'
          }`}
          role="status"
        >
          {status === 'error' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          ) : status === 'done' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          ) : status === 'working' ? (
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" aria-hidden />
          ) : null}
          <p>{message}</p>
        </div>
      ) : null}

      {outputBytes && status === 'done' ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-sm text-emerald-50 transition hover:border-emerald-400/55"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download unlocked PDF
          </button>
          {method === 'raster' ? (
            <span className="font-mono text-[10px] text-slate-500">Raster rebuild · larger file size</span>
          ) : null}
        </div>
      ) : null}

      {file ? (
        <button
          type="button"
          onClick={reset}
          className="block font-mono text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
        >
          Clear and pick another file
        </button>
      ) : null}
    </div>
  )
}
