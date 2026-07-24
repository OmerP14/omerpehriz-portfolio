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
 * Structural data (technologies/current) lives here; role/company/period/description text
 * lives in messages/{locale}.json under experience.work / experience.education.
 * Loaded with a dynamic import so server components see the current file on every render.
 */
export async function getExperienceConfig(): Promise<ExperienceJson> {
  const mod = await import("./data/experience.json");
  return mod.default as ExperienceJson;
}
