import { Check, Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryById } from '../data/products'
import type { Product } from '../data/types'
import { useShop } from '../store/shop'
import { ProductArt } from './ProductArt'
import { DiscountTag, Price } from './ui'

interface Props {
  product: Product
  /** visual weight in asymmetric grids */
  size?: 'default' | 'large' | 'compact'
  className?: string
}

export function ProductCard({ product, size = 'default', className = '' }: Props) {
  const { addToCart, toggleWishlist, isWished, notify, setCartOpen } = useShop()
  const [added, setAdded] = useState(false)
  const wished = isWished(product.id)
  const href = `/product/${product.slug}`

  const add = () => {
    addToCart(product.id)
    setAdded(true)
    notify(`${product.name} added to cart`, { label: 'View cart', onClick: () => setCartOpen(true) })
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article data-reveal className={`group relative flex flex-col ${className}`}>
      <div className="relative overflow-hidden bg-coal">
        <Link to={href} aria-label={`View details for ${product.name}`} className="block">
          <div className={'aspect-[4/5]'}>
            <ProductArt
              kind={product.art.kind}
              seed={product.art.seed}
              label={product.art.label}
              code={product.code}
              className="h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
            />
          </div>
          {/* hover strip */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-paper px-4 py-3 text-[13px] font-semibold text-void transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
            View details
            <span className="text-mute">{categoryById(product.category).name}</span>
          </span>
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
          <DiscountTag product={product} />
          {product.limited && <span className="bg-paper px-2 py-1 text-[11px] font-bold leading-none text-void">Limited run</span>}
          {product.isNew && !product.limited && <span className="border border-paper/40 bg-void/60 px-2 py-1 text-[11px] font-semibold leading-none backdrop-blur">New</span>}
        </div>

        <button
          type="button"
          onClick={() => {
            toggleWishlist(product.id)
            notify(wished ? `Removed from wishlist` : `Saved ${product.name} to wishlist`)
          }}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-void/60 backdrop-blur transition-colors hover:bg-void"
        >
          <Heart size={16} className={wished ? 'fill-signal text-signal' : 'text-paper'} />
        </button>
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div className="min-w-0">
          <h3 className={`font-semibold tracking-tight ${size === 'large' ? 'text-2xl wide' : 'text-lg'}`}>
            <Link to={href} className="link-wipe">{product.name}</Link>
          </h3>
          {size !== 'compact' && <p className="mt-1 line-clamp-2 max-w-sm text-sm text-mute">{product.tagline}</p>}
          <div className="mt-3"><Price product={product} /></div>
        </div>
        <button
          type="button"
          onClick={add}
          aria-label={`Add ${product.name} to cart`}
          className={`grid h-11 w-11 shrink-0 place-items-center border transition-colors duration-300 ${added ? 'border-signal bg-signal' : 'border-line hover:border-paper hover:bg-paper hover:text-void'}`}
        >
          {added ? <Check size={18} /> : <Plus size={18} />}
        </button>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="aspect-[4/5] bg-coal" />
      <div className="mt-4 h-5 w-2/3 bg-coal" />
      <div className="mt-2 h-4 w-1/2 bg-coal" />
    </div>
  )
}
