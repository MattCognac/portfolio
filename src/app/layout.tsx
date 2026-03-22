import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mattcognac.com";
const openGraphImagePath = "/opengraph-image.png";

const title = "Matt Hennessy · Designer, Developer & Photographer";
const description =
  "Matt Hennessy — a PNW-based designer, developer, and adventure photographer. Explore projects, photography, and more.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Matt Hennessy",
    "portfolio",
    "web developer",
    "designer",
    "photographer",
    "Pacific Northwest",
    "freelance",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Matt Hennessy" }],
  creator: "Matt Hennessy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Matt Hennessy",
    title,
    description,
    images: [{ url: openGraphImagePath, width: 1024, height: 527, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@MattCognacX",
    images: [openGraphImagePath],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = true;
    if (stored === "dark") dark = true;
    else if (stored === "light") dark = false;
    document.documentElement.classList.toggle("dark", dark);
  } catch (_) {}
})();
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Matt Hennessy",
      url: siteUrl,
      description,
    },
    {
      "@type": "Person",
      name: "Matt Hennessy",
      url: siteUrl,
      jobTitle: "Designer & Developer",
      sameAs: [
        "https://github.com/MattCognac",
        "https://www.instagram.com/mattcognac/",
        "https://x.com/MattCognacX",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} dark h-dvh max-h-dvh overflow-hidden antialiased`}
    >
      <body className="h-dvh max-h-dvh overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
        <Analytics />
        <SpeedInsights />
        <noscript>
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-white p-8 text-center text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">
            <p>
              Enable JavaScript to see the fluid background and custom cursor.
              Links and text on this page still work without it.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
