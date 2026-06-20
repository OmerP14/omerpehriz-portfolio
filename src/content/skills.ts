import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    icon: "Monitor",
    items: [
      { name: "React", color: "#61DAFB", level: 95 },
      { name: "Next.js", color: "#ffffff", level: 92 },
      { name: "TypeScript", color: "#3178C6", level: 90 },
      { name: "Tailwind CSS", color: "#06B6D4", level: 93 },
      { name: "React Native", color: "#61DAFB", level: 82 },
      { name: "Framer Motion", color: "#BB4BFF", level: 78 },
    ],
  },
  {
    category: "Backend",
    icon: "Server",
    items: [
      { name: "Node.js", color: "#339933", level: 87 },
      { name: "Express", color: "#ffffff", level: 86 },
      { name: "Supabase", color: "#3ECF8E", level: 88 },
      { name: "PostgreSQL", color: "#4169E1", level: 82 },
      { name: "REST APIs", color: "#FF6C37", level: 92 },
      { name: "WebSockets", color: "#010101", level: 75 },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: "Wrench",
    items: [
      { name: "Git", color: "#F05032", level: 92 },
      { name: "Docker", color: "#2496ED", level: 76 },
      { name: "Vercel", color: "#ffffff", level: 90 },
      { name: "Figma", color: "#F24E1E", level: 72 },
      { name: "Linux", color: "#FCC624", level: 78 },
      { name: "CI/CD", color: "#2088FF", level: 74 },
    ],
  },
];
