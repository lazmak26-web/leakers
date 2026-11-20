import { Search, Trash2, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categories, categoryById, products } from '../data/products'
import { gsap, lockScroll, money } from '../lib/motion'
import { useShop } from '../store/shop'
import { ProductArt } from './ProductArt'
import { Button, ButtonLink, QtyStepper } from './ui'

/** Moves focus into an open dialog and returns it on close. */
function useDialogFocus(open: boolean, ref: React.RefObject<HTMLElement | null>, initial?: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const t = window.setTimeout(() => (initial?.current ?? ref.current)?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !ref.current) return
      const f = ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])')
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { window.clearTimeout(t); document.removeEventListener('keydown', onKey); prev?.focus?.() }
  }, [open, ref, initial])
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, subtotal, savings, setQty, removeFromCart, notify, addToCart } = useShop()
  const panel = useRef<HTMLDivElement>(null)
  const scrim = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const r = root.current, p = panel.current, s = scrim.current
    if (!r || !p || !s) return
    lockScroll(cartOpen)
    if (cartOpen) {
      gsap.set(r, { visibility: 'visible' })
      gsap.to(s, { autoAlpha: 1, duration: 0.4 })
      gsap.fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: 'expo.out' })
    } else {
      gsap.to(s, { autoAlpha: 0, duration: 0.3 })
      gsap.to(p, { xPercent: 100, duration: 0.45, ease: 'expo.in', onComplete: () => { gsap.set(r, { visibility: 'hidden' }) } })
    }
  }, [cartOpen])

  useDialogFocus(cartOpen, panel)
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [setCartOpen])

  return (
    <div ref={root} className="invisible fixed inset-0 z-[60]" aria-hidden={!cartOpen}>
      <div ref={scrim} className="absolute inset-0 bg-void/70 opacity-0 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Shopping cart" tabIndex={-1} className="absolute inset-y-0 right-0 flex w-full flex-col bg-coal outline-none sm:w-[460px]">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-bold wide">Cart <span className="text-mute">({cartItems.reduce((s, i) => s + i.qty, 0)})</span></h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="grid h-10 w-10 place-items-center hover:text-signal"><X size={20} /></button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center gap-5 px-6">
            <div className="h-5 w-32 bg-paper" aria-hidden />
            <p className="display text-4xl">Nothing here yet.</p>
            <p className="text-mute">Every file is delivered the moment you pay. Start with the best sellers.</p>
            <div><ButtonLink to="/explore" variant="solid" onClick={() => setCartOpen(false)}>Browse products</ButtonLink></div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6" data-lenis-prevent>
              {cartItems.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link to={`/product/${product.slug}`} onClick={() => setCartOpen(false)} className="w-20 shrink-0">
                    <ProductArt kind={product.art.kind} seed={product.art.seed} label={product.art.label} className="aspect-[4/5] w-full" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={`/product/${product.slug}`} onClick={() => setCartOpen(false)} className="block truncate font-semibold hover:text-signal">{product.name}</Link>
                        <p className="text-sm text-mute">{categoryById(product.category).name}</p>
                      </div>
                      <span className="font-semibold tabular-nums">{money(product.price * qty)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <QtyStepper value={qty} onChange={(n) => setQty(product.id, n)} label={product.name} />
                      <button
                        onClick={() => {
                          removeFromCart(product.id)
                          notify(`Removed ${product.name}`, { label: 'Undo', onClick: () => addToCart(product.id, qty) })
                        }}
                        className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-signal"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-line px-6 py-6">
              {savings > 0 && (
                <div className="flex justify-between text-sm"><span className="text-mute">You save</span><span className="text-signal">−{money(savings)}</span></div>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-mute">Subtotal</span>
                <span className="text-2xl font-bold wide tabular-nums">{money(subtotal)}</span>
              </div>
              <p className="text-xs text-mute">Digital products. No shipping. Taxes calculated at checkout.</p>
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink to="/cart" variant="line" className="w-full" onClick={() => setCartOpen(false)}>View cart</ButtonLink>
                <ButtonLink to="/checkout" variant="solid" className="w-full" onClick={() => setCartOpen(false)}>Checkout</ButtonLink>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products.filter((p) => p.trending).slice(0, 5)
    return products
      .filter((p) => [p.name, p.tagline, categoryById(p.category).name, p.code].join(' ').toLowerCase().includes(s))
      .slice(0, 8)
  }, [q])

  useEffect(() => setActive(0), [q])

  useLayoutEffect(() => {
    const r = root.current
    if (!r) return
    lockScroll(searchOpen)
    if (searchOpen) {
      gsap.set(r, { visibility: 'visible' })
      gsap.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
      gsap.fromTo(r.querySelector('[data-panel]'), { y: -30 }, { y: 0, duration: 0.6, ease: 'expo.out' })
    } else {
      gsap.to(r, { autoAlpha: 0, duration: 0.25, onComplete: () => { gsap.set(r, { visibility: 'hidden' }); setQ('') } })
    }
  }, [searchOpen])

  useDialogFocus(searchOpen, root, input)

  const go = (slug: string) => { setSearchOpen(false); navigate(`/product/${slug}`) }
  const submitAll = () => { setSearchOpen(false); navigate(`/explore?q=${encodeURIComponent(q.trim())}`) }

  return (
    <div ref={root} className="invisible fixed inset-0 z-[70] bg-void/95 backdrop-blur" role="dialog" aria-modal="true" aria-label="Search products" onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}>
      <div data-panel className="shell pt-6 md:pt-14">
        <div className="flex items-center justify-between">
          <span className="text-sm text-mute">Search {products.length} products</span>
          <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="grid h-10 w-10 place-items-center hover:text-signal"><X size={22} /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (results[active] && q) go(results[active].slug); else submitAll() }}
          className="mt-6 flex items-center gap-4 border-b border-paper pb-4"
          role="search"
        >
          <Search size={28} className="shrink-0 text-mute" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
            }}
            placeholder="UI kit, LUTs, Notion…"
            aria-label="Search products"
            aria-controls="search-results"
            className="w-full bg-transparent text-3xl font-bold wide tracking-tight outline-none placeholder:text-ash md:text-6xl"
          />
        </form>
        <p className="mt-6 text-sm text-mute">{q ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Trending right now'}</p>
        <ul id="search-results" className="mt-3 divide-y divide-line" data-lenis-prevent>
          {results.map((p, i) => (
            <li key={p.id}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => go(p.slug)}
                className={`flex w-full items-center gap-4 py-3 text-left transition-colors ${i === active ? 'text-paper' : 'text-mute'}`}
              >
                <ProductArt kind={p.art.kind} seed={p.art.seed} label={p.art.label} className="aspect-[4/5] w-12 shrink-0" />
                <span className="flex-1 truncate text-lg font-semibold md:text-2xl">{p.name}</span>
                <span className="hidden text-sm md:inline">{categoryById(p.category).name}</span>
                <span className="w-16 text-right tabular-nums">{money(p.price)}</span>
              </button>
            </li>
          ))}
        </ul>
        {q && results.length === 0 && (
          <div className="py-10">
            <p className="text-xl">No products match “{q}”.</p>
            <p className="mt-2 text-mute">Try a category instead:</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c.id} onClick={() => { setSearchOpen(false); navigate(`/explore?category=${c.id}`) }} className="border border-line px-3 py-2 text-sm hover:border-paper">
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {q && results.length > 0 && (
          <div className="mt-6"><Button variant="line" onClick={submitAll}>See all results</Button></div>
        )}
      </div>
    </div>
  )
}

export function Toasts() {
  const { toasts } = useShop()
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 flex-col gap-2 md:left-auto md:right-6 md:translate-x-0" aria-live="polite" role="status">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-center justify-between gap-4 border-l-2 border-signal bg-paper px-4 py-3 text-sm font-medium text-void shadow-2xl animate-[toast_.5s_var(--ease-out-expo)]">
          <span>{t.message}</span>
          {t.action && <button onClick={t.action.onClick} className="shrink-0 font-bold underline underline-offset-4">{t.action.label}</button>}
        </div>
      ))}
      <style>{`@keyframes toast{from{transform:translateY(20px);opacity:0}}`}</style>
    </div>
  )
}
