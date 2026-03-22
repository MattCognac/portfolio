# Portfolio

Simple, scrollable portfolio (default): projects, stack, travels, and contact — warm dark theme, no hero image required.

An **optional interactive campsite scene** is still available if you add art later.

## Scripts

```bash
npm run dev    # dev server (Turbopack)
npm run build  # production build
npm run start  # run production build
npm run lint
```

## Customize

- **Content:** [`src/data/portfolio.ts`](src/data/portfolio.ts) — bio, projects, links, stack, `photography` (optional array; leave empty to hide the section on the simple site).
- **Interactive scene:** add `public/assets/campsite.png` and open [`/?view=scene`](http://localhost:3000/?view=scene). Hotspot positions live in `hotspotConfigs` in the same file.
- **Ambient sound (scene only):** `public/assets/audio/campfire.mp3`
- **Production URL:** set `NEXT_PUBLIC_SITE_URL` for Open Graph (`layout.tsx`).

## Routes

- `/` — simple portfolio (default).
- `/?view=scene` — full-screen interactive scene + loader (experimental).

## Stack

Next.js (App Router), React, Tailwind CSS v4, Framer Motion.
