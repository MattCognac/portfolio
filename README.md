# Matt Hennessy Portfolio

This is my personal portfolio site. I built it to feel clean, immersive, and easy to explore without overcomplicating the experience.

The visual direction is intentionally minimal: a fluid interactive backdrop, simple panel navigation, and a structure that lets the work, photography, and writing speak for themselves. On the development side, I wanted the site to stay easy to maintain, so most of the content lives in one place and the UI is broken into small reusable pieces.

If you want to use this repo as a template for your own site, feel free. Please make it your own and replace all personal content and assets.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Custom WebGL fluid animation

## Running It Locally

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build
npm run start
npm run lint
```

## Content

Most of the site content lives in `src/data/portfolio.ts`, including:

- about copy
- project links
- photography entries
- skills
- social links

## Structure

- `src/components/HomePage.tsx` contains the main landing experience
- `src/components/home/` contains the panel UI
- `src/components/fluid/FluidBackdrop.tsx` handles the animated background
- `public/assets/` contains the images and logos used throughout the site

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the production URL so metadata and Open Graph tags resolve correctly.

## Deployment

I deploy this like a standard Next.js app:

1. Push to GitHub
2. Import into Vercel
3. Point the domain from Cloudflare to Vercel

## License

The code in this repository is licensed under the [MIT License](LICENSE).

All personal content and media, including text, photography, headshots, logos, and project-specific assets, are not covered by that license and may not be reused without permission.
