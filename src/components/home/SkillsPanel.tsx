"use client";

import type { SkillsContent } from "@/lib/types";

export function SkillsPanel({ skills }: { skills: SkillsContent }) {
  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          How I Work
        </h3>
        <p className="max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          {skills.intro}
        </p>
      </section>

      <hr className="border-neutral-200/80 dark:border-neutral-700/70" />

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          Capabilities & Stack
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {skills.groups.map((group) => (
            <article
              key={group.title}
              className="flex h-full flex-col rounded-[1.35rem] border border-neutral-200/80 bg-white/55 p-4 transition hover:border-sky-300 hover:bg-white/78 dark:border-neutral-700/70 dark:bg-neutral-950/50 dark:hover:border-sky-500/45 dark:hover:bg-neutral-900/65"
            >
              <div className="md:min-h-[5.25rem]">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {group.title}
                </h4>
                <p className="mt-1.5 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                  {group.description}
                </p>
              </div>

              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium leading-5 text-neutral-700 dark:text-neutral-300">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/90 shadow-[0_0_10px_rgba(56,189,248,0.35)] dark:bg-sky-300/85"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
