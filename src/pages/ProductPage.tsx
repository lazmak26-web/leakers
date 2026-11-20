import { ArrowLeft, Check, Download, Heart, RefreshCw, ShieldCheck } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useReveal } from '../components/fx'
import { ProductArt } from '../components/ProductArt'
import { ProductCard } from '../components/ProductCard'
import { Button, ButtonLink, DiscountTag, EmptyState, Price, QtyStepper, Stars } from '../components/ui'
import { categoryById, discountOf, productBySlug, products } from '../data/products'
import { gsap, money, prefersReducedMotion } from '../lib/motion'
import { useShop } from '../store/shop'

const views = ['Cover', 'Detail', 'Close-up', 'Overview']

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = productBySlug(slug)
  const { addToCart, toggleWishlist, isWished, notify, setCartOpen } = useShop()
  const navigate = useNavigate()
  const [view, setView] = useState(0)
  const [qty, setQty] = useState(1)
  const [reviewSort, setReviewSort] = useState<'recent' | 'rating'>('recent')
  const stage = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const relatedRef = useReveal<HTMLDivElement>('[data-reveal]', [slug])

  useEffect(() => {
    setView(0); setQty(1)
    document.title = product ? `${product.name} — LEAKERS` : 'Product not found — LEAKERS'
  }, [slug, product])

  // gallery image swap: clip wipe
  useLayoutEffect(() => {
    if (!stage.current || prefersReducedMotion()) return
    gsap.fromTo(stage.current, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.8, ease: 'expo.out' })
  }, [view])

  useLayoutEffect(() => {
    if (!infoRef.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('[data-in]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.5 })
    }, infoRef)
    return () => ctx.revert()
  }, [slug])

  const related = useMemo(() => {
    if (!product) return []
    const same = products.filter((p) => p.category === product.category && p.id !== product.id)
    const rest = products.filter((p) => p.category !== product.category && p.trending && p.id !== product.id)
    return [...same, ...rest].slice(0, 4)
  }, [product])

  if (!product) {
    return (
      <div className="shell pt-40">
        <EmptyState title="File not found." body="This product was removed or the link is wrong. Search the catalogue to find what you were looking for." action={<ButtonLink to="/explore">Browse products</ButtonLink>} />
      </div>
    )
  }

  const wished = isWished(product.id)
  const cat = categoryById(product.category)
  const reviews = [...product.reviews].sort((a, b) => (reviewSort === 'recent' ? b.date.localeCompare(a.date) : b.rating - a.rating))
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, pct: n === 5 ? 78 : n === 4 ? 16 : n === 3 ? 4 : n === 2 ? 1 : 1 }))

  const add = () => {
    addToCart(product.id, qty)
    notify(`${qty} × ${product.name} added to cart`, { label: 'View cart', onClick: () => setCartOpen(true) })
  }
  const buyNow = () => { addToCart(product.id, qty); navigate('/checkout') }

  return (
    <>
      <div className="shell pt-24 md:pt-28">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-mute">
          <Link to="/explore" className="inline-flex items-center gap-1 hover:text-paper"><ArrowLeft size={14} /> Explore</Link>
          <span>/</span>
          <Link to={`/explore?category=${cat.id}`} className="hover:text-paper">{cat.name}</Link>
          <span>/</span>
          <span className="truncate text-paper">{product.name}</span>
        </nav>
      </div>

      <section className="shell grid gap-10 pt-8 lg:grid-cols-12 lg:gap-12">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden bg-coal">
              <div ref={stage} className="aspect-[4/5] lg:aspect-square">
                <ProductArt kind={product.art.kind} seed={product.art.seed} label={product.art.label} code={product.code} view={view} className="h-full w-full" />
              </div>
              <div className="absolute left-4 top-4 flex gap-2"><DiscountTag product={product} />{product.limited && <span className="bg-paper px-2 py-1 text-[11px] font-bold leading-none text-void">Limited run</span>}</div>
              <span className="absolute bottom-4 right-4 bg-void/70 px-2 py-1 text-xs text-mute backdrop-blur">{views[view]} · {view + 1}/{views.length}</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label="Product previews">
              {views.map((v, i) => (
                <button key={v} role="tab" aria-selected={view === i} aria-label={`${v} preview`} onClick={() => setView(i)} className={`relative overflow-hidden border transition-colors ${view === i ? 'border-paper' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <ProductArt kind={product.art.kind} seed={product.art.seed} label={product.art.label} view={i} className="aspect-[4/5] w-full" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buy box */}
        <div ref={infoRef} className="lg:col-span-5">
          <p data-in className="font-mono text-xs text-mute">{product.code} · v{product.version}</p>
          <h1 data-in className="display mt-3 text-[clamp(2.6rem,6vw,5rem)]">{product.name}</h1>
          <p data-in className="mt-5 text-lg text-paper/80">{product.tagline}</p>
          <a data-in href="#reviews" className="mt-5 flex items-center gap-3 text-sm">
            <Stars value={product.rating} />
            <span>{product.rating.toFixed(1)}</span>
            <span className="link-wipe text-mute">{product.reviewCount} reviews</span>
            <span className="text-mute">· {product.sales.toLocaleString('en-US')} sold</span>
          </a>

          <div data-in className="mt-8 flex items-center gap-4 border-y border-line py-6">
            <Price product={product} size="lg" />
            {discountOf(product) > 0 && <span className="text-sm text-signal">Save {money(product.compareAt! - product.price)}</span>}
          </div>

          <div data-in className="mt-6 flex items-center gap-4">
            <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label={product.name} />
            <span className="text-sm text-mute">{qty > 1 ? `${qty} licences` : '1 licence'} · {product.license}</span>
          </div>

          <div data-in className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Button variant="line" onClick={add} className="w-full">Add to cart</Button>
            <Button variant="solid" onClick={buyNow} className="w-full">Buy now · {money(product.price * qty)}</Button>
            <button
              onClick={() => { toggleWishlist(product.id); notify(wished ? 'Removed from wishlist' : 'Saved to wishlist') }}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              className="grid h-14 w-full place-items-center border border-line transition-colors hover:border-paper sm:w-14"
            >
              <Heart size={18} className={wished ? 'fill-signal text-signal' : ''} />
            </button>
          </div>

          <ul data-in className="mt-8 space-y-3 text-sm text-paper/80">
            <li className="flex items-center gap-3"><Download size={16} className="text-signal" /> Instant download after payment · {product.size}</li>
            <li className="flex items-center gap-3"><RefreshCw size={16} className="text-signal" /> Free updates · last updated {new Date(product.updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</li>
            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-signal" /> Secure checkout · 14-day refund policy</li>
          </ul>

          <div data-in className="mt-12 space-y-4 text-paper/80">
            {product.description.map((d, i) => <p key={i} className="leading-relaxed">{d}</p>)}
          </div>

          <div data-in className="mt-12">
            <h2 className="mb-4 text-xl font-bold wide">What’s included</h2>
            <ul className="divide-y divide-line border-y border-line">
              {product.includes.map((i) => (
                <li key={i} className="flex items-start gap-3 py-3 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-signal" />{i}</li>
              ))}
            </ul>
          </div>

          <div data-in className="mt-12">
            <h2 className="mb-4 text-xl font-bold wide">Compatibility</h2>
            <div className="flex flex-wrap gap-2">
              {product.compatibility.map((c) => <span key={c} className="border border-line px-3 py-1.5 text-sm">{c}</span>)}
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              {[['Format', product.format], ['File size', product.size], ['Version', product.version], ['Licence', product.license]].map(([k, v]) => (
                <div key={k}><dt className="text-mute">{k}</dt><dd className="mt-1">{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="shell mt-28">
        <h2 className="display mb-10 text-[clamp(2.2rem,5vw,4.5rem)]">Features</h2>
        <div className="grid gap-px bg-line md:grid-cols-3">
          {product.features.map((f) => (
            <div key={f.title} className="bg-void p-6 md:p-8">
              <span className="mb-10 block h-2 w-8 bg-signal" />
              <h3 className="text-2xl font-bold wide tracking-tight">{f.title}</h3>
              <p className="mt-3 text-mute">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="shell mt-28 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="display text-[clamp(2.2rem,5vw,4.5rem)]">Reviews</h2>
          <div className="mt-8 flex items-end gap-4">
            <span className="text-7xl font-bold condensed leading-none">{product.rating.toFixed(1)}</span>
            <div className="pb-2"><Stars value={product.rating} size={16} /><p className="mt-1 text-sm text-mute">{product.reviewCount} verified buyers</p></div>
          </div>
          <ul className="mt-8 space-y-2">
            {dist.map(({ n, pct }) => (
              <li key={n} className="flex items-center gap-3 text-sm">
                <span className="w-3 text-mute">{n}</span>
                <span className="h-1 flex-1 bg-ash"><span className="block h-full bg-paper" style={{ width: `${pct}%` }} /></span>
                <span className="w-10 text-right text-mute tabular-nums">{pct}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-8">
          <div className="mb-4 flex items-center justify-end gap-2 text-sm">
            <span className="text-mute">Sort by</span>
            {(['recent', 'rating'] as const).map((s) => (
              <button key={s} onClick={() => setReviewSort(s)} aria-pressed={reviewSort === s} className={`px-3 py-1.5 ${reviewSort === s ? 'bg-paper text-void' : 'text-mute hover:text-paper'}`}>
                {s === 'recent' ? 'Most recent' : 'Highest rated'}
              </button>
            ))}
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {reviews.map((r) => (
              <li key={r.author} className="grid gap-4 py-8 md:grid-cols-[180px_1fr]">
                <div>
                  <p className="font-semibold">{r.author}</p>
                  <p className="text-sm text-mute">{r.role}</p>
                </div>
                <div>
                  <div className="flex items-center gap-3"><Stars value={r.rating} /><span className="text-sm text-mute">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                  <h3 className="mt-3 text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 leading-relaxed text-paper/75">{r.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related */}
      <section className="shell mt-28">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="display text-[clamp(2.2rem,5vw,4.5rem)]">You might also need</h2>
        </div>
        <div ref={relatedRef} className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <div className="h-16 lg:hidden" aria-hidden />
      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-void/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <p className="text-sm text-mute">{money(product.price)}</p>
        </div>
        <Button variant="solid" onClick={add} className="!h-12 shrink-0">Add to cart</Button>
      </div>
    </>
  )
}
