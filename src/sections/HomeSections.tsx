import { ArrowUpRight, Check, Lock, Sparkles, Zap } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { SplitText, useReveal } from '../components/fx'
import { ProductArt } from '../components/ProductArt'
import { ProductCard } from '../components/ProductCard'
import { ButtonLink } from '../components/ui'
import { categories, products } from '../data/products'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'

/* ---------- ScrollVelocity strip (React Bits pattern) ---------- */
export function VelocityStrip() {
  const track = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = track.current
    if (!el || prefersReducedMotion()) return
    const tween = gsap.to(el, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity() / 300
        gsap.to(tween, { timeScale: 1 + Math.min(Math.abs(v), 6), duration: 0.2, overwrite: true })
        gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.2 })
      },
    })
    return () => { tween.kill(); st.kill() }
  }, [])
  const words = categories.map((c) => c.name)
  return (
    <div className="overflow-hidden border-y border-line py-5" aria-hidden>
      <div ref={track} className="flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={w + k} className="flex items-center whitespace-nowrap px-8 text-3xl font-bold condensed uppercase tracking-tight text-paper/80 md:text-5xl">
                {w}
                <span className="ml-16 inline-block h-3 w-6 bg-signal" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionHead({ title, intro, link }: { title: string; intro?: string; link?: { to: string; label: string } }) {
  return (
    <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
      <div>
        <SplitText as="h2" text={title} onScroll className="display block text-[clamp(2.5rem,7vw,6.5rem)]" />
        {intro && <p className="mt-5 max-w-md text-mute">{intro}</p>}
      </div>
      {link && (
        <Link to={link.to} className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold">
          <span className="link-wipe">{link.label}</span>
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

/* ---------- Featured: asymmetric grid ---------- */
export function Featured() {
  const ref = useReveal<HTMLElement>()
  const list = products.filter((p) => p.featured)
  const [a, b, c, d, e, f] = [list[list.length - 1], ...list.slice(0, -1)]
  return (
    <section ref={ref} className="shell py-24 md:py-36">
      <SectionHead title="Picked this week" intro="Six products our team actually uses. Each one is updated, documented and ready to download." link={{ to: '/explore', label: 'All products' }} />
      <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:grid-cols-12 md:gap-y-20">
        <ProductCard product={a} size="large" className="sm:col-span-2 md:col-span-6" />
        <ProductCard product={b} className="md:col-span-3 md:mt-48" />
        <ProductCard product={c} className="md:col-span-3" />
        <ProductCard product={d} className="md:col-span-4" />
        <ProductCard product={e} className="md:col-span-4 md:mt-24" />
        <ProductCard product={f} className="md:col-span-4 md:mt-48" />
      </div>
    </section>
  )
}

/* ---------- Categories: typographic index with cursor-follow preview ---------- */
export function CategoryIndex() {
  const ref = useReveal<HTMLElement>()
  const preview = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = preview.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e: PointerEvent) => { xTo(e.clientX + 24); yTo(e.clientY - 140) }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useLayoutEffect(() => {
    if (preview.current) gsap.to(preview.current, { autoAlpha: hover === null ? 0 : 1, scale: hover === null ? 0.85 : 1, duration: 0.4, ease: 'expo.out' })
  }, [hover])

  const counts = (id: string) => products.filter((p) => p.category === id).length

  return (
    <section ref={ref} className="shell py-24 md:py-36">
      <SectionHead title="Categories" intro="Seven shelves. Everything on them is something we would buy ourselves." />
      <ul onPointerLeave={() => setHover(null)} className="border-t border-line">
        {categories.map((c, i) => (
          <li key={c.id} data-reveal className="border-b border-line">
            <Link
              to={`/explore?category=${c.id}`}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="group flex items-center gap-4 py-5 md:gap-10 md:py-7"
            >
              <span className="aspect-[4/5] w-14 shrink-0 overflow-hidden md:hidden">
                <ProductArt kind={c.art} seed={i + 2} label={c.name.slice(0, 2)} className="h-full w-full" />
              </span>
              <span className={`display min-w-0 flex-1 whitespace-nowrap text-[clamp(1.6rem,5.2vw,5rem)] transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] md:group-hover:translate-x-6 ${hover !== null && hover !== i ? 'md:text-paper/25' : ''}`}>
                {c.name}
              </span>
              <span className="hidden max-w-[260px] text-sm text-mute lg:block">{c.blurb}</span>
              <span className="w-20 shrink-0 text-right text-sm text-mute tabular-nums">{counts(c.id)} items</span>
              <ArrowUpRight className="hidden shrink-0 text-signal opacity-0 transition-opacity group-hover:opacity-100 md:block" />
            </Link>
          </li>
        ))}
      </ul>
      <div ref={preview} aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/5] w-56 opacity-0 md:block">
        {categories.map((c, i) => (
          <div key={c.id} className={`absolute inset-0 transition-opacity duration-300 ${hover === i ? 'opacity-100' : 'opacity-0'}`}>
            <ProductArt kind={c.art} seed={i + 2} label={c.name.slice(0, 2)} className="h-full w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Trending: pinned horizontal track on desktop, swipe on mobile ---------- */
export function Trending() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const list = products.filter((p) => p.trending)

  useLayoutEffect(() => {
    const s = section.current, t = track.current
    if (!s || !t || prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const distance = () => t.scrollWidth - window.innerWidth + 48
      gsap.to(t, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: s,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => progress.current && gsap.set(progress.current, { scaleX: self.progress }),
        },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={section} className="relative overflow-hidden bg-coal py-20 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="shell mb-10 flex items-end justify-between gap-6">
        <h2 className="display text-[clamp(2.5rem,7vw,6.5rem)]">Trending now</h2>
        <div className="hidden w-64 lg:block">
          <p className="mb-3 text-sm text-mute">Most downloaded in the last 30 days</p>
          <div className="h-px w-full bg-line"><div ref={progress} className="h-px origin-left scale-x-0 bg-signal" /></div>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-none max-lg:snap-x max-lg:snap-mandatory lg:overflow-visible" data-lenis-prevent-touch>
        <div ref={track} className="flex w-max gap-5 px-4 md:px-8 lg:gap-8 lg:px-12">
          {list.map((p, i) => (
            <div key={p.id} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[25vw] lg:max-w-[380px]">
              <div className="mb-3 flex items-baseline justify-between text-sm text-mute">
                <span className="tabular-nums">No. {i + 1} this month</span>
                <span>{p.sales.toLocaleString('en-US')} sold</span>
              </div>
              <ProductCard product={p} size="compact" />
            </div>
          ))}
          <Link to="/explore?sort=popular" className="group grid w-[60vw] shrink-0 snap-start place-items-center border border-line sm:w-[30vw] lg:w-[20vw]">
            <span className="flex flex-col items-center gap-3 text-center">
              <ArrowUpRight size={40} className="transition-transform duration-500 group-hover:rotate-45" />
              <span className="font-semibold">See all best sellers</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------- Why LEAKERS ---------- */
const reasons = [
  { icon: Zap, title: 'Instant digital delivery', body: 'Your download link arrives the second payment clears, in your inbox and in your account. Re-download any time.', stat: '< 3 sec', statLabel: 'average delivery' },
  { icon: Sparkles, title: 'Premium quality', body: 'We reject most of what is submitted. Every product is opened, tested and used on a real project before it is listed.', stat: '1 in 9', statLabel: 'submissions accepted' },
  { icon: Lock, title: 'Secure checkout', body: 'Payments are encrypted end to end and we never store card details. Fourteen-day refunds on anything that does not work as described.', stat: '14 days', statLabel: 'refund window' },
  { icon: Check, title: 'Exclusive products', body: 'Limited packs and bundle-only files you will not find on any other marketplace. When a run sells out, it does not come back.', stat: '500', statLabel: 'licences per drop' },
]

export function WhyLeakers() {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row) => {
        gsap.from(row.querySelector('[data-bar]'), { scaleX: 0, transformOrigin: 'left', ease: 'none', scrollTrigger: { trigger: row, start: 'top 85%', end: 'top 45%', scrub: true } })
        gsap.from(row.querySelectorAll('[data-in]'), { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: row, start: 'top 85%', once: true } })
      })
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="shell py-24 md:py-36">
      <SectionHead title="Why LEAKERS?" />
      <div>
        {reasons.map(({ icon: Icon, title, body, stat, statLabel }) => (
          <div key={title} data-row className="relative grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-14">
            <span className="absolute inset-x-0 top-0 h-px bg-line" />
            <span data-bar className="absolute left-0 top-0 h-px w-full bg-paper" />
            <div data-in className="flex items-start gap-4 md:col-span-6">
              <Icon size={22} strokeWidth={1.5} className="mt-2 shrink-0 text-signal" />
              <h3 className="text-3xl font-bold wide tracking-tight md:text-5xl">{title}</h3>
            </div>
            <p data-in className="max-w-md text-mute md:col-span-4">{body}</p>
            <div data-in className="md:col-span-2 md:text-right">
              <p className="text-3xl font-bold condensed">{stat}</p>
              <p className="text-sm text-mute">{statLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Newsletter ---------- */
export function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'loading' | 'done'>('idle')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setState('error'); return }
    setState('loading')
    window.setTimeout(() => {
      try {
        const list = JSON.parse(localStorage.getItem('lkr.newsletter') ?? '[]') as string[]
        localStorage.setItem('lkr.newsletter', JSON.stringify([...new Set([...list, email.trim().toLowerCase()])]))
      } catch { /* ignore */ }
      setState('done')
    }, 700)
  }
  return (
    <section className="shell py-24 md:py-36">
      <div className="relative overflow-hidden bg-signal px-5 py-16 text-void md:px-14 md:py-24">
        <SplitText as="h2" text="STAY AHEAD OF THE GAME." onScroll className="display block max-w-5xl text-[clamp(2.6rem,8.5vw,8.5rem)]" />
        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
          <p className="max-w-sm text-lg font-medium md:col-span-4">New drops, limited packs and early access, once a week. No spam, unsubscribe in one click.</p>
          {state === 'done' ? (
            <div className="md:col-span-8" role="status">
              <p className="text-3xl font-bold wide md:text-4xl">You’re on the list.</p>
              <p className="mt-2 font-medium">We sent a confirmation to {email.trim()}.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="md:col-span-8">
              <label htmlFor="nl-email" className="mb-2 block text-sm font-semibold">Email address</label>
              <div className={`flex items-center border-b-2 ${state === 'error' ? 'border-paper' : 'border-void'}`}>
                <input
                  id="nl-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
                  placeholder="you@studio.com"
                  aria-invalid={state === 'error'}
                  aria-describedby={state === 'error' ? 'nl-err' : undefined}
                  className="min-w-0 flex-1 bg-transparent py-3 text-2xl font-semibold outline-none placeholder:text-void/40 md:text-4xl"
                />
                <button type="submit" disabled={state === 'loading'} className="group flex h-14 shrink-0 items-center gap-3 bg-void px-5 text-sm font-semibold text-paper transition-colors hover:bg-paper hover:text-void md:px-8">
                  {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
                  <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
                </button>
              </div>
              {state === 'error' && <p id="nl-err" className="mt-3 font-semibold text-paper">Enter a valid email address, like name@domain.com.</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export function ClosingCta() {
  return (
    <section className="shell flex flex-col items-start gap-8 py-10 md:flex-row md:items-center md:justify-between">
      <p className="max-w-xl text-2xl font-semibold wide">Over 16 products, every one tested before it ships.</p>
      <ButtonLink to="/explore" magnetic>Browse the catalogue</ButtonLink>
    </section>
  )
}
