import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink, PageHeader } from '../components/ui'
import { productById } from '../data/products'
import { money } from '../lib/motion'
import { useShop } from '../store/shop'

interface Order { id: string; date: string; total: number; items: { id: string; qty: number }[] }

export default function Account() {
  const { user, signIn, signOut, wishlist, notify } = useShop()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { document.title = user ? 'Account — LEAKERS' : 'Sign in — LEAKERS' }, [user])

  const orders = useMemo<Order[]>(() => {
    try { return JSON.parse(localStorage.getItem('lkr.orders') ?? '[]') } catch { return [] }
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError('Enter a valid email address.')
    if (password.length < 8) return setError('Passwords are at least 8 characters.')
    if (mode === 'signup' && name.trim().length < 2) return setError('Enter your name.')
    setError('')
    const display = mode === 'signup' ? name.trim() : email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    signIn({ name: display, email: email.trim() })
    notify(mode === 'signup' ? 'Account created' : 'Signed in')
  }

  if (user) {
    return (
      <>
        <PageHeader title={`Hi, ${user.name.split(' ')[0]}.`} intro={`Signed in as ${user.email}. Your purchases and downloads live here.`} />
        <div className="shell grid gap-10 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <h2 className="mb-6 text-2xl font-bold wide">Orders</h2>
            {orders.length === 0 ? (
              <div className="border-y border-line py-10">
                <p>No orders yet.</p>
                <p className="mt-1 text-mute">When you buy something, the download links appear here.</p>
                <div className="mt-6"><ButtonLink to="/explore">Browse products</ButtonLink></div>
              </div>
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {orders.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-baseline justify-between gap-4 py-5">
                    <div>
                      <p className="font-mono text-sm">{o.id}</p>
                      <p className="text-sm text-mute">{new Date(o.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                    </div>
                    <p className="min-w-0 flex-1 text-sm">{o.items.map((i) => productById(i.id)?.name).filter(Boolean).join(', ')}</p>
                    <p className="font-semibold tabular-nums">{money(o.total)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <aside className="space-y-px lg:col-span-4">
            <div className="bg-coal p-6">
              <p className="text-sm text-mute">Wishlist</p>
              <p className="mt-1 text-3xl font-bold condensed">{wishlist.length} saved</p>
              <Link to="/wishlist" className="link-wipe mt-4 inline-block text-sm">Open wishlist</Link>
            </div>
            <div className="bg-coal p-6">
              <Button variant="line" onClick={() => { signOut(); notify('Signed out') }} className="w-full">Sign out</Button>
            </div>
          </aside>
        </div>
      </>
    )
  }

  const input = 'mt-2 h-12 w-full border border-line bg-transparent px-3 outline-none placeholder:text-ash focus:border-paper'
  return (
    <>
      <PageHeader title={mode === 'signin' ? 'Sign in' : 'Create account'} intro="Access your downloads, licences and order history on any device." />
      <div className="shell">
        <form onSubmit={submit} noValidate className="max-w-md space-y-5">
          <div className="flex gap-1 border-b border-line" role="tablist">
            {(['signin', 'signup'] as const).map((m) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setError('') }} className={`-mb-px border-b-2 px-1 pb-3 pr-6 text-sm font-semibold ${mode === m ? 'border-signal text-paper' : 'border-transparent text-mute'}`}>
                {m === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>
          {mode === 'signup' && (
            <div><label htmlFor="ac-name" className="text-sm text-mute">Name</label><input id="ac-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={input} /></div>
          )}
          <div><label htmlFor="ac-email" className="text-sm text-mute">Email</label><input id="ac-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@studio.com" className={input} /></div>
          <div><label htmlFor="ac-pass" className="text-sm text-mute">Password</label><input id="ac-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} placeholder="At least 8 characters" className={input} /></div>
          {error && <p role="alert" className="text-sm text-signal">{error}</p>}
          <Button type="submit" className="w-full">{mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
          <p className="text-xs text-mute">Demo store: accounts are stored only in this browser.</p>
        </form>
      </div>
    </>
  )
}
