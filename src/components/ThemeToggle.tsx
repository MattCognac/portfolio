"use client";

import { useCallback } from "react";
import { applyTheme, useThemeIsDark } from "@/lib/theme";

export function ThemeToggle() {
  const isDark = useThemeIsDark();

  const toggle = useCallback(() => {
    applyTheme(!document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="pointer-events-auto fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/90 bg-white/70 text-neutral-700 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition hover:border-neutral-300 hover:bg-white/90 hover:text-neutral-900 dark:border-neutral-600/80 dark:bg-neutral-900/75 dark:text-neutral-200 dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] dark:hover:border-neutral-500 dark:hover:bg-neutral-800/90 dark:hover:text-white"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      aria-hidden
    >
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a8.5 8.5 0 1 0 11.5 11.5Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2v2.25M12 19.75V22M4.22 4.22l1.59 1.59M18.19 18.19l1.59 1.59M2 12h2.25M19.75 12H22M4.22 19.78l1.59-1.59M18.19 5.81l1.59-1.59" />
    </svg>
  );
}
