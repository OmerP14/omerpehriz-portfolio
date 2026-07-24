import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSoftwareProjects } from "@/content/projects";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { generatePageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("projects");
  const items = t.raw("items") as Record<string, { title: string; description: string }>;
  const projects = await getSoftwareProjects();
  const projectData = projects.find((p) => p.slug === slug);
  if (!projectData || !items[slug]) return {};
  return generatePageMetadata({
    title: items[slug].title,
    description: items[slug].description,
    path: `/projects/${slug}`,
  });
}

/** Optional extra gallery screenshots, dropped in as /public/images/projects/<slug>-1.ext, -2.ext, ... */
function getExtraScreenshots(slug: string): string[] {
  const dir = path.join(process.cwd(), "public/images/projects");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  return files
    .filter((f) => new RegExp(`^${slug}-\\d+\\.`, "i").test(f))
    .sort()
    .map((f) => `/images/projects/${f}`);
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("projects");
  const items = t.raw("items") as Record<
    string,
    {
      title: string;
      description: string;
      longDescription: string;
      problem?: string;
      solution?: string;
      features?: string[];
    }
  >;

  const projects = await getSoftwareProjects();
  const projectData = projects.find((p) => p.slug === slug);
  if (!projectData || !items[slug]) notFound();

  const localizedProject = {
    ...projectData,
    ...items[slug],
    screenshots: getExtraScreenshots(slug),
  };

  return <ProjectDetail project={localizedProject} />;
}
