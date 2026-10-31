type SectionHeaderProps = {
  domain: string
  title: string
  description?: string
  id?: string
  className?: string
}

export function SectionHeader({ domain, title, description, id, className = '' }: SectionHeaderProps) {
  return (
    <header className={`max-w-2xl ${className}`}>
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-space-gold">
        <span aria-hidden className="block h-px w-7 bg-space-gold" />
        {domain}
      </p>
      <h2
        id={id}
        className="mt-3 font-display text-3xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{description}</p>
      ) : null}
    </header>
  )
}
