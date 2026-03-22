"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";

export function applyTheme(nextDark: boolean) {
  document.documentElement.classList.toggle("dark", nextDark);
  localStorage.setItem(STORAGE_KEY, nextDark ? "dark" : "light");
}

function subscribe(callback: () => void) {
  const el = document.documentElement;
  const observer = new MutationObserver(callback);
  observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot(): boolean {
  return true;
}

/** Subscribes to `html.dark` so components re-render when the theme toggles. */
export function useThemeIsDark() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
