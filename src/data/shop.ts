/**
 * Shop products. Add, remove or edit entries here and the Shop section updates.
 * Orders happen on Discord: the "Order" button opens the team's Discord.
 * The four products below are examples ← EDIT: replace with your real products and prices.
 */
export interface ShopItem {
  id: string
  name: string
  category: string
  description: string
  price: string
  /** optional: shows a red badge, e.g. "New" or "-30%" */
  badge?: string
  /** optional: image URL or path in /public (e.g. '/products/kit.png'); without one, a generated cover is used */
  image?: string
}

export const products: ShopItem[] = [
  {
    id: 'web-pentest',
    name: 'Web App Pentest',
    category: 'Service',
    description: 'Full manual test of one web application or API, with a report and free retest.',
    price: 'On quote',
    badge: 'Popular',
  },
  {
    id: 'recon-kit',
    name: 'Recon Toolkit',
    category: 'Tools',
    description: 'Our scripts and wordlists for subdomain discovery and attack-surface mapping.',
    price: '$29',
    badge: 'New',
  },
  {
    id: 'ctf-course',
    name: 'CTF Bootcamp',
    category: 'Training',
    description: 'Four weeks of guided challenges: web, crypto, pwn and forensics, with live sessions.',
    price: '$49',
  },
  {
    id: 'audit',
    name: 'Security Audit',
    category: 'Service',
    description: 'Code and cloud configuration review that finds what scanners miss.',
    price: 'On quote',
  },
]
