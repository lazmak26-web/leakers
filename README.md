# LEAKERS

Website for the LEAKERS ethical hacking team. React + TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger), Lenis smooth scroll.

## Edit the content

Everything the team changes lives in two files:

- `src/data/team.ts` — contact email, PGP, location, socials, services, process, members, stats, track record (placeholders are marked `← EDIT`)
- `src/data/writeups.ts` — write-ups

## Run

```bash
npm install
npm run dev
```

Production: `npm run build && npm start` (serves `dist/` on `$PORT`). Deployed on Railway from `main`.

The contact form validates input and opens the visitor's email app with the request pre-filled; no backend needed.
