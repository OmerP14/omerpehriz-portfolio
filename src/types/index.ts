import type { SoftwareProjectData, DesignProjectData } from "@/content/projects";

export interface Project extends SoftwareProjectData {
  title: string;
  description: string;
  longDescription: string;
  problem?: string;
  solution?: string;
  features?: string[];
}

export interface DesignProject extends DesignProjectData {
  title: string;
  description: string;
}

export interface SkillItem {
  name: string;
  color: string;
  level: number;
}

export interface SkillGroup {
  category: string;
  icon: string;
  items: SkillItem[];
}

export interface ExperienceItem {
  type: "work" | "education";
  role?: string;
  degree?: string;
  company?: string;
  institution?: string;
  period: string;
  description: string;
  technologies?: string[];
  current?: boolean;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  highlight: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}
