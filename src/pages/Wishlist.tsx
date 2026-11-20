import { useEffect } from 'react'
import { useReveal } from '../components/fx'
import { ProductCard } from '../components/ProductCard'
import { Button, ButtonLink, EmptyState, PageHeader } from '../components/ui'
import { productById } from '../data/products'
import { money } from '../lib/motion'
import { useShop } from '../store/shop'

export default function Wishlist() {
  const { wishlist, addToCart, notify, setCartOpen } = useShop()
  useEffect(() => { document.title = 'Wishlist — LEAKERS' }, [])
  const items = wishlist.map(productById).filter((p) => !!p)
  const ref = useReveal<HTMLDivElement>('[data-reveal]', [items.length])
  const total = items.reduce((s, p) => s + p.price, 0)

  return (
    <>
      <PageHeader title="Wishlist" intro={items.length ? `${items.length} saved ${items.length === 1 ? 'product' : 'products'}, ${money(total)} in total. Saved on this device.` : undefined}>
        {items.length > 0 && (
          <div className="mt-8">
            <Button onClick={() => { items.forEach((p) => addToCart(p.id)); notify(`${items.length} products added to cart`, { label: 'View cart', onClick: () => setCartOpen(true) }) }}>
              Add all to cart
            </Button>
          </div>
        )}
      </PageHeader>
      <div className="shell">
        {items.length === 0 ? (
          <EmptyState title="Nothing saved yet." body="Tap the heart on any product to keep it here for later. Your wishlist is stored on this device." action={<ButtonLink to="/explore">Find something to save</ButtonLink>} />
        ) : (
          <div ref={ref} className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  )
}
