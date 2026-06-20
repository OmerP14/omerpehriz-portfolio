export interface SoftwareProjectData {
  id: number;
  slug: string;
  type: "software";
  technologies: string[];
  category: string;
  featured: boolean;
  image: string;
  screenshots: string[];
  liveUrl: string;
  githubUrl: string;
  year: string;
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

export const softwareProjects: SoftwareProjectData[] = [
  {
    id: 1,
    slug: "saas-analytics-dashboard",
    type: "software",
    technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Recharts", "PostgreSQL"],
    category: "Web App",
    featured: true,
    image: "/images/projects/saas-dashboard.png",
    screenshots: [
      "/images/projects/saas-dashboard-1.png",
      "/images/projects/saas-dashboard-2.png",
    ],
    liveUrl: "#",
    githubUrl: "#",
    year: "2024",
  },
  {
    id: 2,
    slug: "ecommerce-mobile-app",
    type: "software",
    technologies: ["React Native", "TypeScript", "Expo", "Stripe", "Node.js", "PostgreSQL"],
    category: "Mobile App",
    featured: true,
    image: "/images/projects/ecommerce-app.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2024",
  },
  {
    id: 3,
    slug: "restaurant-management-system",
    type: "software",
    technologies: ["Next.js", "Node.js", "Express", "PostgreSQL", "Socket.io", "Tailwind CSS"],
    category: "Web App",
    featured: true,
    image: "/images/projects/restaurant-pos.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2023",
  },
  {
    id: 4,
    slug: "ai-content-platform",
    type: "software",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "Supabase", "Tailwind CSS", "Tiptap"],
    category: "SaaS",
    featured: false,
    image: "/images/projects/ai-content.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2023",
  },
  {
    id: 5,
    slug: "real-estate-portal",
    type: "software",
    technologies: ["Next.js", "TypeScript", "Mapbox GL", "Supabase", "Tailwind CSS"],
    category: "Web App",
    featured: false,
    image: "/images/projects/real-estate.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2023",
  },
  {
    id: 6,
    slug: "fitness-tracking-app",
    type: "software",
    technologies: ["React Native", "Expo", "TypeScript", "Supabase", "HealthKit"],
    category: "Mobile App",
    featured: false,
    image: "/images/projects/fitness-app.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2022",
  },
];

export const designProjects: DesignProjectData[] = [
  {
    id: 101,
    slug: "restaurant-branding",
    type: "design",
    designCategory: "Marka Kimliği",
    tools: ["Adobe Illustrator", "Adobe Photoshop"],
    featured: true,
    image: "",
    year: "2024",
  },
  {
    id: 102,
    slug: "tech-company-logo",
    type: "design",
    designCategory: "Logo Tasarımı",
    tools: ["Adobe Illustrator", "Figma"],
    featured: true,
    image: "",
    year: "2024",
  },
  {
    id: 103,
    slug: "product-catalog",
    type: "design",
    designCategory: "Katalog",
    tools: ["Adobe InDesign", "Adobe Illustrator", "Adobe Photoshop"],
    featured: true,
    image: "",
    year: "2024",
  },
  {
    id: 104,
    slug: "landing-page-ui",
    type: "design",
    designCategory: "UI Tasarımı",
    tools: ["Figma"],
    featured: false,
    image: "",
    year: "2023",
  },
  {
    id: 105,
    slug: "retail-brand-identity",
    type: "design",
    designCategory: "Marka Kimliği",
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign"],
    featured: false,
    image: "",
    year: "2023",
  },
  {
    id: 106,
    slug: "social-media-kit",
    type: "design",
    designCategory: "Sosyal Medya",
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Figma"],
    featured: false,
    image: "",
    year: "2023",
  },
];

// Legacy export for project detail pages (software only)
export const projects = softwareProjects;
export const featuredProjects = softwareProjects.filter((p) => p.featured);
