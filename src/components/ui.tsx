import { Minus, Plus, Star } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { discountOf } from '../data/products'
import type { Product } from '../data/types'
import { money } from '../lib/motion'
import { MAX_QTY } from '../store/shop'
import { Magnet } from './fx'

type Variant = 'solid' | 'line' | 'signal'
const base =
  'group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden h-14 px-7 text-[13px] font-semibold tracking-[0.04em] wide transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none'
const variants: Record<Variant, string> = {
  solid: 'bg-paper text-void',
  line: 'border border-paper/30 text-paper hover:border-paper',
  signal: 'bg-signal text-paper',
}

/** Button with a fill that wipes in from the bottom on hover. */
function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  const fill = variant === 'solid' ? 'bg-signal' : variant === 'signal' ? 'bg-paper' : 'bg-paper'
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

export function ButtonLink({ to, variant = 'solid', magnetic, className = '', children, onClick }: { to: string; variant?: Variant; magnetic?: boolean; className?: string; children: ReactNode; onClick?: () => void }) {
  const el = (
    <Link to={to} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  )
  return magnetic ? <Magnet>{el}</Magnet> : el
}

export function Price({ product, size = 'md' }: { product: Product; size?: 'md' | 'lg' }) {
  const d = discountOf(product)
  return (
    <span className="inline-flex items-baseline gap-3">
      <span className={size === 'lg' ? 'text-4xl font-bold wide tracking-tight' : 'text-base font-semibold'}>{money(product.price)}</span>
      {d > 0 && <span className={`text-mute line-through ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>{money(product.compareAt!)}</span>}
    </span>
  )
}

export function DiscountTag({ product }: { product: Product }) {
  const d = discountOf(product)
  if (!d) return null
  return <span className="bg-signal px-2 py-1 text-[11px] font-bold leading-none text-paper">−{d}%</span>
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} strokeWidth={1.5} className={i < Math.round(value) ? 'fill-paper text-paper' : 'text-paper/25'} />
      ))}
    </span>
  )
}

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex h-10 items-center border border-line" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(value - 1)} className="grid h-full w-10 place-items-center text-mute hover:text-paper">
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= MAX_QTY} onClick={() => onChange(value + 1)} className="grid h-full w-10 place-items-center text-mute hover:text-paper disabled:opacity-30">
        <Plus size={14} />
      </button>
    </div>
  )
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-5 border-t border-line py-16">
      <div className="h-6 w-40 bg-paper" aria-hidden />
      <h2 className="display text-4xl md:text-5xl">{title}</h2>
      <p className="max-w-md text-mute">{body}</p>
      {action}
    </div>
  )
}

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="shell pt-36 pb-12 md:pt-44 md:pb-16">
      <h1 className="display text-[clamp(3rem,10vw,9rem)]">{title}</h1>
      {intro && <p className="mt-6 max-w-xl text-lg text-mute">{intro}</p>}
      {children}
    </header>
  )
}
