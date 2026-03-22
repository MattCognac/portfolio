# Matt Hennessy Portfolio

A personal portfolio for Matt Hennessy built with Next.js. The site combines a fluid interactive backdrop with a clean panel-based interface for projects, photography, skills, and contact.

## Highlights

- Full-screen landing experience with a custom WebGL fluid background
- Panel-based navigation for story, projects, skills, photography, and contact
- Light and dark theme toggle
- Photography gallery with lightbox navigation
- Content-driven setup through a single portfolio data file

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Custom WebGL fluid animation

## Local Development

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run start
npm run lint
```

## Project Structure

- `src/data/portfolio.ts` stores the site copy, project links, photography, skills, and social links.
- `src/components/HomePage.tsx` renders the main landing experience.
- `src/components/home/` contains the panel UI for projects, skills, photography, and contact.
- `src/components/fluid/FluidBackdrop.tsx` powers the animated background.
- `public/assets/` contains the headshots, photography, and client logo assets used across the site.

## Configuration

- Set `NEXT_PUBLIC_SITE_URL` to your production URL so metadata and Open Graph tags resolve correctly.

## Deployment

The app is set up like a standard Next.js project and deploys cleanly to platforms like Vercel. A typical setup is:

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Point your custom domain DNS to Vercel from Cloudflare.
