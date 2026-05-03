import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/site";

const routes = ["/", "/about", "/projects", "/skills", "/photography"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
