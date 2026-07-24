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
  /** Rendered as the large showcase card above the featured grid. Only one project should set this. */
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

interface ProjectsJson {
  software: SoftwareProjectData[];
  design: DesignProjectData[];
}

/**
 * Editable via the admin panel (Yazılım/Tasarım Projeleri tabs) — writes go straight to
 * data/projects.json. Loaded with a dynamic import (not a static top-level one) so server
 * components see the current file on every render instead of a stale bundle-time snapshot.
 */
async function loadProjectsJson(): Promise<ProjectsJson> {
  const mod = await import("./data/projects.json");
  return mod.default as ProjectsJson;
}

export async function getSoftwareProjects(): Promise<SoftwareProjectData[]> {
  return (await loadProjectsJson()).software;
}

export async function getDesignProjects(): Promise<DesignProjectData[]> {
  return (await loadProjectsJson()).design;
}
