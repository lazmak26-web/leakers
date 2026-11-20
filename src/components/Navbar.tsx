import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { getLenis, gsap, lockScroll, prefersReducedMotion } from '../lib/motion'
import { useShop } from '../store/shop'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center font-black wide tracking-[-0.04em] ${className}`}>
      LEAKERS
      <span aria-hidden className="ml-1 inline-block h-[0.5em] w-[0.9em] translate-y-[0.02em] bg-signal" />
    </span>
  )
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
]

export function Navbar() {
  const { cartCount, setCartOpen, setSearchOpen, user } = useShop()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const barRef = useRef<HTMLElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = 0
    const onScroll = (y: number) => {
      setScrolled(y > 24)
      const bar = barRef.current
      if (!bar || menuOpen) return
      const down = y > last && y > 160
      gsap.to(bar, { yPercent: down ? -100 : 0, duration: 0.5, ease: 'power3.out', overwrite: true })
      last = y
    }
    const lenis = getLenis()
    if (lenis) {
      const h = () => onScroll(lenis.scroll)
      lenis.on('scroll', h)
      return () => lenis.off('scroll', h)
    }
    const h = () => onScroll(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [menuOpen])

  // bump the counter when the cart changes
  useEffect(() => {
    if (!countRef.current || prefersReducedMotion()) return
    gsap.fromTo(countRef.current, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
  }, [cartCount])

  useEffect(() => setMenuOpen(false), [pathname])

  useLayoutEffect(() => {
    lockScroll(menuOpen)
    const m = menuRef.current
    if (!m) return
    if (menuOpen) {
      gsap.set(m, { display: 'flex' })
      gsap.fromTo(m, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' })
      gsap.fromTo(m.querySelectorAll('[data-m]'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.3 })
    } else {
      gsap.to(m, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'expo.inOut', onComplete: () => { gsap.set(m, { display: 'none' }) } })
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  const iconBtn = 'relative grid h-10 w-10 place-items-center text-paper transition-colors hover:text-signal'

  return (
    <>
      <header
        ref={barRef}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${scrolled || menuOpen ? 'border-b border-line bg-void/85 backdrop-blur-md' : 'border-b border-transparent'}`}
      >
        <nav className="shell flex h-16 items-center justify-between md:h-20" aria-label="Main">
          <Link to="/" className="text-xl md:text-2xl" aria-label="LEAKERS home">
            <Logo />
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `group relative block overflow-hidden text-[13px] font-medium tracking-wide ${isActive ? 'text-paper' : 'text-mute hover:text-paper'}`}
                >
                  {({ isActive }) => (
                    <>
                      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{l.label}</span>
                      <span aria-hidden className="absolute inset-0 translate-y-full text-paper transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">{l.label}</span>
                      {isActive && <span aria-hidden className="absolute -bottom-0 left-0 h-px w-full bg-signal" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button className={iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search products (Ctrl+K)">
              <Search size={19} strokeWidth={1.6} />
            </button>
            <button className={iconBtn} onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`}>
              <ShoppingBag size={19} strokeWidth={1.6} />
              <span ref={countRef} className={`absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center px-1 text-[10px] font-bold ${cartCount ? 'bg-signal text-paper' : 'bg-ash text-mute'}`}>
                {cartCount}
              </span>
            </button>
            <Link
              to="/account"
              className="ml-3 hidden h-10 items-center gap-2 border border-line px-4 text-[13px] font-medium transition-colors hover:border-paper md:inline-flex"
            >
              <User size={15} strokeWidth={1.6} />
              {user ? user.name.split(' ')[0] : 'Sign in'}
            </Link>
            <button className={`${iconBtn} lg:hidden`} onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: its own layout, not a squeezed desktop nav */}
      <div ref={menuRef} id="mobile-menu" className="fixed inset-0 z-40 hidden flex-col justify-between bg-void px-4 pb-8 pt-24 lg:hidden" aria-hidden={!menuOpen}>
        <ul className="flex flex-col">
          {[...links, { to: '/wishlist', label: 'Wishlist' }, { to: '/account', label: user ? 'Account' : 'Sign in' }].map((l) => (
            <li key={l.to} className="overflow-hidden border-b border-line">
              <NavLink
                to={l.to}
                end={l.to === '/'}
                tabIndex={menuOpen ? 0 : -1}
                className={({ isActive }) => `block py-3 display text-[13vw] leading-none sm:text-7xl ${isActive ? 'text-signal' : 'text-paper'}`}
              >
                <span data-m className="block">{l.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-end justify-between text-sm text-mute">
          <span>Instant delivery on every order.</span>
          <span>© LEAKERS</span>
        </div>
      </div>
    </>
  )
}
