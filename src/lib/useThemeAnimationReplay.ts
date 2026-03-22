"use client";

import { useEffect, useRef, useState } from "react";
import { useThemeIsDark } from "@/lib/theme";

/**
 * Increments when light/dark mode changes so keyed subtrees remount and CSS
 * entrance animations run again. Skips the first run (initial load) and skips
 * entirely when `prefers-reduced-motion: reduce` is set.
 */
export function useThemeAnimationReplayNonce() {
  const isDark = useThemeIsDark();
  const [nonce, setNonce] = useState(0);
  const prevDarkRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevDarkRef.current === null) {
      prevDarkRef.current = isDark;
      return;
    }
    if (prevDarkRef.current === isDark) return;
    prevDarkRef.current = isDark;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const id = requestAnimationFrame(() => {
      setNonce((n) => n + 1);
    });
    return () => cancelAnimationFrame(id);
  }, [isDark]);

  return nonce;
}
