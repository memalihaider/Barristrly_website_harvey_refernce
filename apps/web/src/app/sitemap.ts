import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";
import {
  LEGAL_SERVICES,
  SEO_CITIES,
  allPracticeSlugs,
} from "@/lib/marketing/seo-slugs";
import { listPublishedPosts } from "@/lib/content/blog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });

  const staticPages = [
    entry("/", 1, "weekly"),
    entry("/services", 0.9, "weekly"),
    entry("/pricing", 0.9),
    entry("/ai/intake", 0.8),
    entry("/request-demo", 0.8),
    entry("/how-it-works", 0.7),
    entry("/about", 0.6),
    entry("/practice", 0.6),
    entry("/practice/apply", 0.5),
    entry("/resources", 0.6, "weekly"),
    entry("/blog", 0.7, "weekly"),
    entry("/security", 0.4),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];

  const services = SERVICE_CATALOG.map((s) => entry(s.href, 0.9));
  const legalServices = LEGAL_SERVICES.map((s) =>
    entry(`/legal-services/${s.slug}`, 0.8),
  );

  const practices = allPracticeSlugs();
  const lawyerPages = practices.map((p) => entry(`/lawyers/${p.slug}`, 0.6));
  for (const p of practices.slice(0, 6)) {
    for (const city of SEO_CITIES) {
      lawyerPages.push(entry(`/lawyers/${p.slug}/${city.slug}`, 0.6));
    }
  }

  let posts: MetadataRoute.Sitemap = [];
  try {
    const list = await listPublishedPosts(200);
    posts = list.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at || now),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Blog backend unavailable at build time — skip posts.
  }

  return [...staticPages, ...services, ...legalServices, ...lawyerPages, ...posts];
}
