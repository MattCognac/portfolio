export const siteTitle = "Matt Hennessy · Designer, Developer & Photographer";

export const siteDescription =
  "Matt Hennessy — a PNW-based designer, developer, and adventure photographer. Explore projects, photography, and more.";

export function getSiteUrl() {
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mattcognac.com";
  const withProtocol = /^https?:\/\//.test(rawSiteUrl)
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;

  return withProtocol.replace(/\/+$/, "");
}

export function getAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getSiteUrl()}${normalizedPath === "/" ? "" : normalizedPath}`;
}
