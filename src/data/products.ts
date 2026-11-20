import type { Category, CategoryId, Product, Review } from './types'

export const categories: Category[] = [
  { id: 'ui-kits', name: 'UI Kits', blurb: 'Component systems for Figma and code, built to ship real products.', art: 'grid' },
  { id: 'templates', name: 'Templates', blurb: 'Sites, decks and Notion workspaces you can launch this afternoon.', art: 'frame' },
  { id: 'presets', name: 'Presets', blurb: 'Colour grades and LUTs tuned on real footage, not stock samples.', art: 'curve' },
  { id: 'digital-assets', name: 'Digital Assets', blurb: 'Textures, 3D objects, mockups and type for your next campaign.', art: 'mesh' },
  { id: 'software', name: 'Software & Tools', blurb: 'Plugins, scripts and utilities that remove the boring parts.', art: 'terminal' },
  { id: 'ebooks', name: 'E-books', blurb: 'Field guides from people who do the work, not people who talk about it.', art: 'type' },
  { id: 'exclusive', name: 'Exclusive Packs', blurb: 'Limited bundles. When the run is gone, it is gone.', art: 'stack' },
]

export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!

const reviewPool: Record<CategoryId, Review[]> = {
  'ui-kits': [
    { author: 'Mara Lindqvist', role: 'Product designer, Stockholm', rating: 5, date: '2026-10-28', title: 'Auto layout done properly', body: 'Every component resizes the way you expect. I rebuilt our settings flow in a day and the dev handoff was almost boring.' },
    { author: 'Dev Okafor', role: 'Frontend lead', rating: 5, date: '2026-09-14', title: 'Tokens match the code', body: 'The variable collections map one to one with the Tailwind config. That alone saved us a sprint.' },
    { author: 'Lea Moreau', role: 'Freelance UI designer', rating: 4, date: '2026-08-02', title: 'Huge, but well named', body: 'There is a lot in here. The naming is consistent enough that search in the assets panel actually works.' },
  ],
  templates: [
    { author: 'Sam Reyes', role: 'Founder, two-person studio', rating: 5, date: '2026-11-03', title: 'Launched the same week', body: 'Swapped copy, swapped images, pushed to production. Lighthouse scores were green out of the box.' },
    { author: 'Hana Kim', role: 'Marketing lead', rating: 4, date: '2026-10-11', title: 'Clean code, clear docs', body: 'The README walks through every section. I would have liked one more pricing layout, but that is minor.' },
  ],
  presets: [
    { author: 'Youssef Benali', role: 'Wedding filmmaker', rating: 5, date: '2026-10-19', title: 'Skin tones survive', body: 'Most packs crush skin into orange. These hold up under tungsten and mixed light, which is where I need them.' },
    { author: 'Iris Novak', role: 'Street photographer', rating: 5, date: '2026-09-07', title: 'Subtle when you want it', body: 'The strength slider in each profile is the real feature. I use 40% on almost everything.' },
  ],
  'digital-assets': [
    { author: 'Tomás Ferreira', role: 'Art director', rating: 5, date: '2026-10-22', title: 'Actually high resolution', body: '8K scans with no visible tiling. We used three of these on a billboard and nobody could tell.' },
    { author: 'Nia Adams', role: '3D generalist', rating: 4, date: '2026-08-30', title: 'Good topology', body: 'Clean quads, sensible UVs. Blender files open without missing textures, which is rarer than it should be.' },
  ],
  software: [
    { author: 'Ken Watanabe', role: 'Motion designer', rating: 5, date: '2026-11-08', title: 'Paid for itself on day one', body: 'Batch renaming 400 layers used to take an hour. Now it takes a keyboard shortcut.' },
    { author: 'Priya Shah', role: 'Developer', rating: 4, date: '2026-09-25', title: 'Solid and fast', body: 'Works offline, no account required. The changelog is honest about what changed, which I appreciate.' },
  ],
  ebooks: [
    { author: 'Oliver Grant', role: 'Independent designer', rating: 5, date: '2026-10-15', title: 'No filler chapters', body: 'Every chapter ends with something I could use the same day. The pricing chapter alone changed how I quote.' },
    { author: 'Chloé Martin', role: 'Brand strategist', rating: 5, date: '2026-07-21', title: 'Real numbers', body: 'The case studies include actual rates and actual outcomes. Most books in this space are vague on purpose.' },
  ],
  exclusive: [
    { author: 'Rami Haddad', role: 'Creative director', rating: 5, date: '2026-11-12', title: 'Worth the drop', body: 'Bought it in the first hour. The bonus files were not mentioned anywhere and they are some of the best in the pack.' },
    { author: 'Ava Thompson', role: 'Content creator', rating: 5, date: '2026-10-30', title: 'Everything I use daily', body: 'Replaced four separate subscriptions with one bundle. The presets and templates share a look, so it all fits together.' },
  ],
}

type Seed = Omit<Product, 'reviews' | 'slug'> & { reviews?: Review[] }

const seeds: Seed[] = [
  {
    id: 'p01', code: 'LKR-0142', name: 'Obsidian System', category: 'ui-kits',
    tagline: 'A 1,400-component design system for dark interfaces.',
    description: [
      'Obsidian is a complete design system for products that live in the dark. Every component was designed on #050505 first, so contrast, elevation and focus states are solved for dark mode rather than inverted from light.',
      'It ships as a Figma library with variables and a matching React + Tailwind codebase. The tokens in Figma and the tokens in code share names, so designers and developers talk about the same thing.',
    ],
    price: 129, compareAt: 189, rating: 4.9, reviewCount: 312, sales: 4810,
    includes: ['Figma library with 1,400+ components', 'React + Tailwind source (TypeScript)', '42 ready-made screens', 'Variable collections for colour, type and spacing', 'Lifetime updates'],
    features: [
      { title: 'Dark-first contrast', body: 'Every text and surface pair passes WCAG AA on the dark base.' },
      { title: 'Code parity', body: 'Figma variables mirror the Tailwind theme one to one.' },
      { title: 'Real states', body: 'Hover, focus, loading, empty and error states for every interactive component.' },
    ],
    compatibility: ['Figma (variables required)', 'React 18+', 'Tailwind CSS 3.4 and 4', 'Next.js, Vite, Remix'],
    format: 'FIG, TSX', size: '214 MB', version: '3.2.0', updated: '2026-11-02', license: 'Commercial, unlimited projects',
    art: { kind: 'grid', seed: 3, label: 'OBS' }, featured: true, trending: true,
  },
  {
    id: 'p02', code: 'LKR-0157', name: 'Dispatch Dashboard Kit', category: 'ui-kits',
    tagline: 'Data-dense dashboard components that stay readable.',
    description: [
      'Tables, charts, filters and command palettes for operational software. Dispatch is built for screens people stare at for eight hours, so density is high and noise is low.',
      'Charts are built on a single 12-step scale, which keeps every visualisation consistent without manual colour picking.',
    ],
    price: 79, rating: 4.7, reviewCount: 148, sales: 1920,
    includes: ['380 dashboard components', '24 chart types', '18 full dashboard layouts', 'Icon set (620 icons)'],
    features: [
      { title: 'Density modes', body: 'Comfortable, compact and condensed spacing in one toggle.' },
      { title: 'Chart scale', body: 'A single 12-step palette tuned for colour-blind readers.' },
      { title: 'Keyboard-first', body: 'Command palette and shortcut patterns included.' },
    ],
    compatibility: ['Figma', 'Penpot (import)', 'Works with any front-end stack'],
    format: 'FIG', size: '96 MB', version: '2.0.4', updated: '2026-10-18', license: 'Commercial, unlimited projects',
    art: { kind: 'grid', seed: 7, label: 'DSP' }, isNew: true,
  },
  {
    id: 'p03', code: 'LKR-0161', name: 'Afterhours Portfolio', category: 'templates',
    tagline: 'An editorial portfolio template for designers who ship.',
    description: [
      'A fast, opinionated portfolio site with case study pages, a project index and a journal. Built with Astro and plain CSS, it scores 100 on Lighthouse without tuning.',
      'Content lives in Markdown, so updating a case study is a text edit, not a CMS migration.',
    ],
    price: 49, compareAt: 69, rating: 4.8, reviewCount: 221, sales: 3105,
    includes: ['Astro source code', '8 page templates', 'Case study layout with image sequences', 'Deployment guide for Vercel, Netlify and Railway'],
    features: [
      { title: 'Markdown content', body: 'Write case studies in plain text with frontmatter.' },
      { title: 'Zero JS by default', body: 'Interactive islands only where they earn their weight.' },
      { title: 'Image pipeline', body: 'Automatic AVIF and WebP with responsive sizes.' },
    ],
    compatibility: ['Astro 5', 'Node 20+', 'Any static host'],
    format: 'Source code', size: '18 MB', version: '1.6.0', updated: '2026-10-29', license: 'Personal and client use',
    art: { kind: 'frame', seed: 2, label: 'AFH' }, featured: true, trending: true,
  },
  {
    id: 'p04', code: 'LKR-0173', name: 'Ledger Notion OS', category: 'templates',
    tagline: 'Run a freelance business from one Notion workspace.',
    description: [
      'Clients, projects, invoices and time tracking, linked together so you stop copying numbers between apps. Ledger was built by a freelancer running it for three years.',
      'Includes a weekly review dashboard that shows revenue, pipeline and overdue invoices at a glance.',
    ],
    price: 29, rating: 4.6, reviewCount: 402, sales: 6230,
    includes: ['Notion workspace (duplicate link)', 'CRM, projects, invoices and time databases', 'Weekly review dashboard', 'Video walkthrough (34 min)'],
    features: [
      { title: 'Linked databases', body: 'An invoice knows its client, project and hours.' },
      { title: 'Rollup finance', body: 'Monthly and yearly revenue calculated automatically.' },
      { title: 'Simple by default', body: 'Advanced views are hidden until you need them.' },
    ],
    compatibility: ['Notion (free plan works)', 'Desktop, web and mobile'],
    format: 'Notion template', size: '—', version: '4.1', updated: '2026-09-30', license: 'Single user',
    art: { kind: 'frame', seed: 9, label: 'LDG' }, trending: true,
  },
  {
    id: 'p05', code: 'LKR-0188', name: 'Sodium Night LUTs', category: 'presets',
    tagline: '24 colour grades built for city footage after dark.',
    description: [
      'Sodium Night was graded on real night footage shot on Sony, Canon and iPhone. It controls the orange spill of sodium street lights without turning skin grey.',
      'Each LUT comes in log and Rec.709 versions, so it works whether you shoot flat or not.',
    ],
    price: 39, compareAt: 59, rating: 4.9, reviewCount: 267, sales: 5410,
    includes: ['24 .cube LUTs (Log and Rec.709)', 'Lightroom and Camera Raw profiles', 'Before/after reference stills', 'Installation guide'],
    features: [
      { title: 'Skin protection', body: 'Hue-qualified so faces hold under mixed lighting.' },
      { title: 'Two input spaces', body: 'S-Log3, C-Log3, Apple Log and Rec.709 versions.' },
      { title: 'Variable strength', body: 'Profiles respect the amount slider in Lightroom.' },
    ],
    compatibility: ['DaVinci Resolve', 'Premiere Pro', 'Final Cut Pro', 'Lightroom Classic and CC', 'CapCut'],
    format: 'CUBE, XMP', size: '62 MB', version: '2.1', updated: '2026-10-05', license: 'Commercial use',
    art: { kind: 'curve', seed: 4, label: 'SDM' }, featured: true, trending: true,
  },
  {
    id: 'p06', code: 'LKR-0192', name: 'Grain Archive Mobile', category: 'presets',
    tagline: 'Film emulation presets for the phone in your pocket.',
    description: [
      'Twelve presets modelled on discontinued film stocks, tuned for phone sensors. Grain is applied per-channel, so it reads as film rather than noise.',
    ],
    price: 19, rating: 4.5, reviewCount: 538, sales: 9870,
    includes: ['12 DNG presets for Lightroom Mobile', '12 desktop XMP profiles', 'Quick-start PDF'],
    features: [
      { title: 'Per-channel grain', body: 'Luminance and colour grain sized for 12 MP files.' },
      { title: 'Highlight roll-off', body: 'Soft shoulders, like the stocks they are based on.' },
      { title: 'One-tap install', body: 'Import once and they sync to every device.' },
    ],
    compatibility: ['Lightroom Mobile (free)', 'Lightroom Classic', 'iOS and Android'],
    format: 'DNG, XMP', size: '8 MB', version: '1.3', updated: '2026-08-12', license: 'Personal and commercial',
    art: { kind: 'curve', seed: 11, label: 'GRN' }, isNew: true,
  },
  {
    id: 'p07', code: 'LKR-0204', name: 'Concrete Scan Library', category: 'digital-assets',
    tagline: '120 8K surface scans from abandoned industrial sites.',
    description: [
      'Concrete, rust, tar and painted steel, photogrammetry-scanned across six sites in Eastern Europe. Every material ships with full PBR maps and seamless tiling.',
    ],
    price: 89, compareAt: 129, rating: 4.8, reviewCount: 96, sales: 1180,
    includes: ['120 PBR materials (8K)', 'Albedo, normal, roughness, height and AO maps', 'Blender asset library file', 'Preview renders'],
    features: [
      { title: 'True 8K', body: 'Captured at full resolution, not upscaled.' },
      { title: 'Seamless', body: 'Tiling checked at 4× repeat with no visible seams.' },
      { title: 'Engine ready', body: 'Packed maps for Unreal and Unity included.' },
    ],
    compatibility: ['Blender 4+', 'Cinema 4D', 'Unreal Engine 5', 'Unity', 'Substance Painter'],
    format: 'EXR, PNG, BLEND', size: '38 GB', version: '1.0', updated: '2026-07-19', license: 'Commercial, royalty free',
    art: { kind: 'mesh', seed: 5, label: 'CNC' }, trending: true,
  },
  {
    id: 'p08', code: 'LKR-0215', name: 'Static Mockup Set', category: 'digital-assets',
    tagline: 'Photoreal device and print mockups shot in studio.',
    description: [
      'Forty mockups photographed in a real studio, then rebuilt with smart objects. Shadows and reflections are real, so your work looks placed, not pasted.',
    ],
    price: 45, rating: 4.6, reviewCount: 173, sales: 2640,
    includes: ['40 layered PSD mockups', 'Phones, laptops, posters and packaging', 'Separate shadow and reflection layers'],
    features: [
      { title: 'Real light', body: 'Shot on set, not rendered.' },
      { title: 'Smart objects', body: 'Drop your design in, save, done.' },
      { title: 'Swap backgrounds', body: 'Every mockup isolated on its own layer.' },
    ],
    compatibility: ['Photoshop 2022+', 'Photopea', 'Affinity Photo 2'],
    format: 'PSD', size: '5.4 GB', version: '1.2', updated: '2026-09-02', license: 'Commercial use',
    art: { kind: 'mesh', seed: 13, label: 'STC' }, trending: true,
  },
  {
    id: 'p09', code: 'LKR-0226', name: 'Rename Pro for Figma', category: 'software',
    tagline: 'Batch rename, number and clean layers in seconds.',
    description: [
      'A Figma plugin that renames layers with patterns, numbering and find-and-replace, then cleans up the leftovers: empty groups, hidden layers and default names.',
      'Runs locally. No account, no tracking, no network requests.',
    ],
    price: 24, rating: 4.9, reviewCount: 689, sales: 12400,
    includes: ['Lifetime licence key', 'Plugin for Figma and FigJam', 'Pattern presets library'],
    features: [
      { title: 'Pattern rename', body: 'Use tokens like {n}, {parent} and {w}×{h}.' },
      { title: 'Cleanup pass', body: 'Remove empty frames and default names in one run.' },
      { title: 'Offline', body: 'No data leaves your file.' },
    ],
    compatibility: ['Figma desktop and browser', 'FigJam'],
    format: 'Figma plugin', size: '—', version: '5.0.2', updated: '2026-11-10', license: 'Single seat, lifetime',
    art: { kind: 'terminal', seed: 6, label: 'RNM' }, featured: true, trending: true,
  },
  {
    id: 'p10', code: 'LKR-0231', name: 'Cutline Export Script', category: 'software',
    tagline: 'Export every artboard at every size with one command.',
    description: [
      'A command-line tool that reads your design file and exports every artboard in every format and density you define in a single config file. Built for teams who export app store assets every release.',
    ],
    price: 34, compareAt: 44, rating: 4.7, reviewCount: 88, sales: 940,
    includes: ['CLI binaries for macOS, Windows and Linux', 'Config templates for iOS, Android and web', 'CI integration guide'],
    features: [
      { title: 'One config', body: 'Define sizes once, export forever.' },
      { title: 'CI ready', body: 'Runs in GitHub Actions and GitLab CI.' },
      { title: 'Fast', body: 'Parallel export across all cores.' },
    ],
    compatibility: ['macOS 12+', 'Windows 10+', 'Ubuntu 20.04+', 'Figma and Sketch files'],
    format: 'Binary', size: '24 MB', version: '2.3.1', updated: '2026-10-21', license: 'Team of 5',
    art: { kind: 'terminal', seed: 12, label: 'CUT' }, isNew: true,
  },
  {
    id: 'p11', code: 'LKR-0240', name: 'The Quiet Rate', category: 'ebooks',
    tagline: 'How independent designers charge more without selling harder.',
    description: [
      'A 180-page guide to pricing creative work, written from eleven years of freelance invoices. It covers value pricing, retainers, scoping and the exact emails that move a client from hourly to project fees.',
    ],
    price: 27, rating: 4.9, reviewCount: 455, sales: 7720,
    includes: ['E-book (PDF and EPUB)', 'Proposal and scope templates', '14 email scripts', 'Pricing calculator spreadsheet'],
    features: [
      { title: 'Real numbers', body: 'Actual quotes, actual outcomes, nothing rounded.' },
      { title: 'Scripts included', body: 'Copy the emails, change the names.' },
      { title: 'Short chapters', body: 'Each one ends with a single action.' },
    ],
    compatibility: ['Any PDF reader', 'Apple Books, Kindle (EPUB)', 'Google Sheets or Excel'],
    format: 'PDF, EPUB, XLSX', size: '22 MB', version: '2nd edition', updated: '2026-06-14', license: 'Single reader',
    art: { kind: 'type', seed: 1, label: 'QR' }, featured: true, trending: true,
  },
  {
    id: 'p12', code: 'LKR-0247', name: 'Grids That Hold', category: 'ebooks',
    tagline: 'Layout systems for screens, explained with real pages.',
    description: [
      'Ninety annotated layouts that show why a grid works, not just that it does. Covers column systems, baseline rhythm and how to break a grid on purpose.',
    ],
    price: 22, compareAt: 32, rating: 4.7, reviewCount: 132, sales: 2210,
    includes: ['E-book (PDF)', '90 annotated layouts', 'Figma grid presets'],
    features: [
      { title: 'Annotated', body: 'Every page explains the decision behind it.' },
      { title: 'Screen-native', body: 'Written for responsive layouts, not print.' },
      { title: 'Usable presets', body: 'Import the grids straight into Figma.' },
    ],
    compatibility: ['Any PDF reader', 'Figma'],
    format: 'PDF, FIG', size: '140 MB', version: '1.1', updated: '2026-05-03', license: 'Single reader',
    art: { kind: 'type', seed: 8, label: 'GTH' },
  },
  {
    id: 'p13', code: 'LKR-0250', name: 'Blackout Bundle 26', category: 'exclusive',
    tagline: 'Our full year of releases in one limited drop.',
    description: [
      'Every product we released in 2026, plus nine files that are only available in this bundle. Limited to 500 licences.',
      'Includes Obsidian System, Sodium Night LUTs, Afterhours Portfolio, Rename Pro and The Quiet Rate.',
    ],
    price: 249, compareAt: 498, rating: 5.0, reviewCount: 74, sales: 386,
    includes: ['14 full products', '9 bundle-only files', 'Priority support for 12 months', 'Numbered licence certificate'],
    features: [
      { title: 'Half price', body: 'Bundled for less than half the individual total.' },
      { title: 'Bundle-only files', body: 'Nine assets that will not be sold separately.' },
      { title: 'Numbered run', body: 'Your licence number is printed on your certificate.' },
    ],
    compatibility: ['See individual products'],
    format: 'Mixed', size: '44 GB', version: '2026', updated: '2026-11-15', license: 'Commercial, unlimited projects',
    art: { kind: 'stack', seed: 10, label: '26' }, featured: true, trending: true, limited: true,
  },
  {
    id: 'p14', code: 'LKR-0253', name: 'Creator Starter Vault', category: 'exclusive',
    tagline: 'The essentials for a new channel, in one download.',
    description: [
      'Thumbnails, overlays, LUTs and a content calendar, designed to share one visual language. Built for creators who want to look established on their first upload.',
    ],
    price: 59, compareAt: 119, rating: 4.8, reviewCount: 201, sales: 3390,
    includes: ['60 thumbnail templates', 'Stream overlay set', '10 LUTs', 'Notion content calendar'],
    features: [
      { title: 'One look', body: 'Every file shares type, colour and spacing.' },
      { title: 'Editable everywhere', body: 'Photoshop, Canva and Figma versions.' },
      { title: 'Platform sizes', body: 'YouTube, TikTok, Twitch and Instagram ready.' },
    ],
    compatibility: ['Photoshop', 'Canva', 'Figma', 'OBS', 'Notion'],
    format: 'Mixed', size: '3.1 GB', version: '1.0', updated: '2026-10-08', license: 'Commercial use',
    art: { kind: 'stack', seed: 14, label: 'CSV' }, limited: true, trending: true,
  },
  {
    id: 'p15', code: 'LKR-0258', name: 'Signal Type Pack', category: 'digital-assets',
    tagline: 'Three display typefaces for posters and covers.',
    description: [
      'Three variable display families with compressed, regular and extended widths. Drawn for headlines at 120 pt and above.',
    ],
    price: 69, rating: 4.7, reviewCount: 64, sales: 870,
    includes: ['3 variable font families', 'OTF, TTF, WOFF2', 'Specimen PDF'],
    features: [
      { title: 'Variable width', body: 'From compressed to extended in one file.' },
      { title: 'Web ready', body: 'Subsetted WOFF2 files included.' },
      { title: 'Wide language support', body: 'Latin Extended and Cyrillic.' },
    ],
    compatibility: ['macOS, Windows', 'Adobe CC', 'Figma', 'Web (WOFF2)'],
    format: 'OTF, TTF, WOFF2', size: '12 MB', version: '1.0', updated: '2026-11-01', license: 'Desktop + web, 1 domain',
    art: { kind: 'type', seed: 15, label: 'Aa' }, isNew: true,
  },
  {
    id: 'p16', code: 'LKR-0262', name: 'Launchpad SaaS Template', category: 'templates',
    tagline: 'A Next.js marketing site with pricing, docs and blog.',
    description: [
      'Everything a software product needs before launch: landing page, pricing, changelog, docs and blog, wired to MDX. Restrained, fast and easy to restyle.',
    ],
    price: 79, compareAt: 99, rating: 4.6, reviewCount: 119, sales: 1530,
    includes: ['Next.js 15 source (TypeScript)', '12 pages', 'MDX docs and blog', 'Figma design file'],
    features: [
      { title: 'MDX everywhere', body: 'Docs, changelog and blog from Markdown.' },
      { title: 'Theme in one file', body: 'Change the look from a single token file.' },
      { title: 'SEO set up', body: 'Sitemaps, Open Graph images and metadata included.' },
    ],
    compatibility: ['Next.js 15', 'Node 20+', 'Vercel, Railway, Netlify'],
    format: 'Source code, FIG', size: '41 MB', version: '2.2.0', updated: '2026-10-25', license: 'Unlimited projects',
    art: { kind: 'frame', seed: 16, label: 'LPD' },
  },
]

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const products: Product[] = seeds.map((s) => ({
  ...s,
  slug: slugify(s.name),
  reviews: s.reviews ?? reviewPool[s.category],
}))

export const productById = (id: string) => products.find((p) => p.id === id)
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)

export const discountOf = (p: Product) =>
  p.compareAt ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0
