import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Matt Hennessy · Portfolio",
  description:
    "Matt Hennessy — projects, about, and contact.",
  openGraph: {
    title: "Matt Hennessy · Portfolio",
    description: "Matt Hennessy — projects, about, and contact.",
  },
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = false;
    if (stored === "dark") dark = true;
    else if (stored === "light") dark = false;
    else dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} h-dvh max-h-dvh overflow-hidden antialiased`}
    >
      <body className="h-dvh max-h-dvh overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
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
