import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/data/portfolio";
import { getAbsoluteUrl, siteTitle } from "@/lib/site";

export const metadata: Metadata = {
  title: `Photography | ${siteTitle}`,
  description:
    "Adventure and travel photography by Matt Hennessy, featuring landscapes, coastlines, mountains, waterfalls, and remote places.",
  alternates: {
    canonical: getAbsoluteUrl("/photography"),
  },
};

export default function PhotographyPage() {
  return (
    <main className="min-h-dvh bg-white px-5 py-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
        >
          Back to home
        </Link>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Photography</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-700 dark:text-neutral-300">
          A selection of adventure, travel, and landscape photography from the field.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteContent.photos.map((photo) => (
            <figure
              key={photo.thumbSrc}
              className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800"
            >
              <Image
                src={photo.thumbSrc}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/5] h-auto w-full object-cover"
              />
              <figcaption className="p-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {photo.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </article>
    </main>
  );
}
