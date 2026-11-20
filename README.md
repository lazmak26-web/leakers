# LEAKERS

Premium digital products marketplace. React + TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger), Lenis smooth scroll, Lucide icons.

## Run

```bash
npm install
npm run dev
```

Production: `npm run build && npm start` (serves `dist/` as an SPA on `$PORT`).

## Structure

```
src/
  data/        product catalogue, categories, types
  store/       cart, wishlist, account, toasts (persisted to localStorage)
  lib/         GSAP + Lenis setup, formatting
  components/  Navbar, Footer, ProductCard, ProductArt (generated SVG covers),
               CartDrawer, SearchOverlay, Toasts, motion primitives (Magnet, SplitText)
  sections/    home page sections
  pages/       Home, Explore, Categories, Product, Cart, Checkout, Wishlist, Account, About, Legal, 404
```

Magnet, SplitText and ScrollVelocity follow the React Bits component patterns, implemented on GSAP so the site ships a single animation engine.

Checkout and accounts are front-end demos: no payment is taken and accounts live in the browser.
