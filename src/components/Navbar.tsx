import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { site } from '../data/team'
import { getLenis, gsap, lockScroll, scrollToId } from '../lib/motion'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center gap-[0.4em] font-black wide tracking-[-0.04em] ${className}`}>
      <img src="/logo-256.png" alt="" aria-hidden className="h-[1.3em] w-[1.3em] shrink-0 object-contain" />
      LEAKERS
    </span>
  )
}

/** Go to a home-page section from anywhere. */
export function useSectionNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (id: string) => {
    if (pathname === '/') scrollToId(id)
    else navigate(`/#${id}`)
  }
}

function TabLabel({ label }: { label: string }) {
  return (
    <>
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{label}</span>
      <span aria-hidden className="absolute inset-0 translate-y-full text-signal transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">{label}</span>
    </>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    let last = 0
    const onScroll = (y: number) => {
      setScrolled(y > 24)
      if (!bar.current || open) return
      gsap.to(bar.current, { yPercent: y > last && y > 160 ? -100 : 0, duration: 0.5, ease: 'power3.out', overwrite: true })
      last = y
    }
    const lenis = getLenis()
    if (lenis) { const h = () => onScroll(lenis.scroll); lenis.on('scroll', h); return () => lenis.off('scroll', h) }
    const h = () => onScroll(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  useLayoutEffect(() => {
    lockScroll(open)
    const m = menu.current
    if (!m) return
    if (open) {
      gsap.set(m, { display: 'flex' })
      gsap.fromTo(m, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' })
      gsap.fromTo(m.querySelectorAll('[data-m]'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.3 })
    } else {
      gsap.to(m, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'expo.inOut', onComplete: () => { gsap.set(m, { display: 'none' }) } })
    }
  }, [open])

  const tab = 'group relative block overflow-hidden text-[14px] font-semibold tracking-wide'

  return (
    <>
      <header ref={bar} className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${scrolled || open ? 'border-line bg-void/85 backdrop-blur-md' : 'border-transparent'}`}>
        <nav className="shell flex h-16 items-center justify-between md:h-20" aria-label="Main">
          <Link to="/" className="text-xl md:text-2xl" aria-label="LEAKERS home" onClick={() => pathname === '/' && getLenis()?.scrollTo(0)}><Logo /></Link>

          <div className="hidden items-center gap-10 md:flex">
            <Link to="/shop" aria-current={pathname === '/shop' ? 'page' : undefined} className={`${tab} ${pathname === '/shop' ? 'text-signal' : ''}`}><TabLabel label="Shop" /></Link>
            <a href={site.discord} target="_blank" rel="noreferrer noopener" className="group inline-flex h-10 items-center gap-2 bg-signal px-5 text-[13px] font-semibold transition-colors hover:bg-paper hover:text-void">
              Contact <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </div>

          <button className="grid h-10 w-10 place-items-center md:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* mobile: two large tabs, thumb-reachable */}
      <div ref={menu} id="mobile-menu" className="fixed inset-0 z-40 hidden flex-col justify-between bg-void px-4 pb-8 pt-24 md:hidden" aria-hidden={!open}>
        <ul>
          <li className="overflow-hidden border-b border-line">
            <Link tabIndex={open ? 0 : -1} to="/shop" onClick={() => setOpen(false)} className="block w-full py-4 text-left display text-[16vw] leading-none">
              <span data-m className="block">Shop</span>
            </Link>
          </li>
          <li className="overflow-hidden border-b border-line">
            <a tabIndex={open ? 0 : -1} href={site.discord} target="_blank" rel="noreferrer noopener" className="flex items-center justify-between py-4 display text-[16vw] leading-none text-signal">
              <span data-m className="block">Contact</span>
              <ArrowUpRight data-m className="h-[0.6em] w-[0.6em]" />
            </a>
          </li>
        </ul>
        <p className="font-mono text-xs text-mute">Contact opens our Discord server</p>
      </div>
    </>
  )
}
