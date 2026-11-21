import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Decrypt, Magnet } from './fx'

type Variant = 'solid' | 'line' | 'signal'
const base =
  'group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden h-14 px-7 text-[13px] font-semibold tracking-[0.04em] wide transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none'
const variants: Record<Variant, string> = {
  solid: 'bg-paper text-void',
  line: 'border border-paper/30 text-paper hover:border-paper',
  signal: 'bg-signal text-paper',
}

/** Fill wipes up from the bottom on hover. */
function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  const fill = variant === 'solid' ? 'bg-signal' : 'bg-paper'
  const hoverText = variant === 'solid' ? 'group-hover/btn:text-paper' : 'group-hover/btn:text-void'
  return (
    <>
      <span aria-hidden className={`absolute inset-0 ${fill} translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-y-0`} />
      <span className={`relative z-10 inline-flex items-center gap-3 transition-colors duration-300 ${hoverText}`}>{children}</span>
    </>
  )
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; magnetic?: boolean }
export function Button({ variant = 'solid', magnetic, className = '', children, ...rest }: BtnProps) {
  const el = (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  )
  return magnetic ? <Magnet>{el}</Magnet> : el
}

export function ButtonLink({ to, variant = 'solid', magnetic, className = '', children, onClick }: { to: string; variant?: Variant; magnetic?: boolean; className?: string; children: ReactNode; onClick?: (e: React.MouseEvent) => void }) {
  const el = (
    <Link to={to} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  )
  return magnetic ? <Magnet>{el}</Magnet> : el
}

/** Small terminal-style path shown above section titles: it encodes where you are on the page. */
export function Path({ children }: { children: string }) {
  return <p className="mb-5 font-mono text-xs text-mute"><span className="text-signal">~/</span>{children}</p>
}

export function SectionTitle({ path, title, intro, compact, as = 'h2' }: { path: string; title: string; intro?: string; compact?: boolean; as?: 'h1' | 'h2' }) {
  return (
    <div className="mb-12 md:mb-16">
      <Path>{path}</Path>
      <Decrypt as={as} text={title} className={`display block max-w-[16ch] ${compact ? 'text-[clamp(2.4rem,4.6vw,4.6rem)]' : 'text-[clamp(2.4rem,6.5vw,6rem)]'}`} />
      {intro && <p className="mt-6 max-w-lg text-lg text-paper/70">{intro}</p>}
    </div>
  )
}
