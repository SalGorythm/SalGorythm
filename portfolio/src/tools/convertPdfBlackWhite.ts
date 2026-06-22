import { PDFDocument } from 'pdf-lib'
import { applyBlackWhite, type BwMode } from './applyBlackWhite'
import { pdfjs } from './pdfjsClient'

export type BwPdfSettings = {
  mode: BwMode
  threshold: number
  contrast: number
  /** Render scale for pdf.js (2 ≈ 144 DPI). */
  scale?: number
}

async function renderPageToCanvas(
  pdf: pdfjs.PDFDocumentProxy,
  pageNum: number,
  settings: BwPdfSettings,
): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> {
  const page = await pdf.getPage(pageNum)
  const scale = settings.scale ?? 2
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas unavailable')

  await page.render({ canvas, canvasContext: ctx, viewport }).promise
  applyBlackWhite(ctx, canvas.width, canvas.height, settings.mode, settings.threshold, settings.contrast)
  return { canvas, width: viewport.width, height: viewport.height }
}

export async function loadPdfDocument(bytes: Uint8Array, password?: string): Promise<pdfjs.PDFDocumentProxy> {
  const loading = pdfjs.getDocument({
    data: bytes.slice(),
    password: password || undefined,
    verbosity: 0,
  })
  return loading.promise
}

/** Preview a single page after B&W processing. */
export async function previewPdfPage(
  pdf: pdfjs.PDFDocumentProxy,
  pageNum: number,
  settings: BwPdfSettings,
): Promise<string> {
  const { canvas } = await renderPageToCanvas(pdf, pageNum, settings)
  return canvas.toDataURL('image/png')
}

/** Build a multi-page grayscale / B&W PDF from all pages. */
export async function exportPdfBlackWhite(
  pdf: pdfjs.PDFDocumentProxy,
  settings: BwPdfSettings,
  onProgress?: (page: number, total: number) => void,
): Promise<Uint8Array> {
  const out = await PDFDocument.create()
  const total = pdf.numPages

  for (let i = 1; i <= total; i++) {
    onProgress?.(i, total)
    const { canvas, width, height } = await renderPageToCanvas(pdf, i, settings)
    const png = await out.embedPng(canvas.toDataURL('image/png'))
    const added = out.addPage([width, height])
    added.drawImage(png, { x: 0, y: 0, width, height })
  }

  return out.save()
}
