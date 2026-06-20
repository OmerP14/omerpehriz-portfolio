export interface WorkConfig {
  type: "work";
  technologies: string[];
  current: boolean;
}

export interface EducationConfig {
  type: "education";
}

export const workExperienceConfig: WorkConfig[] = [
  {
    type: "work",
    technologies: ["Next.js", "React Native", "Node.js", "Supabase", "TypeScript"],
    current: true,
  },
  {
    type: "work",
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
    current: false,
  },
  {
    type: "work",
    technologies: ["React", "JavaScript", "CSS", "REST APIs"],
    current: false,
  },
];

export const educationConfig: EducationConfig[] = [{ type: "education" }];
