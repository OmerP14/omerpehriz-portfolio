export interface TestimonialData {
  id: number;
  name: string;
  company: string;
  rating: number;
}

/** Loaded with a dynamic import so server components see the current file on every render. */
export async function getTestimonials(): Promise<TestimonialData[]> {
  const mod = await import("./data/testimonials.json");
  return mod.default as TestimonialData[];
}
