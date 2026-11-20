export type CategoryId =
  | 'ui-kits'
  | 'templates'
  | 'presets'
  | 'digital-assets'
  | 'software'
  | 'ebooks'
  | 'exclusive'

export interface Category {
  id: CategoryId
  name: string
  blurb: string
  art: ArtKind
}

export type ArtKind = 'grid' | 'frame' | 'curve' | 'mesh' | 'terminal' | 'type' | 'stack'

export interface Review {
  author: string
  role: string
  rating: number
  date: string
  title: string
  body: string
}

export interface Product {
  id: string
  slug: string
  code: string
  name: string
  category: CategoryId
  tagline: string
  description: string[]
  price: number
  compareAt?: number
  rating: number
  reviewCount: number
  sales: number
  includes: string[]
  features: { title: string; body: string }[]
  compatibility: string[]
  format: string
  size: string
  version: string
  updated: string
  license: string
  art: { kind: ArtKind; seed: number; label: string }
  featured?: boolean
  trending?: boolean
  limited?: boolean
  isNew?: boolean
  reviews: Review[]
}

export interface CartLine {
  id: string
  qty: number
}
