import type { MetadataRoute } from "next";
import { listBlogs } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const blogs = await listBlogs();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/podcast",
    "/blog",
    "/testimonials",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${base}/blog/${encodeURIComponent(String(b.slug))}`,
    lastModified: b.createdAt ? new Date(b.createdAt as string | Date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
