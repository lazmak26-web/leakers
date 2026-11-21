import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { bootDelay, gsap, prefersReducedMotion, scrollToTop, ScrollTrigger } from './lib/motion'
import Home from './pages/Home'

const NotFound = lazy(() => import('./pages/NotFound'))
const ShopPage = lazy(() => import('./pages/ShopPage'))

const bootLines = ['establishing secure channel', 'verifying scope', 'access granted']

/** Short boot screen, first visit per session only. */
function Boot() {
  const [done, setDone] = useState(bootDelay === 0)
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || done) return
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => setDone(true) })
        .from('[data-l]', { autoAlpha: 0, x: -10, duration: 0.25, stagger: 0.3 })
        .to('[data-bar]', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
        .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut' }, '+=0.15')
    }, el)
    return () => ctx.revert()
  }, [done])
  if (done) return null
  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex flex-col justify-end bg-void p-4 font-mono text-sm md:p-12" aria-hidden>
      {bootLines.map((l, i) => (
        <p key={l} data-l className={i === bootLines.length - 1 ? 'text-signal' : 'text-mute'}>
          {i === bootLines.length - 1 ? '[✓]' : '[..]'} {l}
        </p>
      ))}
      <div className="mt-4 h-px w-full bg-line"><div data-bar className="h-px origin-left scale-x-0 bg-paper" /></div>
    </div>
  )
}

function PageLoader() {
  return <div className="grid min-h-[70vh] place-items-center font-mono text-sm text-mute" role="status">loading…</div>
}

/** Route change: a red scan line sweeps down and uncovers the new page. */
function Layout() {
  const { pathname } = useLocation()
  const curtain = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    scrollToTop()
    const c = curtain.current
    if (first.current || !c || prefersReducedMotion()) {
      first.current = false
      ScrollTrigger.refresh()
      return
    }
    const line = c.querySelector('[data-line]')
    const tl = gsap.timeline({ onComplete: () => { ScrollTrigger.refresh() } })
    tl.set(c, { display: 'block', clipPath: 'inset(0% 0% 0% 0%)' })
      .fromTo(line, { top: '0%' }, { top: '100%', duration: 0.7, ease: 'power2.inOut' })
      .to(c, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, '<')
      .set(c, { display: 'none' })
    return () => { tl.kill() }
  }, [pathname])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-paper focus:px-4 focus:py-2 focus:text-void">Skip to content</a>
      <Boot />
      <Navbar />
      <main id="main"><Suspense fallback={<PageLoader />}><Outlet /></Suspense></main>
      <Footer />
      <div ref={curtain} aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden bg-void">
        <div data-line className="absolute inset-x-0 h-[2px] bg-signal shadow-[0_0_24px_4px_rgba(255,32,32,0.6)]" />
      </div>
      <div className="grain" aria-hidden />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
