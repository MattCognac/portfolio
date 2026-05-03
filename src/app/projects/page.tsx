import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/data/portfolio";
import { getAbsoluteUrl, siteTitle } from "@/lib/site";

export const metadata: Metadata = {
  title: `Projects | ${siteTitle}`,
  description:
    "Explore Matt Hennessy's client projects and personal web products across Webflow, Next.js, React, and Vercel.",
  alternates: {
    canonical: getAbsoluteUrl("/projects"),
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-dvh bg-white px-5 py-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
        >
          Back to home
        </Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Projects</h1>
        <div className="mt-8 space-y-10">
          {siteContent.projects.map((group) => (
            <section key={group.title} className="space-y-4">
              <h2 className="text-2xl font-semibold">{group.title}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {group.items.map((project) => (
                  <a
                    key={project.title}
                    href={project.url}
                    className="rounded-2xl border border-neutral-200 p-5 transition hover:border-sky-300 dark:border-neutral-800 dark:hover:border-sky-500"
                  >
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                      {project.description}
                    </p>
                    {project.stack?.length ? (
                      <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-500">
                        {project.stack.join(" · ")}
                      </p>
                    ) : null}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
