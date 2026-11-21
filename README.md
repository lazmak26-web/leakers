# LEAKERS

Website for the LEAKERS ethical hacking team. React + TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger), Lenis smooth scroll.

## Edit the content

Everything the team changes lives in two files:

- `src/data/team.ts` — Discord link, socials, services, process, members, stats, track record (placeholders are marked `← EDIT`)
- `src/data/shop.ts` — shop products (name, price, description, optional image). The Order button opens Discord.

## Run

```bash
npm install
npm run dev
```

Production: `npm run build && npm start` (serves `dist/` on `$PORT`). Deployed on Railway from `main`.
