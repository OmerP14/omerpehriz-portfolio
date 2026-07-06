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
    slug: "workify-ai",
    type: "software",
    technologies: ["React", "Node.js", "OpenAI API", "PostgreSQL", "Supabase", "JavaScript"],
    category: "Web App",
    featured: true,
    image: "/images/projects/workify-ai.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2024",
  },
  {
    id: 2,
    slug: "easy-home-rent",
    type: "software",
    technologies: ["HTML", "CSS", "JavaScript", "Java", "PostgreSQL"],
    category: "Web App",
    featured: true,
    image: "/images/projects/easy-home-rent.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2024",
  },
  {
    id: 3,
    slug: "myfitly",
    type: "software",
    technologies: ["React Native", "Expo", "JavaScript", "Supabase"],
    category: "Mobile App",
    featured: true,
    image: "/images/projects/myfitly.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2023",
  },
  {
    id: 4,
    slug: "firefighting-drone",
    type: "software",
    technologies: ["Python", "Arduino", "C++", "Embedded Systems"],
    category: "Embedded",
    featured: false,
    image: "/images/projects/firefighting-drone.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2025",
  },
  {
    id: 5,
    slug: "iot-smart-monitoring",
    type: "software",
    technologies: ["Arduino", "Python", "MQTT", "Sensors"],
    category: "IoT",
    featured: false,
    image: "/images/projects/iot-monitoring.png",
    screenshots: [],
    liveUrl: "#",
    githubUrl: "#",
    year: "2024",
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
