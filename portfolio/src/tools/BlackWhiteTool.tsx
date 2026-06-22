import { Download, FileText, ImageIcon, Loader2, LockOpen, SlidersHorizontal } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { STAT_KEYS } from '../constants/statsKeys'
import { useStats } from '../context/useStats'
import { applyBlackWhite, type BwMode } from './applyBlackWhite'
import {
  exportPdfBlackWhite,
  loadPdfDocument,
  previewPdfPage,
} from './convertPdfBlackWhite'
import { downloadBlob, stemFilename } from './downloadBlob'
import { FileDropZone } from './FileDropZone'
import { isPdfPasswordError } from './pdfjsClient'
import type { pdfjs } from './pdfjsClient'

type SourceKind = 'image' | 'pdf'

function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export function BlackWhiteTool() {
  const { increment } = useStats()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<File | null>(null)
  const pdfDocRef = useRef<pdfjs.PDFDocumentProxy | null>(null)
  const pdfPasswordRef = useRef('')

  const [file, setFile] = useState<File | null>(null)
  const [kind, setKind] = useState<SourceKind | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mode, setMode] = useState<BwMode>('grayscale')
  const [threshold, setThreshold] = useState(128)
  const [contrast, setContrast] = useState(1)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)

  const [pdfPageCount, setPdfPageCount] = useState(0)
  const [previewPage, setPreviewPage] = useState(1)
  const [needsPdfPassword, setNeedsPdfPassword] = useState(false)
  const [pdfPassword, setPdfPassword] = useState('')

  const settings = { mode, threshold, contrast }

  const processImage = useCallback(
    (picked: File, nextMode: BwMode, nextThreshold: number, nextContrast: number) => {
      setBusy(true)
      setProgress(null)
      const img = new Image()
      const url = URL.createObjectURL(picked)
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) {
          URL.revokeObjectURL(url)
          setBusy(false)
          return
        }
        const maxW = 1600
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) {
          URL.revokeObjectURL(url)
          setBusy(false)
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        applyBlackWhite(ctx, w, h, nextMode, nextThreshold, nextContrast)
        setPreviewUrl(canvas.toDataURL('image/png'))
        URL.revokeObjectURL(url)
        setBusy(false)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        setBusy(false)
      }
      img.src = url
    },
    [],
  )

  const loadPdf = useCallback(
    async (picked: File, password: string) => {
      setBusy(true)
      setProgress('Opening PDF…')
      setNeedsPdfPassword(false)
      try {
        pdfDocRef.current?.cleanup()
        pdfDocRef.current = null
        const bytes = new Uint8Array(await picked.arrayBuffer())
        const pdf = await loadPdfDocument(bytes, password || undefined)
        pdfDocRef.current = pdf
        pdfPasswordRef.current = password
        setPdfPageCount(pdf.numPages)
        setPreviewPage(1)
        setProgress(`Rendering preview (page 1 of ${pdf.numPages})…`)
        const url = await previewPdfPage(pdf, 1, { mode, threshold, contrast })
        setPreviewUrl(url)
        setProgress(null)
      } catch (err) {
        if (isPdfPasswordError(err)) {
          setNeedsPdfPassword(true)
          setPreviewUrl(null)
          setProgress(null)
        } else {
          setProgress(null)
        }
      } finally {
        setBusy(false)
      }
    },
    [mode, threshold, contrast],
  )

  const refreshPdfPreview = useCallback(
    async (pageNum: number, nextMode: BwMode, nextThreshold: number, nextContrast: number) => {
      const pdf = pdfDocRef.current
      if (!pdf) return
      setBusy(true)
      setProgress(`Rendering page ${pageNum} of ${pdf.numPages}…`)
      try {
        const url = await previewPdfPage(pdf, pageNum, {
          mode: nextMode,
          threshold: nextThreshold,
          contrast: nextContrast,
        })
        setPreviewUrl(url)
      } finally {
        setProgress(null)
        setBusy(false)
      }
    },
    [],
  )

  const reset = () => {
    pdfDocRef.current?.cleanup()
    pdfDocRef.current = null
    pdfPasswordRef.current = ''
    fileRef.current = null
    setFile(null)
    setKind(null)
    setPreviewUrl(null)
    setPdfPageCount(0)
    setPreviewPage(1)
    setNeedsPdfPassword(false)
    setPdfPassword('')
    setProgress(null)
  }

  const onPick = (picked: File) => {
    reset()
    fileRef.current = picked
    setFile(picked)

    if (isPdfFile(picked)) {
      setKind('pdf')
      void loadPdf(picked, '')
      return
    }

    if (picked.type.startsWith('image/')) {
      setKind('image')
      processImage(picked, mode, threshold, contrast)
    }
  }

  const applyPdfPassword = () => {
    const f = fileRef.current
    if (!f || !pdfPassword.trim()) return
    void loadPdf(f, pdfPassword)
  }

  const updateMode = (next: BwMode) => {
    setMode(next)
    const f = fileRef.current
    if (!f) return
    if (kind === 'image') processImage(f, next, threshold, contrast)
    else if (pdfDocRef.current) void refreshPdfPreview(previewPage, next, threshold, contrast)
  }

  const updateThreshold = (next: number) => {
    setThreshold(next)
    const f = fileRef.current
    if (!f) return
    if (kind === 'image') processImage(f, mode, next, contrast)
    else if (pdfDocRef.current) void refreshPdfPreview(previewPage, mode, next, contrast)
  }

  const updateContrast = (next: number) => {
    setContrast(next)
    const f = fileRef.current
    if (!f) return
    if (kind === 'image') processImage(f, mode, threshold, next)
    else if (pdfDocRef.current) void refreshPdfPreview(previewPage, mode, threshold, next)
  }

  const changePreviewPage = (page: number) => {
    setPreviewPage(page)
    if (pdfDocRef.current) void refreshPdfPreview(page, mode, threshold, contrast)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas || !file) return
    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadBlob(blob, `${stemFilename(file.name)}-bw.png`)
          void increment(STAT_KEYS.TOOL_BW)
        }
      },
      'image/png',
      1,
    )
  }

  const downloadPdf = async () => {
    const pdf = pdfDocRef.current
    if (!pdf || !file) return
    setBusy(true)
    try {
      const bytes = await exportPdfBlackWhite(pdf, settings, (page, total) => {
        setProgress(`Building PDF · page ${page} of ${total}`)
      })
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      downloadBlob(blob, `${stemFilename(file.name)}-bw.pdf`)
      void increment(STAT_KEYS.TOOL_BW)
    } finally {
      setProgress(null)
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-400">
        <ImageIcon className="mb-0.5 mr-1 inline h-4 w-4 text-purple-400" aria-hidden />
        Convert <strong className="font-medium text-slate-200">images or PDFs</strong> to grayscale or
        high-contrast black &amp; white — entirely on-device. Images export as PNG; PDFs export as a new
        multi-page PDF.
      </p>

      <FileDropZone
        accept="image/png,image/jpeg,image/webp,image/*,application/pdf,.pdf"
        label="Drop an image or PDF here, or click to browse"
        hint="Local processing · PNG for images · PDF for documents"
        onFile={onPick}
        disabled={busy}
      />

      {file ? (
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-slate-500">
          {kind === 'pdf' ? (
            <FileText className="h-4 w-4 text-cyan-400/80" aria-hidden />
          ) : (
            <ImageIcon className="h-4 w-4 text-purple-400/80" aria-hidden />
          )}
          <span className="text-slate-300">{file.name}</span>
          {kind === 'pdf' && pdfPageCount > 0 ? (
            <span>{pdfPageCount} page{pdfPageCount === 1 ? '' : 's'}</span>
          ) : null}
          <button type="button" onClick={reset} className="text-cyan-500/80 hover:text-cyan-400">
            Clear
          </button>
        </div>
      ) : null}

      {needsPdfPassword ? (
        <div className="space-y-3 rounded-xl border border-purple-500/25 bg-slate-900/50 p-4">
          <label
            htmlFor="bw-pdf-password"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-400"
          >
            <LockOpen className="h-4 w-4 text-purple-400" aria-hidden />
            PDF open password
          </label>
          <input
            id="bw-pdf-password"
            type="password"
            value={pdfPassword}
            onChange={(e) => setPdfPassword(e.target.value)}
            placeholder="Password required to open this PDF"
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-purple-500/45 focus:ring-2 focus:ring-purple-500/20"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={applyPdfPassword}
            disabled={busy || !pdfPassword.trim()}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/45 bg-cyan-500/10 px-4 py-2.5 font-mono text-sm text-cyan-50 disabled:opacity-50"
          >
            Open PDF
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['grayscale', 'Grayscale'],
            ['threshold', 'Pure B&W'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => updateMode(id)}
            disabled={busy || needsPdfPassword}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs uppercase tracking-wider disabled:opacity-50 ${
              mode === id
                ? 'border-purple-400/50 bg-purple-500/15 text-purple-100'
                : 'border-slate-700 text-slate-400 hover:border-cyan-500/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs text-slate-400">
          <span className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Contrast {contrast.toFixed(2)}
          </span>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.05}
            value={contrast}
            disabled={busy || needsPdfPassword}
            onChange={(e) => updateContrast(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </label>
        {mode === 'threshold' ? (
          <label className="block text-xs text-slate-400">
            <span className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Threshold {threshold}
            </span>
            <input
              type="range"
              min={0}
              max={255}
              value={threshold}
              disabled={busy || needsPdfPassword}
              onChange={(e) => updateThreshold(Number(e.target.value))}
              className="w-full accent-purple-400"
            />
          </label>
        ) : null}
      </div>

      {kind === 'pdf' && pdfPageCount > 1 && !needsPdfPassword ? (
        <label className="block max-w-xs text-xs text-slate-400">
          <span className="mb-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Preview page {previewPage} of {pdfPageCount}
          </span>
          <input
            type="range"
            min={1}
            max={pdfPageCount}
            value={previewPage}
            disabled={busy}
            onChange={(e) => changePreviewPage(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </label>
      ) : null}

      {busy || progress ? (
        <p className="flex items-center gap-2 font-mono text-xs text-slate-500">
          <Loader2 className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} aria-hidden />
          {progress ?? 'Processing…'}
        </p>
      ) : null}

      <canvas ref={canvasRef} className="hidden" aria-hidden />

      {previewUrl && !needsPdfPassword ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950 p-2">
            <img
              src={previewUrl}
              alt="Black and white preview"
              className="mx-auto max-h-[420px] max-w-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={kind === 'pdf' ? downloadPdf : downloadImage}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-sm text-emerald-50 transition hover:border-emerald-400/55 disabled:opacity-50"
          >
            <Download className="h-4 w-4" aria-hidden />
            {kind === 'pdf' ? 'Download B&W PDF' : 'Download PNG'}
          </button>
          {kind === 'pdf' ? (
            <p className="font-mono text-[10px] text-slate-500">
              Export processes every page with your current settings (text becomes non-selectable).
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
