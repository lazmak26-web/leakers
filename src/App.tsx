import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { CartDrawer, SearchOverlay, Toasts } from './components/Overlays'
import { gsap, prefersReducedMotion, scrollToTop, ScrollTrigger } from './lib/motion'
import Home from './pages/Home'

const Explore = lazy(() => import('./pages/Explore'))
const Categories = lazy(() => import('./pages/Categories'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Account = lazy(() => import('./pages/Account'))
const About = lazy(() => import('./pages/About'))
const Legal = lazy(() => import('./pages/Legal'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status" aria-label="Loading page">
      <div className="h-1 w-40 overflow-hidden bg-ash">
        <div className="h-full w-1/3 animate-[load_1s_ease-in-out_infinite] bg-signal" />
      </div>
      <style>{`@keyframes load{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  )
}

/** Curtain wipe on every route change: the incoming page is uncovered from the bottom up. */
function Layout() {
  const { pathname } = useLocation()
  const curtain = useRef<HTMLDivElement>(null)
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    scrollToTop()
    const c = curtain.current
    if (first.current || !c || prefersReducedMotion()) {
      first.current = false
      ScrollTrigger.refresh()
      return
    }
    const tl = gsap.timeline({ onComplete: () => { ScrollTrigger.refresh() } })
    tl.set(c, { display: 'block', clipPath: 'inset(0% 0% 0% 0%)' })
      .fromTo(c.querySelector('span'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.25 })
      .to(c, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.75, ease: 'expo.inOut' }, '+=0.05')
      .fromTo(main.current, { y: 80 }, { y: 0, duration: 1, ease: 'expo.out' }, '<0.15')
      .set(c, { display: 'none' })
    return () => { tl.kill() }
  }, [pathname])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-paper focus:px-4 focus:py-2 focus:text-void">Skip to content</a>
      <Navbar />
      <main id="main" ref={main}>
        <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <Toasts />
      <div ref={curtain} aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden bg-signal">
        <span className="absolute bottom-6 left-4 block text-2xl font-black wide text-void md:left-12">LEAKERS</span>
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
      { path: '/explore', element: <Explore /> },
      { path: '/categories', element: <Categories /> },
      { path: '/product/:slug', element: <ProductPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '/account', element: <Account /> },
      { path: '/about', element: <About /> },
      { path: '/legal/:page', element: <Legal /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
