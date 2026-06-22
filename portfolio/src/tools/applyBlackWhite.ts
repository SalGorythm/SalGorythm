export type BwMode = 'grayscale' | 'threshold'

export function applyBlackWhite(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mode: BwMode,
  threshold: number,
  contrast: number,
): void {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  const c = contrast
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i]!
    let g = d[i + 1]!
    let b = d[i + 2]!
    r = Math.min(255, Math.max(0, (r - 128) * c + 128))
    g = Math.min(255, Math.max(0, (g - 128) * c + 128))
    b = Math.min(255, Math.max(0, (b - 128) * c + 128))
    let lum = 0.299 * r + 0.587 * g + 0.114 * b
    if (mode === 'threshold') {
      lum = lum >= threshold ? 255 : 0
    }
    d[i] = lum
    d[i + 1] = lum
    d[i + 2] = lum
  }
  ctx.putImageData(img, 0, 0)
}
