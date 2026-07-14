type BrandLogoProps = {
  variant?: 'icon' | 'full'
  className?: string
}

/** SalGorythm brand mark — icon-only or full wordmark. */
export function BrandLogo({ variant = 'full', className = '' }: BrandLogoProps) {
  const src = variant === 'icon' ? '/salgorythm-icon.svg' : '/salgorythm-logo.svg'
  const size =
    variant === 'icon'
      ? 'h-9 w-9'
      : 'h-9 w-auto max-w-[180px] sm:max-w-[200px]'

  return (
    <img
      src={src}
      alt="SalGorythm"
      width={variant === 'icon' ? 36 : 200}
      height={36}
      className={`${size} shrink-0 ${className}`}
      decoding="async"
    />
  )
}
