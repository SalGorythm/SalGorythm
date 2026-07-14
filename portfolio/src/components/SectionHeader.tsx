type SectionHeaderProps = {
  domain: string
  title: string
  description?: string
  id?: string
  className?: string
}

/** Pattern-interrupt section header — ALL-CAPS domain eyebrow. */
export function SectionHeader({ domain, title, description, id, className = '' }: SectionHeaderProps) {
  return (
    <header className={`max-w-2xl ${className}`}>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400/95">
        {domain}
      </p>
      <h2
        id={id}
        className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl lg:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">{description}</p>
      ) : null}
    </header>
  )
}
