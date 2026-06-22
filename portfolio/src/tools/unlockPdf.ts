import { PDFDocument } from 'pdf-lib'
import { pdfjs } from './pdfjsClient'

/** Unprotected PDF — reload and save without encryption metadata (vector quality). */
async function unlockUnprotected(bytes: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes)
  return doc.save()
}

/** Password-protected PDF — decrypt with pdf.js using the user-supplied open password, rebuild pages. */
async function unlockWithPassword(bytes: Uint8Array, password: string): Promise<Uint8Array> {
  const loading = pdfjs.getDocument({ data: bytes.slice(), password, verbosity: 0 })
  const pdf = await loading.promise
  const out = await PDFDocument.create()

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const scale = 2
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable')

    await page.render({ canvas, canvasContext: ctx, viewport }).promise
    const png = await out.embedPng(canvas.toDataURL('image/png'))
    const w = viewport.width
    const h = viewport.height
    const added = out.addPage([w, h])
    added.drawImage(png, { x: 0, y: 0, width: w, height: h })
  }

  return out.save()
}

export type UnlockResult =
  | { ok: true; bytes: Uint8Array; method: 'vector' | 'raster' }
  | { ok: false; reason: 'bad_password' | 'needs_password' | 'invalid' }

export type UnlockPdfOptions =
  | { mode: 'no_password' }
  | { mode: 'with_password'; password: string }

/**
 * Remove PDF protection only after the user supplies credentials or declares no open password.
 * Does not attempt bypass, cracking, or ignoreEncryption shortcuts.
 */
export async function unlockPdf(bytes: Uint8Array, options: UnlockPdfOptions): Promise<UnlockResult> {
  if (options.mode === 'no_password') {
    try {
      const out = await unlockUnprotected(bytes)
      return { ok: true, bytes: out, method: 'vector' }
    } catch {
      return { ok: false, reason: 'needs_password' }
    }
  }

  const password = options.password.trim()
  if (!password) {
    return { ok: false, reason: 'bad_password' }
  }

  try {
    const out = await unlockWithPassword(bytes, password)
    return { ok: true, bytes: out, method: 'raster' }
  } catch {
    return { ok: false, reason: 'bad_password' }
  }
}
