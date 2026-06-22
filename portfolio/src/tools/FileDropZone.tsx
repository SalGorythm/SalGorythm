import { Upload } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'

type FileDropZoneProps = {
  accept: string
  label: string
  hint: string
  onFile: (file: File) => void
  disabled?: boolean
}

export function FileDropZone({ accept, label, hint, onFile, disabled }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const pick = (file: File | undefined) => {
    if (file && !disabled) onFile(file)
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    pick(e.dataTransfer.files?.[0])
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
        disabled
          ? 'cursor-not-allowed border-slate-800 bg-slate-950/40 opacity-60'
          : dragOver
            ? 'border-cyan-400/60 bg-cyan-500/10'
            : 'border-slate-700/90 bg-slate-950/50 hover:border-purple-500/40 hover:bg-slate-900/60'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => pick(e.target.files?.[0])}
      />
      <Upload className="mx-auto h-8 w-8 text-cyan-400/80" aria-hidden />
      <p className="mt-3 font-mono text-sm font-medium text-slate-200">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  )
}
