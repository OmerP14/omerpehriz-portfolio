import type { MetadataRoute } from "next";
import { getSoftwareProjects } from "@/content/projects";

const BASE_URL = "https://omerpehriz.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getSoftwareProjects();
  const projectEntries = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projectEntries,
  ];
}
