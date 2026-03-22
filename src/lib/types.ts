export type ProjectLink = {
  title: string;
  description: string;
  url: string;
  stack?: string[];
};

export type ProjectGroup = {
  title: string;
  items: ProjectLink[];
};

export type SocialLink = {
  kind: "email" | "instagram" | "github" | "x";
  label: string;
  url: string;
  handle?: string;
  eyebrow?: string;
  description?: string;
  ctaLabel?: string;
};

export type SkillStrength = {
  label: string;
  value: number;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type SkillsContent = {
  focusAreas: SkillStrength[];
  groups: SkillGroup[];
};

export type PhotoItem = {
  thumbSrc: string;
  fullSrc: string;
  alt: string;
  width: number;
  height: number;
  story?: string;
};

export type SiteContent = {
  /** Large watermark along the bottom (e.g. last name) */
  watermark: string;
  /** Main hero heading */
  headline: string;
  /** Supporting line(s) under the hero heading */
  subtext: string | string[];
  avatarSrc?: string;
  avatarAlt: string;
  about: string | string[];
  photography: string | string[];
  photos: PhotoItem[];
  projects: ProjectGroup[];
  skills: SkillsContent;
  socials: SocialLink[];
};
