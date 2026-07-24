import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSoftwareProjects } from "@/content/projects";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { generatePageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

function toLocale(locale: string): "tr" | "en" {
  return locale === "en" ? "en" : "tr";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const projects = await getSoftwareProjects(toLocale(locale));
  const projectData = projects.find((p) => p.slug === slug);
  if (!projectData) return {};
  return generatePageMetadata({
    title: projectData.title,
    description: projectData.description,
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
  const { locale, slug } = await params;
  const projects = await getSoftwareProjects(toLocale(locale));
  const projectData = projects.find((p) => p.slug === slug);
  if (!projectData) notFound();

  const localizedProject = {
    ...projectData,
    screenshots: getExtraScreenshots(slug),
  };

  return <ProjectDetail project={localizedProject} />;
}
