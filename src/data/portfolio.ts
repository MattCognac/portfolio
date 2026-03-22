import type { SiteContent } from "@/lib/types";

export const siteContent: SiteContent = {
  watermark: "Hennessy",
  headline: "Hey, I'm Matt.",
  subtext: [
    "PNW-based designer, developer, and adventure photographer.",
    "Explore my work below — thanks for stopping by!",
  ],
  avatarSrc: "/assets/headshot.png",
  avatarAlt:
    "Professional headshot of Matt Hennessy, smiling, lit by warm sunlight against a blurred dark green background.",
  about: [
    "I'm a self-taught designer and developer from the foothills of Northern California. After spending the last few years living out of a backpack across Europe and Southeast Asia, I recently put down roots in the Pacific Northwest.",
    "I love building things — the medium changes, from woodworking to apps to renovating off-grid campers, but the feeling is the same: taking a vision and bringing it to life.",
    "When I'm not working, I'm usually skiing, mountain biking, exploring backroads, or soaking in remote hot springs. On the quieter side, nothing beats a slow Sunday morning with a good cup of coffee ☕️",
    "I care deeply about community, mental health, and personal growth, and I'm driven by solving problems that make the world a better place for people.",
  ],
  photography: [
    "Photography has become one of my favorite ways to slow down and pay attention. Most of what I shoot lives at the intersection of adventure, landscape, and life on the road.",
    "I'm especially drawn to quiet campsites, mountain light, long drives on backroads, and the small in-between moments that make a place feel real.",
  ],
  photos: [
    {
      thumbSrc: "/assets/photography/salt-spiral.png",
      fullSrc: "/assets/photography/salt-spiral.png",
      alt: "An aerial view of a dramatic spiral landform edged with white salt against warm brown earth.",
      width: 819,
      height: 1024,
      story:
        "A graphic aerial frame where the curves and contrast felt more like a painting than a landscape.",
    },
    {
      thumbSrc: "/assets/photography/turquoise-shoreline.png",
      fullSrc: "/assets/photography/turquoise-shoreline.png",
      alt: "Turquoise water meeting a rocky tropical shoreline beside dense green jungle.",
      width: 819,
      height: 1024,
      story:
        "The color separation here is what pulled me in first: deep jungle, pale rock, and water that almost looked unreal from above.",
    },
    {
      thumbSrc: "/assets/photography/bamboo-grove.png",
      fullSrc: "/assets/photography/bamboo-grove.png",
      alt: "Tall bamboo trunks disappearing into a moody, shadowy grove.",
      width: 682,
      height: 1024,
      story:
        "A quieter image built around repetition and texture, with just enough light filtering through to keep the scene alive.",
    },
    {
      thumbSrc: "/assets/photography/rice-terrace.png",
      fullSrc: "/assets/photography/rice-terrace.png",
      alt: "A lone figure standing in a sunlit rice terrace bordered by dense tropical trees.",
      width: 1024,
      height: 639,
      story:
        "I like how small the person feels here against the scale of the landscape and the soft haze moving through the field.",
    },
    {
      thumbSrc: "/assets/photography/winter-village.png",
      fullSrc: "/assets/photography/winter-village.png",
      alt: "A snowy lakeside village with a church spire beneath fog-covered alpine mountains.",
      width: 1024,
      height: 639,
      story:
        "A still winter scene where the low clouds and muted palette made everything feel suspended for a moment.",
    },
  ],
  projects: [
    {
      title: "Client Projects",
      items: [
        {
          title: "Ag BioTech",
          description:
            "Marketing site for a sustainable agriculture company focused on biostimulants and biofertilizers that improve crop yields, soil health, and climate resilience.",
          url: "https://www.agbioinc.com/",
          stack: ["Webflow", "HTML", "CSS", "JavaScript"],
        },
        {
          title: "Just Hands Foundation",
          description:
            "Nonprofit website spotlighting adaptive motorsports and mountain biking, built to communicate the mission of leveling the playing field for disabled athletes.",
          url: "https://www.justhands.org/",
          stack: ["Webflow", "HTML", "CSS", "JavaScript"],
        },
        {
          title: "FoundStock",
          description:
            "Brand and certification site explaining how excess textile inventory is audited, certified, and turned into verified, traceable materials for reuse.",
          url: "https://www.foundstock.org/",
          stack: ["Webflow", "HTML", "CSS", "JavaScript"],
        },
        {
          title: "Aloqia",
          description:
            "Enterprise marketing site for an excess inventory platform that helps brands resell, reuse, recycle, and better manage surplus across supply chains.",
          url: "https://www.aloqia.com/",
          stack: ["Webflow", "HTML", "CSS", "JavaScript"],
        },
      ],
    },
    {
      title: "Personal Projects",
      items: [
        {
          title: "Pomoflow",
          description:
            "A deep work timer that blends pomodoro structure with flow-state thinking, helping people stay focused without breaking concentration at the wrong moment.",
          url: "https://www.pomoflowapp.com/",
          stack: ["Next.js", "React", "JavaScript", "Vercel"],
        },
        {
          title: "Memberbase",
          description:
            "Consumer-facing product site for a membership savings app that reminds users where benefits from programs like AAA, AARP, and Costco can be used.",
          url: "https://memberbase-marketing.vercel.app/",
          stack: ["Next.js", "React", "JavaScript", "Vercel"],
        },
      ],
    },
  ],
  skills: {
    focusAreas: [
      { label: "Resourcefulness", value: 95 },
      { label: "Communication", value: 92 },
      { label: "Product Thinking", value: 90 },
      { label: "Leadership", value: 87 },
    ],
    groups: [
      {
        title: "Frontend",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        title: "Backend",
        items: ["Node.js", "Prisma", "PostgreSQL", "Supabase"],
      },
      {
        title: "Design",
        items: ["Figma", "Webflow", "Design systems"],
      },
      {
        title: "Product & Tooling",
        items: ["Stripe", "Vercel", "Resend", "Python", "AI-assisted development"],
      },
    ],
  },
  socials: [
    {
      kind: "email",
      label: "Email",
      url: "mailto:matthewrhennessy@gmail.com",
      handle: "matthewrhennessy@gmail.com",
      eyebrow: "Direct line",
      description:
        "For freelance work, collaborations, or just saying hi.",
      ctaLabel: "Send email",
    },
    {
      kind: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/mattcognac/",
      handle: "@mattcognac",
      eyebrow: "Adventure and photography",
      description: "Trips, campsites, and photos from the field.",
      ctaLabel: "Open Instagram",
    },
    {
      kind: "github",
      label: "GitHub",
      url: "https://github.com/MattCognac",
      handle: "@MattCognac",
      eyebrow: "Code and experiments",
      description: "Repos, side projects, and experiments.",
      ctaLabel: "View GitHub",
    },
    {
      kind: "x",
      label: "X Feed",
      url: "https://x.com/MattCognacX",
      handle: "@MattCognacX",
      eyebrow: "Feed and updates",
      description: "Quick notes and work-in-public updates.",
      ctaLabel: "Open X feed",
    },
  ],
};
