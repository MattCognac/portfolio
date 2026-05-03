import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/data/portfolio";
import { getAbsoluteUrl, siteTitle } from "@/lib/site";

export const metadata: Metadata = {
  title: `Skills | ${siteTitle}`,
  description:
    "Matt Hennessy's web development, design, product, marketing, analytics, infrastructure, and integration capabilities.",
  alternates: {
    canonical: getAbsoluteUrl("/skills"),
  },
};

export default function SkillsPage() {
  return (
    <main className="min-h-dvh bg-white px-5 py-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
        >
          Back to home
        </Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Skills</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-700 dark:text-neutral-300">
          {siteContent.skills.intro}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {siteContent.skills.groups.map((group) => (
            <section
              key={group.title}
              className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"
            >
              <h2 className="text-xl font-semibold">{group.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {group.description}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
