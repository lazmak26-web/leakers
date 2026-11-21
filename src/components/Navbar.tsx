import { Menu, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getLenis, gsap, lockScroll, scrollToId } from '../lib/motion'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center font-black wide tracking-[-0.04em] ${className}`}>
      LEAKERS
      <span aria-hidden className="ml-1 inline-block h-[0.5em] w-[0.9em] translate-y-[0.02em] bg-signal" />
    </span>
  )
}

const links = [
  { id: 'services', label: 'Services' },
  { id: 'team', label: 'Team' },
  { id: 'record', label: 'Record' },
  { id: 'writeups', label: 'Write-ups' },
]

/** Go to a home-page section from anywhere. */
export function useSectionNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (id: string) => {
    if (pathname === '/') scrollToId(id)
    else navigate(`/#${id}`)
  }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const go = useSectionNav()

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
      gsap.fromTo(m.querySelectorAll('[data-m]'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.3 })
    } else {
      gsap.to(m, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'expo.inOut', onComplete: () => { gsap.set(m, { display: 'none' }) } })
    }
  }, [open])

  const pick = (id: string) => { setOpen(false); window.setTimeout(() => go(id), open ? 350 : 0) }

  return (
    <>
      <header ref={bar} className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${scrolled || open ? 'border-line bg-void/85 backdrop-blur-md' : 'border-transparent'}`}>
        <nav className="shell flex h-16 items-center justify-between md:h-20" aria-label="Main">
          <Link to="/" className="text-xl md:text-2xl" aria-label="LEAKERS home" onClick={() => pathname === '/' && getLenis()?.scrollTo(0)}><Logo /></Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
            {links.map((l) => (
              <li key={l.id}>
                <button onClick={() => go(l.id)} className="group relative block overflow-hidden text-[13px] font-medium tracking-wide text-mute hover:text-paper">
                  <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{l.label}</span>
                  <span aria-hidden className="absolute inset-0 translate-y-full text-paper transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button onClick={() => go('contact')} className="hidden h-10 items-center gap-2 bg-paper px-4 text-[13px] font-semibold text-void transition-colors hover:bg-signal hover:text-paper md:inline-flex">
              Start an engagement
            </button>
            <button className="grid h-10 w-10 place-items-center lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <div ref={menu} id="mobile-menu" className="fixed inset-0 z-40 hidden flex-col justify-between bg-void px-4 pb-8 pt-24 lg:hidden" aria-hidden={!open}>
        <ul>
          {[...links, { id: 'contact', label: 'Contact' }].map((l) => (
            <li key={l.id} className="overflow-hidden border-b border-line">
              <button tabIndex={open ? 0 : -1} onClick={() => pick(l.id)} className="block w-full py-3 text-left display text-[13vw] leading-none sm:text-7xl">
                <span data-m className="block">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="font-mono text-xs text-mute">authorised testing only · responsible disclosure</p>
      </div>
    </>
  )
}
