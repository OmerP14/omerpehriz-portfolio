import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getSoftwareProjects, getDesignProjects } from "@/content/projects";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const loc = locale === "en" ? "en" : "tr";

  const [softwareProjects, designProjects] = await Promise.all([
    getSoftwareProjects(loc),
    getDesignProjects(loc),
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection softwareProjects={softwareProjects} designProjects={designProjects} />
      <ServicesSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
