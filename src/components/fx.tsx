/**
 * Motion primitives. Magnet and SplitText follow the React Bits component APIs
 * (reactbits.dev), re-implemented on GSAP so the site runs a single animation engine.
 */
import { useEffect, useLayoutEffect, useRef, type ElementType, type ReactNode, type RefObject } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'

/* ---------- Magnet (React Bits) ---------- */
export function Magnet({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      xTo((e.clientX - (b.left + b.width / 2)) * strength)
      yTo((e.clientY - (b.top + b.height / 2)) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return <span ref={ref} className={`inline-block will-change-transform ${className}`}>{children}</span>
}

/* ---------- SplitText (React Bits) ---------- */
interface SplitProps {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  /** animate when scrolled into view instead of on mount */
  onScroll?: boolean
}
export function SplitText({ text, as: Tag = 'span', className = '', delay = 0, stagger = 0.06, onScroll = false }: SplitProps) {
  const ref = useRef<HTMLElement>(null)
  const words = text.split(' ')
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-w]'), {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger,
        delay,
        scrollTrigger: onScroll ? { trigger: el, start: 'top 88%', once: true } : undefined,
      })
    }, el)
    return () => ctx.revert()
  }, [text, delay, stagger, onScroll])
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top">
          <span data-w className="inline-block">{w}{i < words.length - 1 ? ' ' : ''}</span>
        </span>
      ))}
    </Tag>
  )
}

/* ---------- Scroll reveal for groups ---------- */
export function useReveal<T extends HTMLElement>(selector = '[data-reveal]', deps: unknown[] = []): RefObject<T | null> {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>(selector)
      if (!items.length) return
      gsap.set(items, { y: 40, autoAlpha: 0 })
      ScrollTrigger.batch(items, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

/* ---------- DecryptedText (React Bits) ---------- */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/\\_-+=!?'
interface DecryptProps {
  text: string
  as?: ElementType
  className?: string
  /** ms per character settling */
  speed?: number
  delay?: number
  /** start when scrolled into view (default) or immediately */
  trigger?: 'view' | 'mount' | 'hover'
}
export function Decrypt({ text, as: Tag = 'span', className = '', speed = 28, delay = 0, trigger = 'view' }: DecryptProps) {
  const ref = useRef<HTMLElement>(null)
  const run = useRef<() => void>(() => {})
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) { el.textContent = text; return }
    let raf = 0
    let start = 0
    const total = text.length * speed + 300
    const frame = (t: number) => {
      if (!start) start = t
      const elapsed = t - start
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === ' ' || ch === '\n') { out += ch; continue }
        out += elapsed > i * speed + 260 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      el.textContent = out
      if (elapsed < total) raf = requestAnimationFrame(frame)
      else el.textContent = text
    }
    run.current = () => { cancelAnimationFrame(raf); start = 0; raf = requestAnimationFrame(frame) }

    if (trigger === 'hover') { el.textContent = text; return () => cancelAnimationFrame(raf) }
    // scramble immediately so the final text never flashes before the effect
    el.textContent = text.replace(/[^\s]/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0])
    let timer = 0
    if (trigger === 'mount') {
      timer = window.setTimeout(() => run.current(), delay)
      return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { timer = window.setTimeout(() => run.current(), delay); io.disconnect() }
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [text, speed, delay, trigger])
  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      onMouseEnter={trigger === 'hover' ? () => run.current() : undefined}
    >
      {text}
    </Tag>
  )
}
