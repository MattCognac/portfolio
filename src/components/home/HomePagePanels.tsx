import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { PhotographyPanel } from "@/components/home/PhotographyPanel";
import { SkillsPanel } from "@/components/home/SkillsPanel";
import type { SiteContent } from "@/lib/types";

export type PanelKey = "me" | "projects" | "skills" | "photography" | "contact";

function CardIcon({ kind }: { kind: PanelKey }) {
  if (kind === "me") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 19c1.2-3.1 4-4.65 6.5-4.65S17.3 15.9 18.5 19" />
      </svg>
    );
  }

  if (kind === "projects") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="6" width="16" height="12" rx="2.5" />
        <path d="M9 6V4.75A1.75 1.75 0 0 1 10.75 3h2.5A1.75 1.75 0 0 1 15 4.75V6" />
      </svg>
    );
  }

  if (kind === "skills") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4 5 7.5 12 11l7-3.5L12 4Z" />
        <path d="M5 12.25 12 15.75l7-3.5" />
        <path d="M5 16.25 12 19.75l7-3.5" />
      </svg>
    );
  }

  if (kind === "photography") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5.5 8.5A2.5 2.5 0 0 1 8 6h8a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 16 18H8a2.5 2.5 0 0 1-2.5-2.5Z" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M8.75 6 9.7 4.6A1 1 0 0 1 10.52 4h2.96a1 1 0 0 1 .82.6L15.25 6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5 12 13l8-5.5" />
      <rect x="4" y="6" width="16" height="12" rx="2.5" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function PanelCard({
  label,
  kind,
  onClick,
}: {
  label: string;
  kind: PanelKey;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-[1.15rem] border border-neutral-200/75 bg-white/42 px-2.5 py-2.5 text-[0.72rem] font-medium text-neutral-700 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl transition hover:border-neutral-300 hover:bg-white/62 hover:text-neutral-900 active:scale-[0.98] dark:border-neutral-700/70 dark:bg-neutral-950/45 dark:text-neutral-300 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] dark:hover:border-neutral-600 dark:hover:bg-neutral-900/55 dark:hover:text-neutral-100 sm:min-h-[4.75rem] sm:text-[0.8rem]"
    >
      <span className="text-neutral-500 transition group-hover:text-sky-600 dark:text-neutral-400 dark:group-hover:text-sky-400">
        <CardIcon kind={kind} />
      </span>
      <span>{label}</span>
    </button>
  );
}

function Panel({
  title,
  onClose,
  children,
  maxWidthClassName = "max-w-xl",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
}) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-white/18 px-4 backdrop-blur-sm dark:bg-neutral-950/40">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full ${maxWidthClassName} overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white/76 shadow-[0_25px_100px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:border-neutral-700/70 dark:bg-neutral-900/88 dark:shadow-[0_25px_100px_rgba(0,0,0,0.55)]`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-5 py-4 dark:border-neutral-700/70 sm:px-6">
          <h2
            id={titleId}
            className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 sm:text-base"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-200/90 bg-white/65 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600/85 dark:bg-neutral-800/80 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="hide-scrollbar max-h-[65vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

const PANEL_CARDS: { label: string; kind: PanelKey }[] = [
  { label: "My Story", kind: "me" },
  { label: "Projects", kind: "projects" },
  { label: "Skills", kind: "skills" },
  { label: "Photography", kind: "photography" },
  { label: "Contact", kind: "contact" },
];

const PROJECT_TAB_ORDER = ["Personal Projects", "Client Projects"] as const;
const DEFAULT_PROJECT_TAB = "Personal Projects";

export function PanelButtonGrid({
  onSelect,
}: {
  onSelect: (key: PanelKey) => void;
}) {
  return (
    <div className="home-panel-grid mt-6 grid w-full max-w-[26rem] grid-cols-3 gap-2.5 sm:mt-7 sm:max-w-[34rem] sm:grid-cols-5 sm:gap-3">
      {PANEL_CARDS.map(({ label, kind }) => (
        <PanelCard key={kind} label={label} kind={kind} onClick={() => onSelect(kind)} />
      ))}
    </div>
  );
}

function SocialIcon({
  kind,
  className = "h-5 w-5",
}: {
  kind: SiteContent["socials"][number]["kind"];
  className?: string;
}) {
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.25" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (kind === "github") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3.75a8.25 8.25 0 0 0-2.6 16.08c.4.08.55-.17.55-.38v-1.48c-2.23.48-2.7-.95-2.7-.95-.36-.93-.9-1.18-.9-1.18-.73-.5.05-.5.05-.5.82.06 1.24.84 1.24.84.71 1.23 1.87.87 2.33.66.07-.53.29-.88.52-1.08-1.78-.2-3.66-.89-3.66-3.97 0-.88.31-1.6.83-2.16-.09-.2-.36-1.03.08-2.14 0 0 .68-.22 2.22.82a7.7 7.7 0 0 1 4.04 0c1.54-1.04 2.22-.82 2.22-.82.44 1.11.17 1.94.09 2.14.52.56.82 1.28.82 2.16 0 3.09-1.88 3.76-3.67 3.96.29.25.55.73.55 1.49v2.2c0 .21.14.46.55.38A8.25 8.25 0 0 0 12 3.75Z" />
      </svg>
    );
  }

  if (kind === "x") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 4.5h3.15l4.14 5.64L16.98 4.5H19l-5.8 6.64L19.5 19.5h-3.16l-4.52-6.14L6.45 19.5H4.5l6.05-6.93L5 4.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5 12 13l8-5.5" />
      <rect x="4" y="6" width="16" height="12" rx="2.5" />
    </svg>
  );
}

function ContactPanel({
  socials,
}: {
  socials: SiteContent["socials"];
}) {
  const email = socials.find((item) => item.kind === "email");
  const featuredSocials = socials.filter((item) => item.kind !== "email");

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          Reach out
        </p>
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Pick the channel that fits best. Social links open in a new tab, and email opens your mail app.
        </p>
      </div>

      {email ? (
        <a
          href={email.url}
          className="block rounded-[1.45rem] border border-sky-200/90 bg-gradient-to-br from-sky-100/85 via-white/90 to-cyan-100/80 p-5 text-neutral-900 transition hover:border-sky-300 hover:shadow-[0_18px_50px_rgba(14,165,233,0.14)] dark:border-sky-500/35 dark:from-sky-500/12 dark:via-neutral-950/82 dark:to-cyan-500/10 dark:text-neutral-100 dark:hover:border-sky-400/50"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-sky-700 shadow-[0_10px_30px_rgba(255,255,255,0.45)] dark:bg-neutral-900/85 dark:text-sky-300">
                <SocialIcon kind={email.kind} />
              </div>
              <p className="min-w-0 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700/80 dark:text-sky-300/80">
                {email.eyebrow}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-sky-300/80 bg-white/70 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-400/40 dark:bg-neutral-900/80 dark:text-sky-300">
              {email.ctaLabel ?? "Email"}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{email.label}</h3>
          {email.description ? (
            <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-700 dark:text-neutral-300">
              {email.description}
            </p>
          ) : null}
          {email.handle ? (
            <p className="mt-4 text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {email.handle}
            </p>
          ) : null}
        </a>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        {featuredSocials.map((item) => (
          <a
            key={item.label}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group flex h-full flex-col rounded-[1.35rem] border border-neutral-200/80 bg-white/58 p-4 transition hover:border-neutral-300 hover:bg-white/82 hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] dark:border-neutral-700/70 dark:bg-neutral-950/50 dark:hover:border-neutral-600 dark:hover:bg-neutral-900/65 dark:hover:shadow-[0_16px_45px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white/78 text-neutral-700 transition group-hover:border-sky-200 group-hover:text-sky-700 dark:border-neutral-700/70 dark:bg-neutral-900/78 dark:text-neutral-200 dark:group-hover:border-sky-500/30 dark:group-hover:text-sky-300">
                <SocialIcon kind={item.kind} />
              </div>
              <span className="min-w-0 text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                {item.eyebrow}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {item.label}
              </h3>
              {item.handle ? (
                <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {item.handle}
                </p>
              ) : null}
            </div>

            {item.description ? (
              <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            ) : <div className="mt-3 flex-1" />}

            <div className="mt-4 flex items-center justify-between text-sm font-medium text-neutral-700 transition group-hover:text-sky-700 dark:text-neutral-300 dark:group-hover:text-sky-300">
              <span>{item.ctaLabel ?? "Open profile"}</span>
              <ArrowIcon />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function ProjectsPanel({
  projects,
}: {
  projects: SiteContent["projects"];
}) {
  const orderedProjectGroups = useMemo(() => {
    const remainingGroups = [...projects];
    const orderedGroups = PROJECT_TAB_ORDER.map((title) => {
      const matchIndex = remainingGroups.findIndex((group) => group.title === title);
      if (matchIndex === -1) return null;

      const [match] = remainingGroups.splice(matchIndex, 1);
      return match;
    }).filter((group) => group !== null);

    return [...orderedGroups, ...remainingGroups];
  }, [projects]);

  const [activeProjectGroupTitle, setActiveProjectGroupTitle] =
    useState(DEFAULT_PROJECT_TAB);

  const activeProjectGroup =
    orderedProjectGroups.find((group) => group.title === activeProjectGroupTitle) ??
    orderedProjectGroups[0];

  return (
    <div className="flex h-[min(60vh,31rem)] flex-col gap-4">
      <div className="grid shrink-0 grid-cols-2 gap-2">
        {orderedProjectGroups.map((group) => {
          const isActive = group.title === activeProjectGroup?.title;

          return (
            <button
              key={group.title}
              type="button"
              onClick={() => setActiveProjectGroupTitle(group.title)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-sky-400/90 bg-white/75 text-sky-700 shadow-[0_0_0_1px_rgba(56,189,248,0.35),0_0_24px_rgba(56,189,248,0.22)] dark:border-sky-400/70 dark:bg-neutral-950/70 dark:text-sky-300 dark:shadow-[0_0_0_1px_rgba(56,189,248,0.3),0_0_24px_rgba(56,189,248,0.16)]"
                  : "border-neutral-200/90 bg-white/60 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700/70 dark:bg-neutral-950/50 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
              }`}
            >
              {group.title.replace(" Projects", "")}
            </button>
          );
        })}
      </div>

      {activeProjectGroup ? (
        <section className="flex min-h-0 flex-1 flex-col gap-3">
          <h3 className="shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
            {activeProjectGroup.title}
          </h3>

          <div className="hide-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {activeProjectGroup.items.map((project) => (
              <a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-[1.35rem] border border-neutral-200/80 bg-white/55 p-4 transition hover:border-neutral-300 hover:bg-white/78 dark:border-neutral-700/70 dark:bg-neutral-950/50 dark:hover:border-neutral-600 dark:hover:bg-neutral-900/65"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 sm:text-base">
                    {project.title}
                  </h4>
                  <span className="text-xs font-medium text-sky-700 dark:text-sky-400">
                    Visit
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {project.description}
                </p>
                {project.stack?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-neutral-100/95 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function PanelOverlays({
  activePanel,
  onClose,
  c,
}: {
  activePanel: PanelKey | null;
  onClose: () => void;
  c: SiteContent;
}) {
  return (
    <>
      {activePanel === "me" ? (
        <Panel title="My Story" onClose={onClose}>
          <div className="space-y-4 text-pretty text-sm leading-7 text-neutral-700 dark:text-neutral-300 sm:text-base">
            {(Array.isArray(c.about) ? c.about : [c.about]).map(
              (paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ),
            )}
          </div>
        </Panel>
      ) : null}

      {activePanel === "projects" ? (
        <Panel title="Projects" onClose={onClose}>
          <ProjectsPanel projects={c.projects} />
        </Panel>
      ) : null}

      {activePanel === "skills" ? (
        <Panel title="Skills" onClose={onClose}>
          <SkillsPanel skills={c.skills} />
        </Panel>
      ) : null}

      {activePanel === "photography" ? (
        <Panel title="Photography" onClose={onClose}>
          <PhotographyPanel photos={c.photos} />
        </Panel>
      ) : null}

      {activePanel === "contact" ? (
        <Panel
          title="Contact"
          onClose={onClose}
          maxWidthClassName="max-w-4xl"
        >
          <ContactPanel socials={c.socials} />
        </Panel>
      ) : null}
    </>
  );
}
