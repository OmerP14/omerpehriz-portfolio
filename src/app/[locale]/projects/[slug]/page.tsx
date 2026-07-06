import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { projects } from "@/content/projects";
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
  const projectData = projects.find((p) => p.slug === slug);
  if (!projectData || !items[slug]) return {};
  return generatePageMetadata({
    title: items[slug].title,
    description: items[slug].description,
    path: `/projects/${slug}`,
  });
}

function getProjectImages(slug: string): { main: string | null; screenshots: string[] } {
  const dir = path.join(process.cwd(), "public/images/projects");
  if (!fs.existsSync(dir)) return { main: null, screenshots: [] };
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  const main = files.find((f) => new RegExp(`^${slug}\\.(png|jpg|jpeg|webp)$`, "i").test(f));
  const screenshots = files
    .filter((f) => new RegExp(`^${slug}-\\d+\\.`, "i").test(f))
    .sort()
    .map((f) => `/images/projects/${f}`);
  return { main: main ? `/images/projects/${main}` : null, screenshots };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("projects");
  const items = t.raw("items") as Record<
    string,
    { title: string; description: string; longDescription: string }
  >;

  const projectData = projects.find((p) => p.slug === slug);
  if (!projectData || !items[slug]) notFound();

  const { main, screenshots } = getProjectImages(slug);
  const localizedProject = {
    ...projectData,
    ...items[slug],
    image: main ?? projectData.image,
    screenshots,
  };

  return <ProjectDetail project={localizedProject} />;
}
