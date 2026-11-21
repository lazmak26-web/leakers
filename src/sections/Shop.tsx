import { ArrowUpRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Decrypt, useReveal } from '../components/fx'
import { SectionTitle } from '../components/ui'
import { site } from '../data/team'

/**
 * Products are loaded from /public/products/products.json.
 * Images are /public/products/icon.png, icon1.png, icon2.png … in the same order.
 * See public/products/README.md.
 */
interface ShopItem {
  name: string
  category?: string
  description?: string
  price?: string
  badge?: string
}

/** Accept only plain strings of reasonable length, so a typo in products.json can't break the page. */
const str = (v: unknown, max: number) => (typeof v === 'string' || typeof v === 'number' ? String(v).slice(0, max) : '')
function sanitize(data: unknown): ShopItem[] {
  if (!Array.isArray(data)) return []
  return data.slice(0, 60).flatMap((d) => {
    if (!d || typeof d !== 'object') return []
    const o = d as Record<string, unknown>
    const name = str(o.name, 80)
    if (!name) return []
    return [{ name, category: str(o.category, 40), description: str(o.description, 400), price: str(o.price, 30), badge: str(o.badge, 20) }]
  })
}

const imageFor = (i: number) => `/products/icon${i === 0 ? '' : i}.png`

/** Generated cover when a product has no image. */
function Cover({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 2166136261
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
    const rnd = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h ^= h >>> 13; return ((h >>> 0) % 1000) / 1000 }
    const glyphs = '01<>/{}#$%&*+=ABCDEF'
    return Array.from({ length: 8 * 10 }, (_, i) => ({ i, g: glyphs[Math.floor(rnd() * glyphs.length)], hot: rnd() > 0.9, on: rnd() > 0.45 }))
  }, [seed])
  return (
    <div aria-hidden className="grid h-full w-full grid-cols-8 place-items-center bg-coal p-4 font-mono text-[11px]">
      {cells.map((c) => (
        <span key={c.i} className={c.hot ? 'text-signal' : c.on ? 'text-paper/25 transition-colors duration-300 group-hover:text-paper/60' : 'text-transparent'}>{c.g}</span>
      ))}
    </div>
  )
}

function Product({ p, index }: { p: ShopItem; index: number }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <article data-reveal className="group relative flex flex-col bg-void">
      <div className="relative aspect-[4/3] overflow-hidden bg-coal">
        {imgOk
          ? <img src={imageFor(index)} alt={p.name} loading="lazy" onError={() => setImgOk(false)} className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105" />
          : <Cover seed={p.name} />}
        {p.badge && <span className="absolute left-3 top-3 bg-signal px-2 py-1 text-[11px] font-bold leading-none">{p.badge}</span>}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-signal opacity-0 shadow-[0_0_16px_2px_rgba(255,32,32,0.7)] group-hover:animate-[scan_1.2s_ease-in-out] group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] text-mute">{p.category}</span>
          {p.price && <span className="font-semibold wide">{p.price}</span>}
        </div>
        <Decrypt as="h3" trigger="hover" text={p.name} className="block text-2xl font-bold wide tracking-tight" />
        {p.description && <p className="flex-1 text-sm text-paper/70">{p.description}</p>}
        <a
          href={site.discord}
          target="_blank"
          rel="noreferrer noopener"
          className="group/b relative mt-auto inline-flex h-12 items-center justify-between overflow-hidden bg-signal px-5 text-[13px] font-semibold wide"
          aria-label={`Order ${p.name} on Discord`}
        >
          <span aria-hidden className="absolute inset-0 translate-y-full bg-paper transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/b:translate-y-0" />
          <span className="relative transition-colors group-hover/b:text-void">Order on Discord</span>
          <ArrowUpRight size={16} className="relative transition-[color,transform] duration-300 group-hover/b:rotate-45 group-hover/b:text-void" />
        </a>
      </div>
    </article>
  )
}

export function Shop({ asPage = false }: { asPage?: boolean }) {
  const [items, setItems] = useState<ShopItem[] | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    fetch('/products/products.json', { cache: 'no-cache' })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
      .then((data: unknown) => setItems(sanitize(data)))
      .catch(() => setFailed(true))
  }, [])
  const ref = useReveal<HTMLElement>('[data-reveal]', [items?.length ?? 0])

  return (
    <section id="shop" ref={ref} className={`shell ${asPage ? 'pb-24 pt-32 md:pb-36 md:pt-44' : 'py-24 md:py-36'}`}>
      <SectionTitle as={asPage ? 'h1' : 'h2'} path="shop" title="Shop" intro="Services, tools and training from the team. Pick one and order it directly with us on Discord." />
      {failed ? (
        <p className="border border-line p-8 text-paper/70">The shop could not load. Refresh the page, or <a className="link-wipe text-paper" href={site.discord} target="_blank" rel="noreferrer noopener">ask us on Discord</a>.</p>
      ) : !items ? (
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading products" role="status">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-void"><div className="aspect-[4/3] bg-coal" /><div className="space-y-3 p-6"><div className="h-4 w-1/3 bg-coal" /><div className="h-6 w-2/3 bg-coal" /><div className="h-12 bg-coal" /></div></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="border border-line p-8 text-paper/70">New products are coming soon. <a className="link-wipe text-paper" href={site.discord} target="_blank" rel="noreferrer noopener">Join our Discord</a> to hear first.</p>
      ) : (
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => <Product key={i} p={p} index={i} />)}
        </div>
      )}
    </section>
  )
}
