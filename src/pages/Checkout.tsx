import { Lock } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ProductArt } from '../components/ProductArt'
import { Button, ButtonLink, EmptyState, PageHeader } from '../components/ui'
import { money } from '../lib/motion'
import { useShop } from '../store/shop'
import { OrderSummary } from './CartPage'

type Fields = { name: string; email: string; card: string; exp: string; cvc: string }
type Errors = Partial<Record<keyof Fields, string>>

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Enter the name on your card.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email. Your files are sent here.'
  if (f.card.replace(/\s/g, '').length < 15) e.card = 'Card number should be 15 or 16 digits.'
  const [m, y] = f.exp.split('/').map((s) => parseInt(s, 10))
  if (!m || !y || m < 1 || m > 12) e.exp = 'Use MM/YY.'
  if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = '3 or 4 digits.'
  return e
}

function downloadLicence(orderId: string, name: string, code: string, license: string, qty: number, email: string) {
  const text = [`LEAKERS — LICENCE CERTIFICATE`, ``, `Order:    ${orderId}`, `Product:  ${name} (${code})`, `Licence:  ${license}`, `Seats:    ${qty}`, `Issued to: ${email}`, `Date:     ${new Date().toISOString().slice(0, 10)}`, ``, `Keep this file with your project assets.`].join('\n')
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `${code}-licence.txt` })
  a.click()
  URL.revokeObjectURL(url)
}

export default function Checkout() {
  const { cartItems, subtotal, clearCart, user } = useShop()
  const [f, setF] = useState<Fields>({ name: user?.name ?? '', email: user?.email ?? '', card: '', exp: '', cvc: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'paying' | 'done'>('idle')
  const [order, setOrder] = useState<{ id: string; items: typeof cartItems; total: number; email: string } | null>(null)
  useEffect(() => { document.title = 'Checkout — LEAKERS' }, [])

  const set = (k: keyof Fields, v: string) => {
    if (k === 'card') v = v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    if (k === 'exp') v = v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2')
    if (k === 'cvc') v = v.replace(/\D/g, '').slice(0, 4)
    setF((s) => ({ ...s, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(f)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`co-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setStatus('paying')
    window.setTimeout(() => {
      const id = `LKR-${Math.floor(100000 + Math.random() * 900000)}`
      setOrder({ id, items: cartItems, total: subtotal * 1.08, email: f.email.trim() })
      try {
        const prev = JSON.parse(localStorage.getItem('lkr.orders') ?? '[]')
        localStorage.setItem('lkr.orders', JSON.stringify([{ id, date: new Date().toISOString(), total: subtotal * 1.08, items: cartItems.map((i) => ({ id: i.product.id, qty: i.qty })) }, ...prev]))
      } catch { /* ignore */ }
      clearCart()
      setStatus('done')
    }, 1400)
  }

  if (status === 'done' && order) {
    return (
      <>
        <PageHeader title="Delivered." intro={`Order ${order.id} is confirmed. Download links were sent to ${order.email} and are saved in your account.`} />
        <div className="shell">
          <ul className="divide-y divide-line border-y border-line">
            {order.items.map(({ product, qty }) => (
              <li key={product.id} className="flex items-center gap-4 py-4">
                <ProductArt kind={product.art.kind} seed={product.art.seed} label={product.art.label} className="aspect-[4/5] w-14 shrink-0" />
                <span className="flex-1 font-semibold">{product.name} <span className="text-mute">× {qty}</span></span>
                <button onClick={() => downloadLicence(order.id, product.name, product.code, product.license, qty, order.email)} className="border border-line px-4 py-2 text-sm hover:border-paper">Download licence</button>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-mute">Total paid <span className="ml-2 text-paper">{money(order.total)}</span></p>
            <div className="flex gap-3"><ButtonLink to="/account" variant="line">View orders</ButtonLink><ButtonLink to="/explore">Keep browsing</ButtonLink></div>
          </div>
        </div>
      </>
    )
  }

  if (!cartItems.length) {
    return (
      <>
        <PageHeader title="Checkout" />
        <div className="shell"><EmptyState title="Nothing to check out." body="Your cart is empty. Add a product first, then come back here to pay." action={<ButtonLink to="/explore">Browse products</ButtonLink>} /></div>
      </>
    )
  }

  const input = (k: keyof Fields) =>
    `mt-2 h-12 w-full border bg-transparent px-3 outline-none transition-colors placeholder:text-ash focus:border-paper ${errors[k] ? 'border-signal' : 'border-line'}`
  const field = (k: keyof Fields, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label htmlFor={`co-${k}`} className="text-sm text-mute">{label}</label>
      <input id={`co-${k}`} value={f[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `co-${k}-err` : undefined} className={input(k)} {...props} />
      {errors[k] && <p id={`co-${k}-err`} className="mt-1.5 text-sm text-signal">{errors[k]}</p>}
    </div>
  )

  return (
    <>
      <PageHeader title="Checkout" intro="Digital delivery only. Your files arrive by email the moment payment clears." />
      <div className="shell grid gap-10 lg:grid-cols-12">
        <form onSubmit={submit} noValidate className="space-y-10 lg:col-span-7">
          <fieldset className="space-y-5">
            <legend className="mb-4 text-xl font-bold wide">Contact</legend>
            {field('email', 'Email for delivery', { type: 'email', autoComplete: 'email', placeholder: 'you@studio.com' })}
          </fieldset>
          <fieldset className="space-y-5">
            <legend className="mb-4 text-xl font-bold wide">Payment</legend>
            {field('name', 'Name on card', { autoComplete: 'cc-name', placeholder: 'Alex Moreno' })}
            {field('card', 'Card number', { inputMode: 'numeric', autoComplete: 'cc-number', placeholder: '4242 4242 4242 4242' })}
            <div className="grid grid-cols-2 gap-4">
              {field('exp', 'Expiry', { inputMode: 'numeric', autoComplete: 'cc-exp', placeholder: 'MM/YY' })}
              {field('cvc', 'CVC', { inputMode: 'numeric', autoComplete: 'cc-csc', placeholder: '123' })}
            </div>
            <p className="text-xs text-mute">Demo store: no payment is taken. Use any test number such as 4242 4242 4242 4242.</p>
          </fieldset>
          <Button type="submit" disabled={status === 'paying'} className="w-full">
            <Lock size={15} /> {status === 'paying' ? 'Processing payment…' : `Pay ${money(subtotal * 1.08)}`}
          </Button>
          <p className="text-sm text-mute">By paying you agree to the <Link to="/legal/terms" className="link-wipe text-paper">terms of sale</Link> and <Link to="/legal/licence" className="link-wipe text-paper">licence terms</Link>.</p>
        </form>
        <aside className="lg:col-span-5">
          <div className="space-y-px lg:sticky lg:top-24">
            <ul className="divide-y divide-line bg-coal px-6 md:px-8">
              {cartItems.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-4 py-4">
                  <ProductArt kind={product.art.kind} seed={product.art.seed} label={product.art.label} className="aspect-[4/5] w-12 shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-sm">{product.name} <span className="text-mute">× {qty}</span></span>
                  <span className="text-sm tabular-nums">{money(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <OrderSummary />
          </div>
        </aside>
      </div>
    </>
  )
}
