export interface WorkConfig {
  type: "work";
  technologies: string[];
  current: boolean;
}

export interface EducationConfig {
  type: "education";
}

interface ExperienceJson {
  work: WorkConfig[];
  education: EducationConfig[];
}

/**
 * Editable via the admin panel (Deneyim tab) — writes go straight to data/experience.json.
 * Loaded with a dynamic import so server components see the current file on every render.
 */
export async function getExperienceConfig(): Promise<ExperienceJson> {
  const mod = await import("./data/experience.json");
  return mod.default as ExperienceJson;
}
