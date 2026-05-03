import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/data/portfolio";
import { getAbsoluteUrl, siteTitle } from "@/lib/site";

export const metadata: Metadata = {
  title: `About Matt Hennessy | ${siteTitle}`,
  description:
    "Learn more about Matt Hennessy, a Pacific Northwest-based designer, developer, and adventure photographer.",
  alternates: {
    canonical: getAbsoluteUrl("/about"),
  },
};

export default function AboutPage() {
  const paragraphs = Array.isArray(siteContent.about)
    ? siteContent.about
    : [siteContent.about];

  return (
    <main className="min-h-dvh bg-white px-5 py-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
        >
          Back to home
        </Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">About Matt Hennessy</h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-neutral-700 dark:text-neutral-300">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
