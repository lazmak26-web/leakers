import { ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../components/fx'
import { ProductArt } from '../components/ProductArt'
import { PageHeader } from '../components/ui'
import { categories, products } from '../data/products'
import { money } from '../lib/motion'

export default function Categories() {
  useEffect(() => { document.title = 'Categories — LEAKERS' }, [])
  const ref = useReveal<HTMLDivElement>()
  return (
    <>
      <PageHeader title="Categories" intro="Seven shelves, curated by hand. Pick one to browse everything in it." />
      <div ref={ref} className="shell grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => {
          const items = products.filter((p) => p.category === c.id)
          const from = Math.min(...items.map((p) => p.price))
          const wide = i === 0 || i === 6
          return (
            <Link
              key={c.id}
              to={`/explore?category=${c.id}`}
              data-reveal
              className={`group relative flex flex-col justify-between gap-10 overflow-hidden bg-void p-6 md:p-8 ${wide ? 'lg:col-span-2' : ''}`}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="display text-4xl md:text-6xl">{c.name}</h2>
                  <p className="mt-4 max-w-xs text-sm text-mute">{c.blurb}</p>
                </div>
                <ArrowUpRight className="shrink-0 transition-transform duration-500 group-hover:rotate-45 group-hover:text-signal" />
              </div>
              <div className="flex items-end justify-between gap-6">
                <div className="text-sm">
                  <p>{items.length} products</p>
                  <p className="text-mute">from {money(from)}</p>
                </div>
                <div className="flex -space-x-8">
                  {items.slice(0, 3).map((p, k) => (
                    <div key={p.id} className="aspect-[4/5] w-20 shadow-2xl transition-transform duration-700 ease-[var(--ease-out-expo)] md:w-24" style={{ transform: `rotate(${(k - 1) * 6}deg)` }}>
                      <ProductArt kind={p.art.kind} seed={p.art.seed} label={p.art.label} className="h-full w-full transition-transform duration-700 group-hover:-translate-y-2" />
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
