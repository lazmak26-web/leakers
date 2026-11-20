import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Magnet } from '../components/fx'
import { ProductArt } from '../components/ProductArt'
import { ButtonLink } from '../components/ui'
import { productById } from '../data/products'
import { gsap, prefersReducedMotion } from '../lib/motion'

const lines = ['YOUR NEXT', 'DIGITAL', 'ADVANTAGE.']
const stackIds = ['p13', 'p01', 'p05']

const feed = [
  { code: 'LKR-0142', name: 'Obsidian System', city: 'Berlin' },
  { code: 'LKR-0188', name: 'Sodium Night LUTs', city: 'Casablanca' },
  { code: 'LKR-0226', name: 'Rename Pro for Figma', city: 'Seoul' },
  { code: 'LKR-0250', name: 'Blackout Bundle 26', city: 'São Paulo' },
  { code: 'LKR-0240', name: 'The Quiet Rate', city: 'Lyon' },
  { code: 'LKR-0161', name: 'Afterhours Portfolio', city: 'Toronto' },
]

/** A live-looking delivery log — the marketplace's pulse. */
function DeliveryFeed() {
  const [i, setI] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % feed.length), 2800)
    return () => window.clearInterval(t)
  }, [])
  useEffect(() => {
    if (ref.current && !prefersReducedMotion()) gsap.fromTo(ref.current, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
  }, [i])
  const f = feed[i]
  return (
    <p className="flex min-w-0 items-center gap-3 overflow-hidden text-sm text-mute" aria-live="off">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inset-0 animate-ping bg-signal opacity-60" />
        <span className="relative h-2 w-2 bg-signal" />
      </span>
      <span ref={ref} className="truncate">
        <span className="font-mono text-xs text-paper/70">{f.code}</span>
        <span className="mx-2 text-paper">{f.name}</span>
        delivered to {f.city}, just now
      </span>
    </p>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const stack = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = prefersReducedMotion()
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('[data-bar]', { scaleX: 0 })
        gsap.set('[data-line]', { autoAlpha: 1 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
      // 1. redaction bars draw in over each line
      tl.fromTo('[data-bar]', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut', stagger: 0.1 })
        .set('[data-line]', { autoAlpha: 1 })
        // the middle line flashes red before declassifying
        .to('[data-bar="1"]', { backgroundColor: '#FF2020', duration: 0.15 }, '-=0.1')
        // 2. bars retract, revealing the headline
        .to('[data-bar]', { scaleX: 0, transformOrigin: 'right', duration: 0.9, ease: 'expo.inOut', stagger: 0.12 })
        .from('[data-card]', { yPercent: 40, rotate: 0, autoAlpha: 0, duration: 1.4, stagger: 0.12 }, '-=0.9')
        .from('[data-fade]', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, '-=1.1')

      // scroll: covers drift apart, headline lifts
      gsap.to('[data-card="0"]', { yPercent: -18, rotate: -10, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-card="2"]', { yPercent: 22, rotate: 12, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('[data-headline]', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
    }, el)

    // pointer parallax on the stack (fine pointers only)
    const s = stack.current
    let cleanup = () => {}
    if (s && !reduce && window.matchMedia('(pointer: fine)').matches) {
      const xTo = gsap.quickTo(s, 'x', { duration: 1.2, ease: 'power3.out' })
      const yTo = gsap.quickTo(s, 'y', { duration: 1.2, ease: 'power3.out' })
      const rTo = gsap.quickTo(s, 'rotationY', { duration: 1.2, ease: 'power3.out' })
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        xTo(nx * 40); yTo(ny * 30); rTo(nx * 10)
      }
      window.addEventListener('pointermove', onMove)
      cleanup = () => window.removeEventListener('pointermove', onMove)
    }
    return () => { ctx.revert(); cleanup() }
  }, [])

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 md:pt-24">
      {/* product stack */}
      <div className="pointer-events-none absolute inset-0 [perspective:1400px]">
        <div ref={stack} className="absolute right-[-14vw] top-[11%] h-[70vw] w-[62vw] max-md:opacity-50 md:right-[3vw] md:opacity-100 md:top-[14%] md:h-[70vh] md:w-[min(34vw,520px)]">
          {stackIds.map((id, i) => {
            const p = productById(id)!
            const pos = ['left-[-28%] top-[10%] -rotate-[7deg]', 'left-0 top-0 rotate-[2deg] z-10', 'left-[30%] top-[18%] rotate-[9deg]'][i]
            return (
              <div key={id} data-card={i} className={`absolute aspect-[4/5] w-[62%] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] ${pos}`}>
                <ProductArt kind={p.art.kind} seed={p.art.seed} label={p.art.label} code={p.code} className="h-full w-full" />
              </div>
            )
          })}
        </div>
      </div>

      <div className="shell relative z-10 flex flex-1 flex-col justify-center py-10">
        <h1 data-headline className="display text-[clamp(2.6rem,11.2vw,12.5rem)]" aria-label="Your next digital advantage.">
          {lines.map((l, i) => (
            <span key={l} className="relative block w-fit" aria-hidden>
              <span data-line className={`invisible block ${i === 1 ? 'pl-[0.6em] md:pl-[1.2em]' : ''}`}>{l}</span>
              <span data-bar={i} className={`absolute inset-y-[0.06em] -right-[0.05em] bg-paper ${i === 1 ? 'left-[0.55em] md:left-[1.15em]' : 'left-0'}`} />
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          <p data-fade className="max-w-sm text-lg leading-snug text-paper/80 md:col-span-4 md:text-xl">
            Discover premium digital products, exclusive resources, and tools built for creators.
          </p>
          <div data-fade className="flex flex-col gap-3 sm:flex-row md:col-span-8">
            <ButtonLink to="/explore" variant="solid" magnetic className="w-full sm:w-auto">Explore products</ButtonLink>
            <ButtonLink to="/about" variant="line" magnetic className="w-full sm:w-auto">Discover LEAKERS</ButtonLink>
          </div>
        </div>
      </div>

      <div data-fade className="shell relative z-10 flex items-center justify-between gap-6 border-t border-line py-5">
        <DeliveryFeed />
        <Magnet strength={0.2}>
          <span className="hidden whitespace-nowrap text-sm text-mute md:inline">
            <span className="text-paper">68,000+</span> files delivered this year
          </span>
        </Magnet>
      </div>
    </section>
  )
}
