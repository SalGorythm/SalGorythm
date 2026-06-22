/** Trigger a browser download from an in-memory blob (no server upload). */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function stemFilename(name: string): string {
  const base = name.replace(/\.[^/.]+$/, '')
  return base || 'file'
}
