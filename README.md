# LEAKERS

Website for the LEAKERS ethical hacking team. React + TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger), Lenis smooth scroll.

## Edit the content

Everything the team changes lives in two files:

- `src/data/team.ts` — Discord link, socials, services, process, members, stats, track record (placeholders are marked `← EDIT`)
- `public/products/` — the shop: `products.json` (names, descriptions, prices) and images `icon.png`, `icon1.png`… See `public/products/README.md`.

## Run

```bash
npm install
npm run dev
```

Production: `npm run build && npm start` (serves `dist/` on `$PORT`). Deployed on Railway from `main`.

## Security

- `server.mjs` (the production server, no dependencies) sets HTTP security headers on every response, blocks path traversal and non-GET methods, and returns real 404s for missing files: a strict Content-Security-Policy (no inline scripts or styles, no framing, no form posts), HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`, a locked-down Permissions-Policy and cross-origin isolation headers.
- `public/.well-known/security.txt` tells researchers how to report a vulnerability (Discord).
- Shop data from `products.json` is validated before rendering; the site has no backend, forms or user data.
- Run `npm audit` before releases.
