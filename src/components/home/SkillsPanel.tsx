"use client";

import type { SkillsContent } from "@/lib/types";

function FocusAreaRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </span>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-neutral-200/90 dark:bg-neutral-800/95"
        aria-hidden="true"
      >
        <div
          className="skills-bar-fill h-full rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function SkillsPanel({ skills }: { skills: SkillsContent }) {
  return (
    <div className="space-y-5">
      <section className="space-y-3.5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          Focus Areas
        </h3>
        <div className="grid gap-4">
          {skills.focusAreas.map((item) => (
            <FocusAreaRow
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </section>

      <hr className="border-neutral-200/80 dark:border-neutral-700/70" />

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          Technical
        </h3>
        {skills.groups.map((group) => (
          <div key={group.title}>
            <h4 className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
              {group.title}
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-neutral-200/85 bg-white/78 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:border-neutral-700/80 dark:bg-neutral-900/75 dark:text-neutral-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
