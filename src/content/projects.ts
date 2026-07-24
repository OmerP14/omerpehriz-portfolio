import type { Project, DesignProject } from "@/types";

export type RepoVisibility = "public" | "private" | "none";

export interface GithubLink {
  label: string;
  url: string;
}

export interface SoftwareProjectData {
  id: number;
  slug: string;
  type: "software";
  technologies: string[];
  category: string;
  /** Shown in the "Öne Çıkan Projeler" grid. */
  featured: boolean;
  /** The first project in data/projects.json is always the big showcase card. */
  hero?: boolean;
  /** Path under /public, e.g. "/projects/slug.webp". Swap the file in place to update the screenshot. */
  image: string;
  screenshots: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Use when a project ships as separate repos (e.g. frontend/backend). */
  githubLinks?: GithubLink[];
  year: string;
  /** Literal status label shown on the card/detail badge (e.g. "In Active Development"). */
  status: string;
  repoVisibility: RepoVisibility;
  /** Extra badges shown on the project detail page (e.g. "University Graduation Project"). */
  tags?: string[];
}

export interface DesignProjectData {
  id: number;
  slug: string;
  type: "design";
  designCategory: string;
  tools: string[];
  featured: boolean;
  image: string;
  year: string;
}

export type AnyProjectData = SoftwareProjectData | DesignProjectData;

interface SoftwareText {
  title: string;
  description: string;
  longDescription: string;
  problem?: string;
  solution?: string;
  features?: string[];
}

interface DesignText {
  title: string;
  description: string;
}

interface RawSoftwareEntry
  extends Omit<SoftwareProjectData, "id" | "type" | "hero" | "screenshots"> {
  screenshots?: string[];
  tr: SoftwareText;
  en: SoftwareText;
}

interface RawDesignEntry extends Omit<DesignProjectData, "id" | "type" | "image"> {
  image?: string;
  tr: DesignText;
  en: DesignText;
}

interface ProjectsJson {
  software: RawSoftwareEntry[];
  design: RawDesignEntry[];
}

type Locale = "tr" | "en";

/**
 * All project data and copy (TR + EN in one place) lives in data/projects.json — one object
 * per project, see docs/projeler.md for the template. Loaded with a dynamic import (not a
 * static top-level one) so server components see the current file on every render instead of
 * a stale bundle-time snapshot.
 */
async function loadProjectsJson(): Promise<ProjectsJson> {
  const mod = await import("./data/projects.json");
  return mod.default as unknown as ProjectsJson;
}

export async function getSoftwareProjects(locale: Locale): Promise<Project[]> {
  const { software } = await loadProjectsJson();
  return software.map((entry, index) => {
    const { tr, en, screenshots, ...structural } = entry;
    const text = locale === "en" ? en : tr;
    const data: SoftwareProjectData = {
      ...structural,
      id: index + 1,
      type: "software",
      hero: index === 0,
      screenshots: screenshots ?? [],
    };
    return { ...data, ...text };
  });
}

export async function getDesignProjects(locale: Locale): Promise<DesignProject[]> {
  const { design } = await loadProjectsJson();
  return design.map((entry, index) => {
    const { tr, en, image, ...structural } = entry;
    const text = locale === "en" ? en : tr;
    const data: DesignProjectData = {
      ...structural,
      id: index + 1,
      type: "design",
      image: image ?? "",
    };
    return { ...data, ...text };
  });
}
