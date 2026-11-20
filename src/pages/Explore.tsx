import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useReveal } from '../components/fx'
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard'
import { Button, EmptyState, PageHeader } from '../components/ui'
import { categories, categoryById, discountOf, products } from '../data/products'
import type { CategoryId } from '../data/types'

const sorts = [
  { id: 'featured', label: 'Featured' },
  { id: 'popular', label: 'Best selling' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
  { id: 'newest', label: 'Newest' },
] as const
type SortId = (typeof sorts)[number]['id']

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const category = (params.get('category') as CategoryId | null) ?? null
  const sort = (params.get('sort') as SortId | null) ?? 'featured'
  const [q, setQ] = useState(params.get('q') ?? '')
  const [onSale, setOnSale] = useState(params.get('sale') === '1')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const deferredQ = useDeferredValue(q)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.title = category ? `${categoryById(category).name} — LEAKERS` : 'Explore — LEAKERS'
  }, [category])
  // brief skeleton so the grid doesn't pop in unstyled on first paint
  useEffect(() => { const t = window.setTimeout(() => setReady(true), 250); return () => window.clearTimeout(t) }, [])

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  useEffect(() => {
    const t = window.setTimeout(() => update('q', q.trim() || null), 300)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const results = useMemo(() => {
    const s = deferredQ.trim().toLowerCase()
    let list = products.filter((p) => {
      if (category && p.category !== category) return false
      if (onSale && !discountOf(p)) return false
      if (!s) return true
      return [p.name, p.tagline, p.code, categoryById(p.category).name, ...p.compatibility].join(' ').toLowerCase().includes(s)
    })
    list = [...list]
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'popular': list.sort((a, b) => b.sales - a.sales); break
      case 'rating': list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount); break
      case 'newest': list.sort((a, b) => b.updated.localeCompare(a.updated)); break
      default: list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    }
    return list
  }, [deferredQ, category, sort, onSale])

  const gridRef = useReveal<HTMLDivElement>('[data-reveal]', [results, ready])
  const activeCount = Number(!!category) + Number(onSale) + Number(!!q.trim())
  const reset = () => { setQ(''); setOnSale(false); setParams({}, { replace: true }) }

  const chip = (active: boolean) =>
    `whitespace-nowrap border px-4 py-2 text-sm transition-colors ${active ? 'border-paper bg-paper text-void' : 'border-line text-paper/80 hover:border-paper'}`

  return (
    <>
      <PageHeader
        title={category ? categoryById(category).name : 'Explore'}
        intro={category ? categoryById(category).blurb : 'Every product on LEAKERS. Search, filter by category, or sort by what people actually buy.'}
      />

      <div className="sticky top-0 z-30 border-y border-line bg-void/90 backdrop-blur-md">
        <div className="shell flex flex-wrap items-center gap-3 py-3">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-3 border border-line px-3 focus-within:border-paper md:max-w-sm">
            <Search size={16} className="shrink-0 text-mute" />
            <span className="sr-only">Search products</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, tool or format" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-mute" type="search" />
            {q && <button onClick={() => setQ('')} aria-label="Clear search" className="text-mute hover:text-paper"><X size={14} /></button>}
          </label>
          <button onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen} className="flex h-11 items-center gap-2 border border-line px-4 text-sm lg:hidden">
            <SlidersHorizontal size={15} /> Filters {activeCount > 0 && <span className="bg-signal px-1.5 text-xs">{activeCount}</span>}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort" className="hidden text-sm text-mute sm:block">Sort</label>
            <select id="sort" value={sort} onChange={(e) => update('sort', e.target.value === 'featured' ? null : e.target.value)} className="h-11 cursor-pointer border border-line bg-void px-3 text-sm outline-none focus:border-paper">
              {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div className={`shell pb-3 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none max-lg:flex-wrap md:mx-0 md:px-0" role="group" aria-label="Filter by category">
            <button className={chip(!category)} onClick={() => update('category', null)} aria-pressed={!category}>All</button>
            {categories.map((c) => (
              <button key={c.id} className={chip(category === c.id)} onClick={() => update('category', category === c.id ? null : c.id)} aria-pressed={category === c.id}>
                {c.name}
              </button>
            ))}
            <span className="mx-1 hidden w-px bg-line lg:block" />
            <button className={chip(onSale)} onClick={() => { setOnSale(!onSale); update('sale', onSale ? null : '1') }} aria-pressed={onSale}>On sale</button>
          </div>
        </div>
      </div>

      <section className="shell py-10 md:py-14" aria-live="polite">
        <div className="mb-8 flex items-center justify-between text-sm text-mute">
          <span>{results.length} {results.length === 1 ? 'product' : 'products'}</span>
          {activeCount > 0 && <button onClick={reset} className="link-wipe text-paper">Clear all filters</button>}
        </div>
        {!ready ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            title="No matches."
            body={q ? `Nothing matches “${q}” with these filters. Try a broader term or clear the filters.` : 'No products fit these filters right now. Clear them to see the full catalogue.'}
            action={<Button variant="line" onClick={reset}>Clear filters</Button>}
          />
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </>
  )
}
