import { Link } from 'react-router-dom'
import { categories } from '../data/products'
import { Logo } from './Navbar'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'X', href: 'https://x.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'Discord', href: 'https://discord.com' },
]

export function Footer() {
  const col = 'flex flex-col gap-3 text-sm'
  const head = 'mb-2 text-sm text-mute'
  const a = 'link-wipe w-fit text-paper/90 hover:text-paper'
  return (
    <footer className="mt-32 border-t border-line">
      <div className="shell grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-12">
        <div className="col-span-2 md:col-span-4">
          <Logo className="text-3xl" />
          <p className="mt-5 max-w-xs text-sm text-mute">Premium digital products for people who make things. Paid once, yours forever, delivered instantly.</p>
        </div>
        <nav className={`${col} md:col-span-2`} aria-label="Shop">
          <p className={head}>Shop</p>
          <Link className={a} to="/explore">All products</Link>
          <Link className={a} to="/explore?sort=popular">Best sellers</Link>
          <Link className={a} to="/explore?category=exclusive">Exclusive packs</Link>
          <Link className={a} to="/wishlist">Wishlist</Link>
          <Link className={a} to="/cart">Cart</Link>
        </nav>
        <nav className={`${col} md:col-span-2`} aria-label="Categories">
          <p className={head}>Categories</p>
          {categories.slice(0, 6).map((c) => <Link key={c.id} className={a} to={`/explore?category=${c.id}`}>{c.name}</Link>)}
        </nav>
        <nav className={`${col} md:col-span-2`} aria-label="Company">
          <p className={head}>Company</p>
          <Link className={a} to="/about">About</Link>
          <Link className={a} to="/account">Account</Link>
          {socials.map((s) => <a key={s.label} className={a} href={s.href} target="_blank" rel="noreferrer noopener">{s.label}</a>)}
        </nav>
        <nav className={`${col} md:col-span-2`} aria-label="Legal">
          <p className={head}>Legal</p>
          <Link className={a} to="/legal/terms">Terms of sale</Link>
          <Link className={a} to="/legal/privacy">Privacy</Link>
          <Link className={a} to="/legal/licence">Licences</Link>
          <Link className={a} to="/legal/refunds">Refunds</Link>
        </nav>
      </div>
      <div className="overflow-hidden">
        <p aria-hidden className="display select-none whitespace-nowrap text-[23vw] leading-[0.75] text-coal -mb-[0.06em] -ml-[0.04em]">LEAKERS</p>
      </div>
      <div className="shell flex flex-col justify-between gap-2 border-t border-line py-6 text-xs text-mute md:flex-row">
        <span>© {new Date().getFullYear()} LEAKERS. All rights reserved.</span>
        <span>Prices in USD. Digital goods are delivered by email and in your account.</span>
      </div>
    </footer>
  )
}
