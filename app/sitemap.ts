import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { newsArticles } from "@/data/news";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about/",
    "/leadership/",
    "/events/",
    "/membership/",
    "/get-involved/",
    "/news/",
    "/sponsors/",
    "/governing-documents/",
    "/donate/",
    "/contact/",
    "/privacy/",
    "/accessibility/",
  ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: `${siteConfig.url}/news/${article.slug}/`,
    lastModified: article.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
