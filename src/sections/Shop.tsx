import { ArrowUpRight } from 'lucide-react'
import { useMemo } from 'react'
import { Decrypt, useReveal } from '../components/fx'
import { SectionTitle } from '../components/ui'
import { products, type ShopItem } from '../data/shop'
import { site } from '../data/team'

/** Generated cover when a product has no image: a glyph grid seeded by the product id. */
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

function Product({ p }: { p: ShopItem }) {
  return (
    <article data-reveal className="group relative flex flex-col bg-void">
      <div className="relative aspect-[4/3] overflow-hidden">
        {p.image
          ? <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105" />
          : <Cover seed={p.id} />}
        {p.badge && <span className="absolute left-3 top-3 bg-signal px-2 py-1 text-[11px] font-bold leading-none">{p.badge}</span>}
        {/* scan line on hover */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-signal opacity-0 shadow-[0_0_16px_2px_rgba(255,32,32,0.7)] group-hover:animate-[scan_1.2s_ease-in-out] group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] text-mute">{p.category}</span>
          <span className="font-semibold wide">{p.price}</span>
        </div>
        <Decrypt as="h3" trigger="hover" text={p.name} className="block text-2xl font-bold wide tracking-tight" />
        <p className="flex-1 text-sm text-paper/70">{p.description}</p>
        <a
          href={site.discord}
          target="_blank"
          rel="noreferrer noopener"
          className="group/b relative mt-2 inline-flex h-12 items-center justify-between overflow-hidden bg-signal px-5 text-[13px] font-semibold wide"
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

export function Shop() {
  const ref = useReveal<HTMLElement>('[data-reveal]', [products.length])
  return (
    <section id="shop" ref={ref} className="shell py-24 md:py-36">
      <SectionTitle path="shop" title="Shop" intro="Services, tools and training from the team. Pick one and order it directly with us on Discord." />
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => <Product key={p.id} p={p} />)}
      </div>
      <style>{`@keyframes scan{0%{top:0}100%{top:100%}}`}</style>
    </section>
  )
}
