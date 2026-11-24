import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          // Trailing slash / "$" so "/lawyer" never blocks the public "/lawyers/..." pages.
          "/admin/",
          "/admin$",
          "/client/",
          "/client$",
          "/lawyer/",
          "/lawyer$",
          "/onboarding",
          "/login",
          "/register",
          "/card-stack",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
