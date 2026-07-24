import type { SoftwareProjectData, GithubLink } from "@/content/projects";

export function getGithubLinks(project: SoftwareProjectData): GithubLink[] {
  if (project.githubLinks?.length) return project.githubLinks;
  if (project.repoVisibility === "public" && project.githubUrl) {
    return [{ label: "GitHub", url: project.githubUrl }];
  }
  return [];
}

export function hasLiveDemo(project: SoftwareProjectData): boolean {
  return Boolean(project.liveUrl && project.liveUrl !== "#");
}
