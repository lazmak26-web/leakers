import { Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProductArt } from '../components/ProductArt'
import { ButtonLink, EmptyState, PageHeader, QtyStepper } from '../components/ui'
import { categoryById } from '../data/products'
import { money } from '../lib/motion'
import { useShop } from '../store/shop'

export function OrderSummary({ cta }: { cta?: React.ReactNode }) {
  const { subtotal, savings, cartCount } = useShop()
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  return (
    <div className="bg-coal p-6 md:p-8">
      <h2 className="text-xl font-bold wide">Order summary</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-mute">Items</dt><dd className="tabular-nums">{cartCount}</dd></div>
        <div className="flex justify-between"><dt className="text-mute">Subtotal</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
        {savings > 0 && <div className="flex justify-between"><dt className="text-mute">Discounts</dt><dd className="text-signal tabular-nums">−{money(savings)}</dd></div>}
        <div className="flex justify-between"><dt className="text-mute">Estimated tax (8%)</dt><dd className="tabular-nums">{money(tax)}</dd></div>
        <div className="flex justify-between"><dt className="text-mute">Delivery</dt><dd>Instant, free</dd></div>
      </dl>
      <div className="mt-6 flex items-baseline justify-between border-t border-line pt-6">
        <span>Total</span>
        <span className="text-3xl font-bold wide tabular-nums">{money(subtotal + tax)}</span>
      </div>
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  )
}

export default function CartPage() {
  const { cartItems, setQty, removeFromCart, clearCart, notify, addToCart } = useShop()
  useEffect(() => { document.title = 'Cart — LEAKERS' }, [])

  return (
    <>
      <PageHeader title="Cart" />
      <div className="shell">
        {cartItems.length === 0 ? (
          <EmptyState title="Your cart is empty." body="Add a product and it will wait here. Everything is delivered instantly after checkout." action={<ButtonLink to="/explore">Browse products</ButtonLink>} />
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ul className="divide-y divide-line border-y border-line">
                {cartItems.map(({ product, qty }) => (
                  <li key={product.id} className="grid grid-cols-[88px_1fr] gap-4 py-6 md:grid-cols-[120px_1fr_auto] md:gap-8">
                    <Link to={`/product/${product.slug}`} className="block"><ProductArt kind={product.art.kind} seed={product.art.seed} label={product.art.label} className="aspect-[4/5] w-full" /></Link>
                    <div className="flex min-w-0 flex-col justify-between gap-4">
                      <div>
                        <Link to={`/product/${product.slug}`} className="text-lg font-semibold hover:text-signal md:text-2xl md:wide">{product.name}</Link>
                        <p className="text-sm text-mute">{categoryById(product.category).name} · {product.license}</p>
                        <p className="mt-1 text-sm text-mute">{money(product.price)} each</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <QtyStepper value={qty} onChange={(n) => setQty(product.id, n)} label={product.name} />
                        <button onClick={() => { removeFromCart(product.id); notify(`Removed ${product.name}`, { label: 'Undo', onClick: () => addToCart(product.id, qty) }) }} className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-signal">
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                    <p className="col-start-2 text-xl font-semibold tabular-nums md:col-start-3 md:text-right">{money(product.price * qty)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-between text-sm">
                <Link to="/explore" className="link-wipe">Continue shopping</Link>
                <button onClick={() => { const snapshot = cartItems.map((i) => [i.product.id, i.qty] as const); clearCart(); notify('Cart cleared', { label: 'Undo', onClick: () => snapshot.forEach(([id, q]) => addToCart(id, q)) }) }} className="text-mute hover:text-signal">Clear cart</button>
              </div>
            </div>
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <OrderSummary cta={<ButtonLink to="/checkout" className="w-full">Go to checkout</ButtonLink>} />
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
