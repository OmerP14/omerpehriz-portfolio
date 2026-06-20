import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { projects } from "@/content/projects";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { generatePageMetadata } from "@/lib/metadata";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("projects");
  const items = t.raw("items") as Record<
    string,
    { title: string; description: string }
  >;

  const projectData = projects.find((p) => p.slug === slug);
  if (!projectData || !items[slug]) return {};

  return generatePageMetadata({
    title: items[slug].title,
    description: items[slug].description,
    path: `/projects/${slug}`,
  });
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

  const localizedProject = { ...projectData, ...items[slug] };

  return <ProjectDetail project={localizedProject} />;
}
