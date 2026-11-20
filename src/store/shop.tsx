import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { productById } from '../data/products'
import type { CartLine, Product } from '../data/types'

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function writeStore(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) — state still works in memory */
  }
}

export interface User { name: string; email: string }
export interface Toast { id: number; message: string; action?: { label: string; onClick: () => void } }

interface ShopState {
  cart: CartLine[]
  cartItems: { product: Product; qty: number }[]
  cartCount: number
  subtotal: number
  savings: number
  addToCart: (id: string, qty?: number) => void
  setQty: (id: string, qty: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  wishlist: string[]
  toggleWishlist: (id: string) => void
  isWished: (id: string) => boolean
  user: User | null
  signIn: (u: User) => void
  signOut: () => void
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  toasts: Toast[]
  notify: (message: string, action?: Toast['action']) => void
}

const ShopContext = createContext<ShopState | null>(null)
export const MAX_QTY = 10

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => readStore<CartLine[]>('lkr.cart', []).filter((l) => productById(l.id)))
  const [wishlist, setWishlist] = useState<string[]>(() => readStore<string[]>('lkr.wishlist', []).filter((id) => productById(id)))
  const [user, setUser] = useState<User | null>(() => readStore<User | null>('lkr.user', null))
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  useEffect(() => writeStore('lkr.cart', cart), [cart])
  useEffect(() => writeStore('lkr.wishlist', wishlist), [wishlist])
  useEffect(() => writeStore('lkr.user', user), [user])

  // keep tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lkr.cart') setCart(readStore('lkr.cart', []))
      if (e.key === 'lkr.wishlist') setWishlist(readStore('lkr.wishlist', []))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const notify = useCallback((message: string, action?: Toast['action']) => {
    const id = ++toastId.current
    setToasts((t) => [...t.slice(-2), { id, message, action }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600)
  }, [])

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((c) => {
      const line = c.find((l) => l.id === id)
      if (line) return c.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      return [...c, { id, qty: Math.min(MAX_QTY, qty) }]
    })
  }, [])
  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))))
  }, [])
  const removeFromCart = useCallback((id: string) => setCart((c) => c.filter((l) => l.id !== id)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
  }, [])

  const value = useMemo<ShopState>(() => {
    const cartItems = cart.flatMap((l) => {
      const product = productById(l.id)
      return product ? [{ product, qty: l.qty }] : []
    })
    const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)
    const savings = cartItems.reduce((s, i) => s + ((i.product.compareAt ?? i.product.price) - i.product.price) * i.qty, 0)
    return {
      cart, cartItems, subtotal, savings,
      cartCount: cartItems.reduce((s, i) => s + i.qty, 0),
      addToCart, setQty, removeFromCart, clearCart,
      wishlist, toggleWishlist, isWished: (id) => wishlist.includes(id),
      user, signIn: setUser, signOut: () => setUser(null),
      cartOpen, setCartOpen, searchOpen, setSearchOpen,
      toasts, notify,
    }
  }, [cart, wishlist, user, cartOpen, searchOpen, toasts, addToCart, setQty, removeFromCart, clearCart, toggleWishlist, notify])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside ShopProvider')
  return ctx
}
