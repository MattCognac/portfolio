"use client";

import type { FormEvent } from "react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowIcon,
  PanelButtonGrid,
  PanelOverlays,
  type PanelKey,
} from "@/components/home/HomePagePanels";
import { FluidBackdrop } from "@/components/fluid/FluidBackdrop";
import { siteContent } from "@/data/portfolio";
import { useThemeAnimationReplayNonce } from "@/lib/useThemeAnimationReplay";

const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggle").then((m) => m.ThemeToggle),
  { ssr: false },
);

export function HomePage() {
  const c = siteContent;
  const [message, setMessage] = useState("");
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const themeAnimNonce = useThemeAnimationReplayNonce();

  const emailLink = useMemo(
    () => c.socials.find((item) => item.url.startsWith("mailto:"))?.url,
    [c.socials],
  );

  useEffect(() => {
    if (!activePanel) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePanel]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailLink) return;

    const subject = "Portfolio inquiry";
    const body = message.trim() || "Hey Matt,";
    window.location.href = `${emailLink}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <FluidBackdrop />

      <ThemeToggle />

      <div className="relative flex h-dvh max-h-dvh items-center justify-center overflow-hidden bg-transparent text-neutral-800 dark:text-neutral-200">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] flex justify-center overflow-hidden">
          <div
            className="select-none bg-gradient-to-b from-neutral-300/22 to-neutral-300/0 bg-clip-text text-[4.85rem] font-black leading-none text-transparent dark:from-neutral-500/18 dark:to-neutral-500/0 sm:text-[7.25rem] md:text-[9.25rem] lg:text-[12rem]"
            style={{ marginBottom: "-0.14em" }}
            aria-hidden
          >
            {c.watermark}
          </div>
        </div>

        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-5 pb-28 pt-16 sm:pb-32 sm:pt-12">
          <div
            key={themeAnimNonce}
            className="flex w-full flex-col items-center"
          >
            <header className="home-animate-in home-delay-0 flex max-w-2xl flex-col items-center text-center">
              <h1 className="home-hero-title text-balance text-[2.55rem] font-bold tracking-tight sm:text-[2.85rem] md:text-[4rem]">
                {c.headline}
              </h1>
              <p className="mt-3 max-w-md text-pretty text-center text-sm font-normal leading-relaxed text-neutral-600 dark:text-neutral-400 sm:mt-4 sm:max-w-lg sm:text-base">
                {(Array.isArray(c.subtext) ? c.subtext : [c.subtext]).map(
                  (line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 ? <br /> : null}
                    </span>
                  ),
                )}
              </p>
            </header>

            <div className="home-animate-in home-delay-1 mt-8 h-32 w-32 overflow-hidden rounded-[1.85rem] border border-neutral-200/80 bg-white/42 shadow-[0_12px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm dark:border-neutral-700/65 dark:bg-neutral-950/45 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:h-36 sm:w-36 md:h-40 md:w-40">
              {c.avatarSrc ? (
                <Image
                  src={c.avatarSrc}
                  alt={c.avatarAlt}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-lime-50 text-4xl font-semibold text-sky-900/35 dark:from-sky-950 dark:to-lime-950 dark:text-sky-200/30 sm:text-5xl"
                  aria-hidden
                >
                  MH
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="home-animate-in home-delay-2 mt-6 w-full max-w-[22rem] sm:max-w-[26rem] md:max-w-[28rem]"
            >
              <label htmlFor="hero-message" className="sr-only">
                Send Matt a message
              </label>
              <div className="mx-auto flex items-center rounded-full border border-neutral-200/80 bg-white/55 py-2 pl-5 pr-2 shadow-[0_15px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-neutral-700/70 dark:bg-neutral-950/50 dark:shadow-[0_15px_50px_rgba(0,0,0,0.35)]">
                <input
                  id="hero-message"
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Say hi…"
                  className="w-full bg-transparent text-base text-neutral-700 outline-none placeholder:text-neutral-500 dark:text-neutral-200 dark:placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-500 text-white transition hover:bg-neutral-700 dark:bg-neutral-400 dark:hover:bg-neutral-300"
                  aria-label="Send message"
                >
                  <ArrowIcon />
                </button>
              </div>
            </form>

            <PanelButtonGrid onSelect={setActivePanel} />
          </div>
        </div>
      </div>

      <PanelOverlays
        activePanel={activePanel}
        onClose={() => setActivePanel(null)}
        c={c}
      />
    </>
  );
}
